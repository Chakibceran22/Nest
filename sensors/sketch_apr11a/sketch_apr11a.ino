#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// DHT11 config
#define DHTPIN 15     // DHT11 connected to GPIO 15
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Sensor Pins
#define MQ2_PIN 34     // Analog pin for MQ2
#define FLAME_PIN 14   // Digital pin for Flame sensor
#define RELAY_PIN 26   // Relay control pin
#define BUZZER_PIN 12   // Buzzer pin
#define LAMP_PIN 21    // Lamp control pin

// WiFi credentials
const char* ssid = "DESKTOP-BPDFGL7 8994";  // Replace with your WiFi or hotspot name
const char* password = "11111111";  // Replace with your WiFi password

// MQTT broker settings
const char* mqtt_server = "192.168.137.1";
const int mqtt_port = 1883;  // Default MQTT port
const char* mqtt_publish_topic = "sensors/esp32/readings";  // Topic for sensor readings
const char* mqtt_subscribe_topic = "sensors/esp32/control";  // Topic for device control
const char* mqtt_status_topic = "sensors/esp32/status";      // Topic for device status

// State variables
bool lampState = false;  // Track lamp state
bool isScreaming = false;  // Track if buzzer is in screaming mode
bool fireAlarmActive = false;  // Persistent fire alarm state
unsigned long lastScreamToggle = 0;  // For controlling scream pattern
int screamFrequency = 800;  // Starting tone for scream

// Update interval
long interval = 5000;  // Send data every 5 seconds (not const to allow dynamic updates)
unsigned long previousMillis = 0;

WiFiClient espClient;
PubSubClient client(espClient);

// Function to publish current device state
void publishState() {
  StaticJsonDocument<200> doc;
  doc["lamp"] = lampState ? 1 : 0;
  doc["fireAlarm"] = fireAlarmActive ? 1 : 0;
  doc["timestamp"] = millis();
  
  char jsonBuffer[200];
  serializeJson(doc, jsonBuffer);
  
  client.publish("sensors/esp32/state", jsonBuffer);
  Serial.print("Published state: ");
  Serial.println(jsonBuffer);
}

// Function to make buzzer "scream" when fire is detected
void screamBuzzer() {
  unsigned long currentMillis = millis();
  
  // Toggle buzzer state every 100ms for a screaming effect
  if (currentMillis - lastScreamToggle > 100) {
    lastScreamToggle = currentMillis;
    
    if (isScreaming) {
      // Toggle the buzzer state
      if (digitalRead(BUZZER_PIN) == HIGH) {
        digitalWrite(BUZZER_PIN, LOW);
        // Change tone for next cycle (for simple digital buzzers this just changes pattern timing)
        screamFrequency = random(600, 1000); 
      } else {
        digitalWrite(BUZZER_PIN, HIGH);
      }
    }
  }
}

