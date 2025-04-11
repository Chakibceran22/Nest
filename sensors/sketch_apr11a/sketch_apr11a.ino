#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "DESKTOP-BPDFGL7 8994";  // Replace with your WiFi or hotspot name
const char* password = "11111111";  // Replace with your WiFi password

// MQTT broker settings
const char* mqtt_server = "192.168.137.1";
const int mqtt_port = 1883;  // Default MQTT port
const char* mqtt_publish_topic = "sensors/data";  // Topic for sending data
const char* mqtt_subscribe_topic = "sensors/control";  // Topic for receiving data

// Update interval
long interval = 5000;  // Send mock data every 5 seconds (not const to allow dynamic updates)
unsigned long previousMillis = 0;

// Variables to store mock sensor data
float mockTemperature = 22.5;
float mockHumidity = 45.0;

WiFiClient espClient;
PubSubClient client(espClient);

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
  if (doc.containsKey("led")) {
    int ledState = doc["led"];
    Serial.print("Setting LED state to: ");
    Serial.println(ledState);
    // Add code here to control an actual LED
    // For example: digitalWrite(LED_PIN, ledState);
  }
  
  if (doc.containsKey("interval")) {
    long newInterval = doc["interval"];
    if (newInterval > 1000) {  // Minimum 1 second for safety
      interval = newInterval;
      Serial.print("Setting new publish interval: ");
      Serial.println(interval);
    }
  }
  
  // You can add more commands to process here
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
      
      char jsonBuffer[100];
      serializeJson(doc, jsonBuffer);
      client.publish("sensors/status", jsonBuffer);
      
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
  
  // Full WiFi reset
  Serial.println("Resetting WiFi...");
  WiFi.mode(WIFI_OFF);
  delay(1000);
  WiFi.mode(WIFI_STA);
  delay(1000);
  
  // Initialize any pins you want to control
  // For example: pinMode(LED_PIN, OUTPUT);
  
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
        
        // Generate slightly random mock data
        mockTemperature = 22.0 + (random(0, 100) / 10.0);  // Temperature between 22.0 and 32.0 °C
        mockHumidity = 40.0 + (random(0, 200) / 10.0);     // Humidity between 40.0 and 60.0 %

        Serial.print("Mock Temperature: ");
        Serial.print(mockTemperature);
        Serial.print(" °C, Mock Humidity: ");
        Serial.print(mockHumidity);
        Serial.println(" %");

        // Create JSON document
        StaticJsonDocument<200> doc;
        doc["temperature"] = mockTemperature;
        doc["humidity"] = mockHumidity;
        doc["timestamp"] = millis();  // Add timestamp for data tracking

        // Serialize JSON to string
        char jsonBuffer[100];
        serializeJson(doc, jsonBuffer);

        // Publish to MQTT
        client.publish(mqtt_publish_topic, jsonBuffer);
        Serial.print("Published: ");
        Serial.println(jsonBuffer);
      }
    }
  }
}