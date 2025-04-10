// index.js
import mqtt from 'mqtt';
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import { MQTT_HOST, MQTT_PORT, MQTT_TOPIC } from './config.js';

// Load the service account JSON file
const serviceAccount = JSON.parse(
  await readFile(new URL('./admin-key.json', import.meta.url))
);

// Initialize Firebase Admin SDK with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
   // Replace with your actual Firebase project URL
});

// Connect to the MQTT broker
const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`, {
  clientId: `firebase-bridge-${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

client.on('connect', () => {
  console.log(`Connected to MQTT broker at ${MQTT_HOST}:${MQTT_PORT}`);
  
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    } else {
      console.log(`Successfully subscribed to topic: ${MQTT_TOPIC}`);
    }
  });
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});

client.on('message', async (topic, message) => {
  try {
    console.log(`Message received on topic ${topic}:`, message.toString());
    const sensorData = JSON.parse(message.toString());
    console.log('Received sensor data:', sensorData);

    // Push the data to Firestore
    const db = admin.firestore();
    const sensorRef = db.collection('sensorData').doc();

    await sensorRef.set({
      temperature: sensorData.temperature,
      humidity: sensorData.humidity,
      topic: topic,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Sensor data saved to Firestore with ID:', sensorRef.id);
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Disconnecting from MQTT broker...');
  client.end();
  process.exit();
});