// Callback function for incoming messages
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
  
  // Create a buffer to store the payload as a proper C string
  char message[length + 1];
  for (unsigned int i = 0; i < length; i++) {
    message[i] = (char)payload[i];
  }
  message[length] = '\0';  // Null-terminate the string
  
  Serial.print("Message content: ");
  Serial.println(message);
  
  // Parse JSON message
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return;
  }
  
  // Process received commands
  if (doc.containsKey("lamp")) {
    int newLampState = doc["lamp"];
    Serial.print("Setting lamp state to: ");
    Serial.println(newLampState);
    
    lampState = newLampState == 1;
    digitalWrite(LAMP_PIN, lampState ? HIGH : LOW);
    
    // Publish updated state
    publishState();
  }
  
  if (doc.containsKey("buzzer")) {
    int buzzerState = doc["buzzer"];
    Serial.print("Setting buzzer state to: ");
    Serial.println(buzzerState);
    digitalWrite(BUZZER_PIN, buzzerState);
  }
  
  if (doc.containsKey("relay")) {
    int relayState = doc["relay"];
    Serial.print("Setting relay state to: ");
    Serial.println(relayState);
    digitalWrite(RELAY_PIN, relayState);
  }
  
  if (doc.containsKey("resetAlarm")) {
    int resetState = doc["resetAlarm"];
    if (resetState == 1) {
      Serial.println("Resetting fire alarm state");
      fireAlarmActive = false;
      isScreaming = false;
      digitalWrite(BUZZER_PIN, LOW);
      
      // Publish updated state after reset
      publishState();
    }
  }
  
  if (doc.containsKey("interval")) {
    long newInterval = doc["interval"];
    if (newInterval > 1000) {  // Minimum 1 second for safety
      interval = newInterval;
      Serial.print("Setting new publish interval: ");
      Serial.println(interval);
    }
  }
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.println("Connecting to WiFi...");
  Serial.print("SSID: '");
  Serial.print(ssid);
  Serial.println("'");
  
  // Disconnect if already connected
  WiFi.disconnect(true);
  delay(1000);
  
  // Set static IP
  IPAddress staticIP(192, 168, 137, 200);  // Choose unused IP in your network
  IPAddress gateway(192, 168, 137, 1);     // Your hotspot IP
  IPAddress subnet(255, 255, 255, 0);
  IPAddress dns(8, 8, 8, 8);               // Google DNS
  
  if (!WiFi.config(staticIP, gateway, subnet, dns)) {
    Serial.println("Static IP configuration failed!");
  }
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  const int max_attempts = 40;  // 20 seconds timeout
  
  while (WiFi.status() != WL_CONNECTED && attempts < max_attempts) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected successfully!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("");
    Serial.print("WiFi connection failed! Status code: ");
    Serial.println(WiFi.status());
    
    // Print status code meaning
    switch(WiFi.status()) {
      case WL_IDLE_STATUS: 
        Serial.println("WL_IDLE_STATUS - WiFi is changing state");
        break;
      case WL_NO_SSID_AVAIL:
        Serial.println("WL_NO_SSID_AVAIL - SSID not available");
        break;
      case WL_SCAN_COMPLETED:
        Serial.println("WL_SCAN_COMPLETED - Scan completed");
        break;
      case WL_CONNECT_FAILED:
        Serial.println("WL_CONNECT_FAILED - Connection failed");
        break;
      case WL_CONNECTION_LOST:
        Serial.println("WL_CONNECTION_LOST - Connection lost");
        break;
      case WL_DISCONNECTED:
        Serial.println("WL_DISCONNECTED - Disconnected");
        break;
      default:
        Serial.println("Unknown status");
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  int mqtt_attempts = 0;
  const int max_mqtt_attempts = 5;  // Limit MQTT connection attempts
  
  while (!client.connected() && mqtt_attempts < max_mqtt_attempts) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    // Attempt to connect with a clean session
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      
      // Subscribe to the control topic
      client.subscribe(mqtt_subscribe_topic);
      Serial.print("Subscribed to topic: ");
      Serial.println(mqtt_subscribe_topic);
      
      // Send a connection announcement
      StaticJsonDocument<100> doc;
      doc["status"] = "connected";
      doc["device"] = "ESP32";
      doc["lamp"] = lampState ? 1 : 0;
      doc["fireAlarm"] = fireAlarmActive ? 1 : 0;
      
      char jsonBuffer[100];
      serializeJson(doc, jsonBuffer);
      client.publish(mqtt_status_topic, jsonBuffer);
      
      // Also publish current state
      publishState();
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      
      // Print the error message based on the state code
      switch(client.state()) {
        case -4: Serial.print(" (MQTT_CONNECTION_TIMEOUT)"); break;
        case -3: Serial.print(" (MQTT_CONNECTION_LOST)"); break;
        case -2: Serial.print(" (MQTT_CONNECT_FAILED)"); break;
        case -1: Serial.print(" (MQTT_DISCONNECTED)"); break;
        case 1: Serial.print(" (MQTT_CONNECT_BAD_PROTOCOL)"); break;
        case 2: Serial.print(" (MQTT_CONNECT_BAD_CLIENT_ID)"); break;
        case 3: Serial.print(" (MQTT_CONNECT_UNAVAILABLE)"); break;
        case 4: Serial.print(" (MQTT_CONNECT_BAD_CREDENTIALS)"); break;
        case 5: Serial.print(" (MQTT_CONNECT_UNAUTHORIZED)"); break;
      }
      
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
      mqtt_attempts++;
    }
  }
  
  if (!client.connected()) {
    Serial.println("Failed to connect to MQTT after multiple attempts");
  }
}

