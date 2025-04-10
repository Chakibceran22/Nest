import dotenv from 'dotenv';
dotenv.config();

export const {
  MQTT_HOST,
  MQTT_PORT,
  MQTT_TOPIC
} = process.env;
