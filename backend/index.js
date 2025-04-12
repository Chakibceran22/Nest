// unified-mqtt-bridge.js
import mqtt from 'mqtt';
import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MQTT Configuration
const MQTT_HOST = '192.168.137.1';
const MQTT_PORT = 1883;
const MQTT_TOPICS = {
  readings: 'sensors/esp32/readings',
  status: 'sensors/esp32/status',
  control: 'sensors/esp32/control',
  state: 'sensors/esp32/state'
};

// Global state variables
let deviceState = {
  temperature: 0,
  humidity: 0,
  gas: 0,
  flame: 0,
  lamp: false,
  lastUpdate: null,
  connected: false
};

// Load the service account JSON file
const loadFirebaseCredentials = async () => {
  try {
    const serviceAccount = JSON.parse(
      await readFile(new URL('./admin-key.json', import.meta.url))
    );
    
    // Initialize Firebase Admin SDK with your service account credentials
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Replace with your actual Firebase project URL
    });
    
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

// Initialize Firebase
const firebaseInitialized = await loadFirebaseCredentials();

// Connect to the MQTT broker
const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`, {
  clientId: `smart-home-bridge-${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

client.on('connect', () => {
  console.log(`Connected to MQTT broker at ${MQTT_HOST}:${MQTT_PORT}`);
  
  // Subscribe to all relevant topics
  const topics = Object.values(MQTT_TOPICS);
  
  topics.forEach(topic => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Error subscribing to topic ${topic}:`, err);
      } else {
        console.log(`Successfully subscribed to topic: ${topic}`);
      }
    });
  });
  
  // Also subscribe to wildcard to catch all messages
  client.subscribe('sensors/esp32/#', (err) => {
    if (!err) {
      console.log('Subscribed to all ESP32 topics using wildcard');
    }
  });
  
  // Update connected state
  deviceState.connected = true;
});

client.on('reconnect', () => {
  console.log('Attempting to reconnect to MQTT broker...');
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
  deviceState.connected = false;
});

client.on('offline', () => {
  console.log('MQTT client is offline');
  deviceState.connected = false;
});

client.on('message', async (topic, message) => {
  try {
    console.log(`Message received on topic ${topic}`);
    const data = JSON.parse(message.toString());
    
    // Update device state based on message type
    if (topic === MQTT_TOPICS.readings) {
      // Update local state with sensor readings
      deviceState = {
        ...deviceState,
        temperature: data.temperature || deviceState.temperature,
        humidity: data.humidity || deviceState.humidity,
        gas: data.gas || deviceState.gas,
        flame: data.flame || deviceState.flame,
        lamp: data.lamp === 1 || deviceState.lamp,
        lastUpdate: new Date()
      };
      
      console.log('Updated device state:', deviceState);
      
      // Save to Firebase if initialized
      if (firebaseInitialized) {
        await saveToFirebase(data, topic);
      }
    } 
    else if (topic === MQTT_TOPICS.status) {
      console.log('Device status update:', data);
      deviceState.connected = true;
      
      // Save status to Firebase if initialized
      if (firebaseInitialized) {
        await saveStatusToFirebase(data);
      }
    }
    else if (topic === MQTT_TOPICS.state) {
      if (data.hasOwnProperty('lamp')) {
        deviceState.lamp = data.lamp === 1;
        console.log(`Lamp state updated: ${deviceState.lamp ? 'ON' : 'OFF'}`);
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Function to save sensor data to Firebase
async function saveToFirebase(sensorData, topic) {
  try {
    const db = admin.firestore();
    const sensorRef = db.collection('sensorData').doc();
    
    // Create a timestamp for the record
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    // Save all sensor data fields
    await sensorRef.set({
      temperature: sensorData.temperature,
      humidity: sensorData.humidity,
      gas: sensorData.gas,
      flame: sensorData.flame,
      lamp: sensorData.lamp,
      topic: topic,
      timestamp: timestamp,
      receivedAt: new Date().toISOString() // Local timestamp for reference
    });

    console.log('Sensor data saved to Firestore with ID:', sensorRef.id);
    
    // If gas or flame values indicate an alert condition, save to alerts collection
    if (sensorData.gas > 1600 || sensorData.flame === 1) {
      const alertRef = db.collection('alerts').doc();
      await alertRef.set({
        type: sensorData.gas > 1600 ? 'High Gas Level' : 'Flame Detected',
        gasValue: sensorData.gas,
        flameDetected: sensorData.flame === 1,
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        timestamp: timestamp,
        status: 'new'  // Can be used for alert management (new, acknowledged, resolved)
      });
      console.log('Alert saved to Firestore with ID:', alertRef.id);
    }
  } catch (error) {
    console.error('Error saving to Firebase:', error);
  }
}

// Function to save device status to Firebase
async function saveStatusToFirebase(statusData) {
  try {
    const db = admin.firestore();
    const statusRef = db.collection('deviceStatus').doc();
    await statusRef.set({
      ...statusData,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Device status saved to Firestore with ID:', statusRef.id);
  } catch (error) {
    console.error('Error saving status to Firebase:', error);
  }
}

// Function to send a command to the device
function sendCommand(command) {
  try {
    client.publish(MQTT_TOPICS.control, JSON.stringify(command));
    console.log('Command sent:', command);
    return true;
  } catch (error) {
    console.error('Error sending command:', error);
    return false;
  }
}

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ----- API ENDPOINTS -----

// Get device state
app.get('/api/state', (req, res) => {
  res.status(200).json({
    ...deviceState,
    connected: client.connected && deviceState.connected
  });
});

// Control lamp
app.post('/api/lamp', (req, res) => {
  const { state } = req.body;
  
  if (state === undefined) {
    return res.status(400).json({ error: 'Missing state parameter' });
  }
  
  const success = sendCommand({ lamp: state ? 1 : 0 });
  
  if (success) {
    // Optimistically update local state
    deviceState.lamp = state;
    res.status(200).json({ success: true, lamp: state });
  } else {
    res.status(500).json({ success: false, error: 'Failed to send command' });
  }
});

// Toggle lamp
app.post('/api/lamp/toggle', (req, res) => {
  const newState = !deviceState.lamp;
  const success = sendCommand({ lamp: newState ? 1 : 0 });
  
  if (success) {
    // Optimistically update local state
    deviceState.lamp = newState;
    res.status(200).json({ success: true, lamp: newState });
  } else {
    res.status(500).json({ success: false, error: 'Failed to send command' });
  }
});


// Control buzzer
app.post('/api/buzzer', (req, res) => {
  const { state } = req.body;
  
  if (state === undefined) {
    return res.status(400).json({ error: 'Missing state parameter' });
  }
  
  const success = sendCommand({ buzzer: state ? 1 : 0 });
  res.status(success ? 200 : 500).json({ success });
});
app.post('/api/buzzer/toggle', (req, res) => {
  const newState = !deviceState.buzzer;
  const success = sendCommand({ buzzer: newState ? 1 : 0 });
  
  if (success) {
    // Optimistically update local state
    deviceState.buzzer = newState;
    res.status(200).json({ success: true, buzzer: newState });
  } else {
    res.status(500).json({ success: false, error: 'Failed to send command' });
  }
})
// Control relay
app.post('/api/relay', (req, res) => {
  const { state } = req.body;
  
  if (state === undefined) {
    return res.status(400).json({ error: 'Missing state parameter' });
  }
  
  const success = sendCommand({ relay: state ? 1 : 0 });
  res.status(success ? 200 : 500).json({ success });
});

// Set publish interval
app.post('/api/interval', (req, res) => {
  const { milliseconds } = req.body;
  
  if (!milliseconds || milliseconds < 1000) {
    return res.status(400).json({ error: 'Invalid interval (must be >= 1000ms)' });
  }
  
  const success = sendCommand({ interval: milliseconds });
  res.status(success ? 200 : 500).json({ success });
});

// Get recent data from Firebase
app.get('/api/data/recent', async (req, res) => {
  if (!firebaseInitialized) {
    return res.status(503).json({ error: 'Firebase not initialized' });
  }
  
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('sensorData')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
    
    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching recent data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Send custom command
app.post('/api/command', (req, res) => {
  const command = req.body;
  
  if (!command || Object.keys(command).length === 0) {
    return res.status(400).json({ error: 'Empty command' });
  }
  
  const success = sendCommand(command);
  res.status(success ? 200 : 500).json({ success });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    mqtt: client.connected ? 'connected' : 'disconnected',
    firebase: firebaseInitialized ? 'initialized' : 'not initialized'
  });
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Disconnecting from MQTT broker...');
  client.end();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// ----- CONSOLE INTERFACE -----

// Add simple console commands for manual testing
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('ESP32 Control Console');
console.log('Commands:');
console.log('  lamp:on     - Turn lamp ON');
console.log('  lamp:off    - Turn lamp OFF');
console.log('  buzzer:on   - Turn buzzer ON');
console.log('  buzzer:off  - Turn buzzer OFF');
console.log('  relay:on    - Turn relay ON');
console.log('  relay:off   - Turn relay OFF');
console.log('  interval:X  - Set interval to X ms (e.g., interval:5000)');
console.log('  state       - Show current device state');
console.log('  quit        - Exit the application');

function promptUser() {
  rl.question('> ', (input) => {
    const command = input.toLowerCase().trim();
    
    if (command === 'lamp:on') {
      sendCommand({ lamp: 1 });
    } 
    else if (command === 'lamp:off') {
      sendCommand({ lamp: 0 });
    }
    else if (command === 'buzzer:on') {
      sendCommand({ buzzer: 1 });
    }
    else if (command === 'buzzer:off') {
      sendCommand({ buzzer: 0 });
    }
    else if (command === 'relay:on') {
      sendCommand({ relay: 1 });
    }
    else if (command === 'relay:off') {
      sendCommand({ relay: 0 });
    }
    else if (command.startsWith('interval:')) {
      const ms = parseInt(command.split(':')[1]);
      if (ms && ms >= 1000) {
        sendCommand({ interval: ms });
      } else {
        console.log('Invalid interval. Must be at least 1000ms.');
      }
    }
    else if (command === 'state') {
      console.log('Current device state:', deviceState);
    }
    else if (command === 'quit' || command === 'exit') {
      console.log('Exiting application...');
      rl.close();
      client.end();
      process.exit(0);
    }
    else {
      console.log('Unknown command.');
    }
    
    promptUser();
  });
}

// Start the command prompt after a brief delay
setTimeout(promptUser, 1000);