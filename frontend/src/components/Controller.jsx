import { useState, useRef, useEffect } from "react"
import { Camera, Wind, Thermometer, Power, Video, Square } from "react-feather"

export function Controllers() {
  const [grouper, setGrouper] = useState(false)
  const [surveillance, setSurveillance] = useState(true)
  const [temperature, setTemperature] = useState(22)
  const [fanSpeed, setFanSpeed] = useState(50)
  const [streamActive, setStreamActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)

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
          facingMode: "user"
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
          }).catch(err => {
            console.error("Error playing video:", err);
          });
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
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
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording. Your browser may not support this feature.");
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
  }, [surveillance]);

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

  return (
    <div className="controllers-container">
      <h2 className="page-title">Controllers</h2>

      <div className="controllers-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Power className="card-icon" /> Grouper Control
            </h3>
          </div>
          <div className="card-content controller-toggle">
            <span className="toggle-label">{grouper ? "Activated" : "Deactivated"}</span>
            <label className="switch">
              <input type="checkbox" checked={grouper} onChange={() => setGrouper(!grouper)} />
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
              <input type="checkbox" checked={surveillance} onChange={() => setSurveillance(!surveillance)} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

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
                onChange={(e) => setTemperature(Number.parseInt(e.target.value))}
                className="range-slider"
              />
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
                onChange={(e) => setFanSpeed(Number.parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card camera-card">
        <div className="card-header">
          <h3 className="card-title">Camera Feed</h3>
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
                    Save Recording
                  </button>
                )
              )}
            </div>
          )}
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
              </div>
              <div className="camera-actions">
                {isRecording ? (
                  <button 
                    className="btn btn-danger" 
                    onClick={stopRecording}
                  >
                    <Square className="btn-icon" /> Stop Recording
                  </button>
                ) : (
                  <button 
                    className="btn btn-secondary" 
                    onClick={startRecording}
                    disabled={!streamActive}
                  >
                    <Video className="btn-icon" /> Record Video
                  </button>
                )}
                <button 
                  className="btn btn-primary" 
                  onClick={viewFullScreen}
                  disabled={!streamActive}
                >
                  <Camera className="btn-icon" /> View Full Screen
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="camera-placeholder">
                <Camera className="camera-icon" />
                <p>Camera is turned off</p>
              </div>
              <div className="camera-actions ">
                <button className="btn btn-secondary " disabled>
                  <Video className="btn-icon" /> Record Video
                </button>
                <button className="btn btn-primary " disabled>
                  <Camera className="btn-icon" /> View Full Screen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}