import { useState } from "react"
import { Camera, Wind, Thermometer, Power } from "react-feather"

export function Controllers() {
  const [grouper, setGrouper] = useState(false)
  const [surveillance, setSurveillance] = useState(true)
  const [temperature, setTemperature] = useState(22)
  const [fanSpeed, setFanSpeed] = useState(50)

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
        </div>
        <div className="card-content camera-content">
          <div className="camera-placeholder">
            <Camera className="camera-icon" />
          </div>
          <div className="camera-actions">
            <button className="btn btn-secondary">Detect Motion</button>
            <button className="btn btn-primary">View Full Screen</button>
          </div>
        </div>
      </div>
    </div>
  )
}
