import mqtt from 'mqtt';
import { MQTT_TOPIC, MQTT_PORT, MQTT_HOST } from './consfig.js';

const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`);

client.on('connect', () => {
  console.log('✅ Connected');
  setInterval(() => {
    const data = {
      temperature: (20 + Math.random() * 5).toFixed(2),
      time: new Date().toISOString()
    };
    client.publish(MQTT_TOPIC, JSON.stringify(data));
    console.log('📤 Published:', data);
  }, 3000);
});
