import mqtt from 'mqtt';
import { MQTT_TOPIC, MQTT_PORT, MQTT_HOST } from './consfig.js';

const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`);
client.on('connect', () => {
  client.subscribe('sensor/data', (err) => {
    if (err) {
      console.log('Error subscribing to topic', err);
    }
  });
});
client.on('message', (topic, message) => {
  const sensorData = JSON.parse(message.toString());
  console.log('Received sensor data:', sensorData);
  // Push data to Firebase
});