void setup() {
  Serial.begin(115200);
  
  // Initialize sensors
  dht.begin();
  pinMode(FLAME_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LAMP_PIN, OUTPUT);
  
  // Initial state - all outputs off
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LAMP_PIN, LOW);
  
  // Full WiFi reset
  Serial.println("Resetting WiFi...");
  WiFi.mode(WIFI_OFF);
  delay(1000);
  WiFi.mode(WIFI_STA);
  delay(1000);
  
  setup_wifi();
  
  // Test TCP connection to broker if WiFi is connected
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("Testing TCP connection to MQTT broker at ");
    Serial.print(mqtt_server);
    Serial.print(":");
    Serial.print(mqtt_port);
    Serial.println("...");
    
    if (espClient.connect(mqtt_server, mqtt_port)) {
      Serial.println("TCP connection successful!");
      espClient.stop();
    } else {
      Serial.println("TCP connection failed! Check if broker is reachable.");
    }
  }
  
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);  // Set the callback function
}

void loop() {
  // If WiFi is disconnected, try to reconnect
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost, attempting to reconnect...");
    setup_wifi();
    delay(1000);
  }
  
  // Only try MQTT if WiFi is connected
  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      reconnect();
    }
    
    // Only proceed if MQTT is connected
    if (client.connected()) {
      client.loop();  // This is crucial for processing incoming messages

      unsigned long currentMillis = millis();
      
      if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        
        // Read sensor data
        float temperature = dht.readTemperature();
        float humidity = dht.readHumidity();
        int gasValue = analogRead(MQ2_PIN);
        int flameDetected = digitalRead(FLAME_PIN);

        // Check for sensor reading errors
        if (isnan(temperature) || isnan(humidity)) {
          Serial.println("Failed to read from DHT sensor!");
        } else {
          Serial.println("===== Sensor Readings =====");
          Serial.print("Temperature: ");
          Serial.print(temperature);
          Serial.println(" °C");
          Serial.print("Humidity: ");
          Serial.print(humidity);
          Serial.println(" %");
          Serial.print("Gas Sensor: ");
          Serial.println(gasValue);
          Serial.print("Flame Detected: ");
          Serial.println(flameDetected == LOW ? "YES" : "NO");
          Serial.print("Lamp State: ");
          Serial.println(lampState ? "ON" : "OFF");
          Serial.print("Fire Alarm Active: ");
          Serial.println(fireAlarmActive ? "YES" : "NO");

          // Check for flame detection and set persistent alarm
          if (flameDetected == LOW) {  // Fire detected
            fireAlarmActive = true;    // Set the persistent state
            isScreaming = true;        // Immediately start screaming
            Serial.println("ALERT! FIRE DETECTED! Alarm activated");
          }
          
          // FIXED: Only check for turning off screaming if fire alarm isn't active
          // This ensures fireAlarmActive persists even after flame is no longer detected
          if (!fireAlarmActive) {
            isScreaming = false;
            digitalWrite(BUZZER_PIN, LOW);
          }

          // Create JSON document
          StaticJsonDocument<200> doc;
          doc["temperature"] = temperature;
          doc["humidity"] = humidity;
          doc["gas"] = gasValue;
          doc["flame"] = flameDetected == LOW ? 1 : 0;
          doc["lamp"] = lampState ? 1 : 0;
          doc["fireAlarm"] = fireAlarmActive ? 1 : 0;
          doc["timestamp"] = millis();  // Add timestamp for data tracking

          // Serialize JSON to string
          char jsonBuffer[200];
          serializeJson(doc, jsonBuffer);

          // Publish to MQTT
          client.publish(mqtt_publish_topic, jsonBuffer);
          Serial.print("Published: ");
          Serial.println(jsonBuffer);
        }
      }
      
      // Call the scream function in each loop iteration to make buzzer scream when fire is detected
      screamBuzzer();
    }
  }
}