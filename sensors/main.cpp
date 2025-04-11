#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// WiFi credentials - Replace with your mobile hotspot details
const char* ssid = "YourMobileHotspotName";
const char* password = "YourMobileHotspotPassword";

// MQTT Broker settings - Matching your Node.js config
const char* mqtt_server = "192.168.137.157"; // Your Windows computer's WiFi IP address
const int mqtt_port = 1883;          // Matches your MQTT_PORT
const char* mqtt_topic = "sensor/data"; // Matches your MQTT_TOPIC

// DHT sensor setup
#define DHTPIN 4       // Digital pin connected to the DHT sensor
#define DHTTYPE DHT22  // DHT 22 (AM2302) - Change to DHT11 if using that sensor

// Initialize WiFi client, MQTT client, and DHT sensor
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

// Variables for publishing interval
unsigned long lastMsg = 0;
const long interval = 10000; // Publish every 10 seconds

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    // Attempt to connect (no username/password as per your setup)
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // Initialize the DHT sensor
  dht.begin();
  
  // Setup WiFi connection
  setup_wifi();
  
  // Configure MQTT connection
  client.setServer(mqtt_server, mqtt_port);
  
  randomSeed(micros());
}

void loop() {
  // Ensure MQTT connection is maintained
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Check if it's time to publish a new reading
  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;
    
    // Read temperature and humidity from DHT sensor
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature(); // Read temperature in Celsius
    
    // Check if reading was successful
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }
    
    // Print sensor values to serial monitor
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C, Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
    
    // Create JSON string with the data
    char msg[100];
    snprintf(msg, 100, "{\"temperature\":%.2f,\"humidity\":%.2f}", temperature, humidity);
    
    Serial.print("Publishing message: ");
    Serial.println(msg);
    
    // Publish to the MQTT topic
    client.publish(mqtt_topic, msg);
  }
  
  // Brief delay to prevent overwhelming the loop
  delay(100);
}