import { useState, useRef, useEffect } from "react"
import { 
  Camera, Wind, Thermometer, Power, Video, Square, Lock, AlignLeft, Sun, Moon,
  Droplet, Bell, AlertTriangle, Layers, BarChart2, Sliders, Save, RotateCw, Eye, 
  Check, X , Plus
} from "lucide-react"

export  function Controllers() {
  // Basic system controls
  const [grouper, setGrouper] = useState(false)
  const [surveillance, setSurveillance] = useState(true)
  const [securitySystem, setSecuritySystem] = useState(true)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [lightsOn, setLightsOn] = useState(true)
  const [nightMode, setNightMode] = useState(false)
  
  // Environment controls
  const [temperature, setTemperature] = useState(22)
  const [fanSpeed, setFanSpeed] = useState(50)
  const [humidity, setHumidity] = useState(45)
  
  // Camera controls
  const [streamActive, setStreamActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [cameraSelector, setCameraSelector] = useState('user')
  const [notifications, setNotifications] = useState(true)
  const [motionDetection, setMotionDetection] = useState(true)
  
  // Automation schedules
  const [schedules, setSchedules] = useState([
    { id: 1, name: "Morning Temperature", action: "Set temperature to 23°C", time: "08:00", days: "Mon-Fri", active: true },
    { id: 2, name: "Evening Lights", action: "Turn on all lights", time: "18:00", days: "Daily", active: true },
    { id: 3, name: "Night Security", action: "Activate security system", time: "22:00", days: "Daily", active: true },
  ])
  
  // Status and logs
  const [systemStatus, setSystemStatus] = useState("Normal")
  const [logs, setLogs] = useState([
    { time: "10:23:45", message: "Temperature changed to 22°C", type: "info" },
    { time: "09:15:21", message: "Security system activated", type: "success" },
    { time: "08:30:10", message: "Grouper control deactivated", type: "warning" },
  ])
  
  // Camera refs
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  
  // Show alert when emergency mode is activated
  useEffect(() => {
    if (emergencyMode) {
      // Add a new log entry
      const newLog = {
        time: new Date().toLocaleTimeString(),
        message: "EMERGENCY MODE ACTIVATED",
        type: "emergency"
      }
      setLogs([newLog, ...logs])
      
      // Set system status
      setSystemStatus("Emergency")
    } else {
      setSystemStatus("Normal")
    }
  }, [emergencyMode])

  // Function to start the webcam with error handling
  const startWebcam = async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Request camera access with constraints for better compatibility
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: cameraSelector
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setStreamActive(true);
            
            // Add log entry
            const newLog = {
              time: new Date().toLocaleTimeString(),
              message: "Camera stream activated",
              type: "info"
            }
            setLogs([newLog, ...logs])
          }).catch(err => {
            console.error("Error playing video:", err);
          });
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      
      // Add log entry
      const newLog = {
        time: new Date().toLocaleTimeString(),
        message: "Failed to access camera: " + err.message,
        type: "error"
      }
      setLogs([newLog, ...logs])
      
      alert("Could not access webcam. Please check permissions.");
      setSurveillance(false);
    }
  }

  // Function to stop the webcam
  const stopWebcam = () => {
    if (isRecording) {
      stopRecording();
    }
    
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setStreamActive(false);
    
    // Add log entry
    const newLog = {
      time: new Date().toLocaleTimeString(),
      message: "Camera stream deactivated",
      type: "info"
    }
    setLogs([newLog, ...logs])
  }

  // Start recording function
  const startRecording = () => {
    if (!streamRef.current) return;
    
    setRecordedChunks([]);
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Add log entry
      const newLog = {
        time: new Date().toLocaleTimeString(),
        message: "Video recording started",
        type: "info"
      }
      setLogs([newLog, ...logs])
    } catch (err) {
      console.error("Error starting recording:", err);
      
      // Add log entry
      const newLog = {
        time: new Date().toLocaleTimeString(),
        message: "Failed to start recording: " + err.message,
        type: "error"
      }
      setLogs([newLog, ...logs])
      
      alert("Could not start recording. Your browser may not support this feature.");
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Add log entry
      const newLog = {
        time: new Date().toLocaleTimeString(),
        message: "Video recording stopped",
        type: "info"
      }
      setLogs([newLog, ...logs])
    }
  };

  // Save recorded video
  const saveRecording = () => {
    if (recordedChunks.length === 0) {
      alert("No recording available to save");
      return;
    }
    
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = `surveillance-recording-${new Date().toISOString()}.webm`;
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Add log entry
    const newLog = {
      time: new Date().toLocaleTimeString(),
      message: "Video recording saved",
      type: "success"
    }
    setLogs([newLog, ...logs])
  };

  // Toggle webcam based on surveillance state
  useEffect(() => {
    if (surveillance) {
      startWebcam();
    } else {
      stopWebcam();
    }
    
    // Cleanup on component unmount
    return () => {
      stopWebcam();
    }
  }, [surveillance, cameraSelector]);

  // Function to view in fullscreen
  const viewFullScreen = () => {
    if (videoRef.current) {
      try {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.msRequestFullscreen) {
          videoRef.current.msRequestFullscreen();
        }
      } catch (error) {
        console.error("Fullscreen failed:", error);
      }
    }
  }
  
  // Update controller and add log entry
  const handleControlChange = (controlName, value, controlType = "toggle") => {
    // Update the control state based on the controlName
    switch(controlName) {
      case "grouper":
        setGrouper(value);
        break;
      case "surveillance":
        setSurveillance(value);
        break;
      case "security":
        setSecuritySystem(value);
        break;
      case "emergency":
        setEmergencyMode(value);
        break;
      case "lights":
        setLightsOn(value);
        break;
      case "nightMode":
        setNightMode(value);
        break;
      case "temperature":
        setTemperature(value);
        break;
      case "fanSpeed":
        setFanSpeed(value);
        break;
      case "humidity":
        setHumidity(value);
        break;
      case "notifications":
        setNotifications(value);
        break;
      case "motionDetection":
        setMotionDetection(value);
        break;
      default:
        break;
    }
    
    // Create log message based on control type
    let logMessage = "";
    if (controlType === "toggle") {
      logMessage = `${controlName} ${value ? "activated" : "deactivated"}`;
    } else if (controlType === "slider") {
      logMessage = `${controlName} set to ${value}${controlName === "temperature" ? "°C" : "%"}`;
    }
    
    // Capitalize first letter of control name for log
    const formattedControlName = controlName.charAt(0).toUpperCase() + controlName.slice(1);
    
    // Add log entry
    const newLog = {
      time: new Date().toLocaleTimeString(),
      message: formattedControlName + " " + logMessage,
      type: "info"
    }
    setLogs([newLog, ...logs.slice(0, 49)]) // Keep only the latest 50 logs
  }
  
  // Toggle schedule status
  const toggleSchedule = (id) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? {...schedule, active: !schedule.active} : schedule
    ))
    
    // Find the schedule
    const schedule = schedules.find(s => s.id === id);
    
    // Add log entry
    if (schedule) {
      const newLog = {
        time: new Date().toLocaleTimeString(),
        message: `Schedule "${schedule.name}" ${!schedule.active ? "activated" : "deactivated"}`,
        type: "info"
      }
      setLogs([newLog, ...logs])
    }
  }
  
  // Function to clear all logs
  const clearLogs = () => {
    setLogs([{
      time: new Date().toLocaleTimeString(),
      message: "System logs cleared",
      type: "info"
    }])
  }

  return (
    <div className={`controllers-container ${emergencyMode ? 'emergency-mode' : ''} ${nightMode ? 'night-mode' : ''}`}>
      <div className="controllers-header">
        <h2 className="page-title">System Controllers</h2>
        <div className="system-status">
          <span className={`status-indicator ${systemStatus.toLowerCase()}`}></span>
          System Status: <strong>{systemStatus}</strong>
          {emergencyMode && (
            <button className="btn btn-sm btn-danger" onClick={() => handleControlChange("emergency", false)}>
              Deactivate Emergency Mode
            </button>
          )}
        </div>
      </div>

      <div className="controllers-grid">
        {/* Basic Controls Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Power className="card-icon" /> Grouper Control
            </h3>
          </div>
          <div className="card-content controller-toggle">
            <span className="toggle-label">{grouper ? "Activated" : "Deactivated"}</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={grouper} 
                onChange={() => handleControlChange("grouper", !grouper)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Camera className="card-icon" /> Surveillance Camera
            </h3>
          </div>
          <div className="card-content controller-toggle">
            <span className="toggle-label">{surveillance ? "Active" : "Inactive"}</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={surveillance} 
                onChange={() => handleControlChange("surveillance", !surveillance)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Lock className="card-icon" /> Security System
            </h3>
          </div>
          <div className="card-content controller-toggle">
            <span className="toggle-label">{securitySystem ? "Armed" : "Disarmed"}</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={securitySystem} 
                onChange={() => handleControlChange("security", !securitySystem)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <AlertTriangle className="card-icon" /> Emergency Mode
            </h3>
          </div>
          <div className="card-content controller-toggle">
            <span className="toggle-label emergency-label">{emergencyMode ? "ACTIVATED" : "Deactivated"}</span>
            <label className="switch emergency-switch">
              <input 
                type="checkbox" 
                checked={emergencyMode} 
                onChange={() => handleControlChange("emergency", !emergencyMode)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sun className="card-icon" /> Lighting Control
            </h3>
          </div>
          <div className="card-content controller-toggle">
            <span className="toggle-label">{lightsOn ? "Lights On" : "Lights Off"}</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={lightsOn} 
                onChange={() => handleControlChange("lights", !lightsOn)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Moon className="card-icon" /> Night Mode
            </h3>
          </div>
          <div className="card-content controller-toggle">
            <span className="toggle-label">{nightMode ? "Enabled" : "Disabled"}</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={nightMode} 
                onChange={() => handleControlChange("nightMode", !nightMode)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {/* Environment Controls Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Thermometer className="card-icon" /> Temperature Control
            </h3>
          </div>
          <div className="card-content">
            <div className="slider-header">
              <span className="slider-value">Current: {temperature}°C</span>
              <span className="slider-range">Range: 18-28°C</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="18"
                max="28"
                value={temperature}
                onChange={(e) => handleControlChange("temperature", Number.parseInt(e.target.value), "slider")}
                className="range-slider"
              />
            </div>
            <div className="temperature-presets">
              <button 
                className="preset-btn cool"
                onClick={() => handleControlChange("temperature", 20, "slider")}
              >
                Cool (20°C)
              </button>
              <button 
                className="preset-btn comfort"
                onClick={() => handleControlChange("temperature", 23, "slider")}
              >
                Comfort (23°C)
              </button>
              <button 
                className="preset-btn warm"
                onClick={() => handleControlChange("temperature", 26, "slider")}
              >
                Warm (26°C)
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Wind className="card-icon" /> Fan Control
            </h3>
          </div>
          <div className="card-content">
            <div className="slider-header">
              <span className="slider-value">Speed: {fanSpeed}%</span>
              <span className="slider-range">Range: 0-100%</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={fanSpeed}
                onChange={(e) => handleControlChange("fanSpeed", Number.parseInt(e.target.value), "slider")}
                className="range-slider"
              />
            </div>
            <div className="fan-presets">
              <button 
                className="preset-btn"
                onClick={() => handleControlChange("fanSpeed", 0, "slider")}
              >
                Off
              </button>
              <button 
                className="preset-btn"
                onClick={() => handleControlChange("fanSpeed", 25, "slider")}
              >
                Low
              </button>
              <button 
                className="preset-btn"
                onClick={() => handleControlChange("fanSpeed", 50, "slider")}
              >
                Medium
              </button>
              <button 
                className="preset-btn"
                onClick={() => handleControlChange("fanSpeed", 100, "slider")}
              >
                High
              </button>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Droplet className="card-icon" /> Humidity Control
            </h3>
          </div>
          <div className="card-content">
            <div className="slider-header">
              <span className="slider-value">Level: {humidity}%</span>
              <span className="slider-range">Range: 30-70%</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="30"
                max="70"
                value={humidity}
                onChange={(e) => handleControlChange("humidity", Number.parseInt(e.target.value), "slider")}
                className="range-slider"
              />
            </div>
            <div className="humidity-presets">
              <button 
                className="preset-btn"
                onClick={() => handleControlChange("humidity", 35, "slider")}
              >
                Dry (35%)
              </button>
              <button 
                className="preset-btn"
                onClick={() => handleControlChange("humidity", 45, "slider")}
              >
                Normal (45%)
              </button>
              <button 
                className="preset-btn"
                onClick={() => handleControlChange("humidity", 60, "slider")}
              >
                Humid (60%)
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Camera Feed Section */}
      <div className="card camera-card">
        <div className="card-header">
          <h3 className="card-title">Camera Feed</h3>
          <div className="camera-controls">
            <select 
              className="camera-selector"
              value={cameraSelector}
              onChange={(e) => setCameraSelector(e.target.value)}
              disabled={!surveillance || isRecording}
            >
              <option value="user">Front Camera</option>
              <option value="environment">Rear Camera</option>
            </select>
            
            {surveillance && streamActive && (
              <div className="recording-indicator">
                {isRecording ? (
                  <span className="recording-active">
                    <span className="recording-dot"></span>
                    Recording
                  </span>
                ) : (
                  recordedChunks.length > 0 && (
                    <button 
                      className="btn btn-sm btn-success" 
                      onClick={saveRecording}
                    >
                      <Save size={14} /> Save Recording
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
        <div className="card-content camera-content">
          {surveillance ? (
            <>
              <div className="camera-feed">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  muted
                />
                {!streamActive && (
                  <div className="camera-placeholder">
                    <Camera className="camera-icon" />
                    <p>Connecting to camera...</p>
                  </div>
                )}
                
                {/* Camera settings overlay */}
                <div className="camera-settings">
                  <div className="setting-item">
                    <span className="setting-label">Notifications:</span>
                    <label className="switch switch-small">
                      <input 
                        type="checkbox" 
                        checked={notifications} 
                        onChange={() => handleControlChange("notifications", !notifications)} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <span className="setting-label">Motion Detection:</span>
                    <label className="switch switch-small">
                      <input 
                        type="checkbox" 
                        checked={motionDetection} 
                        onChange={() => handleControlChange("motionDetection", !motionDetection)} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="camera-actions">
                {isRecording ? (
                  <button 
                    className="btn btn-danger" 
                    onClick={stopRecording}
                  >
                    <Square size={16} className="btn-icon" /> Stop Recording
                  </button>
                ) : (
                  <button 
                    className="btn btn-secondary" 
                    onClick={startRecording}
                    disabled={!streamActive}
                  >
                    <Video size={16} className="btn-icon" /> Record Video
                  </button>
                )}
                <button 
                  className="btn btn-primary" 
                  onClick={viewFullScreen}
                  disabled={!streamActive}
                >
                  <Eye size={16} className="btn-icon" /> View Full Screen
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="camera-placeholder">
                <Camera className="camera-icon" />
                <p>Camera is turned off</p>
              </div>
              <div className="camera-actions">
                <button className="btn btn-secondary" disabled>
                  <Video size={16} className="btn-icon" /> Record Video
                </button>
                <button className="btn btn-primary" disabled>
                  <Eye size={16} className="btn-icon" /> View Full Screen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      
      
      {/* System Logs */}
      <div className="card logs-card">
        <div className="card-header">
          <h3 className="card-title">
            <BarChart2 className="card-icon" /> System Logs
          </h3>
          <div className="log-actions">
            <button className="btn btn-sm btn-secondary" onClick={clearLogs}>
              <X size={14} /> Clear Logs
            </button>
            <button className="btn btn-sm btn-primary">
              <Save size={14} /> Export Logs
            </button>
          </div>
        </div>
        <div className="card-content">
          <div className="logs-container">
            {logs.map((log, index) => (
              <div key={index} className={`log-entry ${log.type}`}>
                <span className="log-time">{log.time}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}