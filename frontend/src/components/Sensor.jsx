import { useState } from "react"
import { Camera, Plus, X, Check } from "react-feather"

export function Sensors() {
  const [sensors, setSensors] = useState([
    { id: 1, name: "Temperature Sensor 1", type: "Temperature", location: "Server Room A", status: "Online" },
    { id: 2, name: "Humidity Sensor 1", type: "Humidity", location: "Server Room A", status: "Online" },
    { id: 3, name: "Motion Sensor 1", type: "Motion", location: "Entrance", status: "Online" },
    { id: 4, name: "Temperature Sensor 2", type: "Temperature", location: "Office Area", status: "Offline" },
    { id: 5, name: "Smoke Detector 1", type: "Smoke", location: "Kitchen", status: "Online" },
    { id: 6, name: "Camera 1", type: "Camera", location: "Parking", status: "Online" },
  ])

  const [showAddSensor, setShowAddSensor] = useState(false)
  const [newSensor, setNewSensor] = useState({
    name: "",
    type: "Temperature",
    location: "",
    status: "Online",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewSensor({
      ...newSensor,
      [name]: value,
    })
  }

  const handleAddSensor = () => {
    if (newSensor.name && newSensor.location) {
      const sensor = {
        id: sensors.length + 1,
        ...newSensor,
      }
      setSensors([...sensors, sensor])
      setNewSensor({
        name: "",
        type: "Temperature",
        location: "",
        status: "Online",
      })
      setShowAddSensor(false)
    }
  }

  return (
    <div className="sensors-container">
      <div className="page-header">
        <h2 className="page-title">Sensors</h2>
        <div className="action-buttons">
          <button className="btn btn-primary">
            <Camera className="btn-icon" />
            Camera Access
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddSensor(true)}>
            <Plus className="btn-icon" />
            Add Sensor
          </button>
        </div>
      </div>

      {showAddSensor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Sensor</h3>
              <button className="modal-close" onClick={() => setShowAddSensor(false)}>
                <X />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Sensor Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter sensor name"
                  value={newSensor.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Sensor Type</label>
                <select
                  id="type"
                  name="type"
                  className="form-select"
                  value={newSensor.type}
                  onChange={handleInputChange}
                >
                  <option value="Temperature">Temperature</option>
                  <option value="Humidity">Humidity</option>
                  <option value="Motion">Motion</option>
                  <option value="Smoke">Smoke</option>
                  <option value="Gas">Gas</option>
                  <option value="Camera">Camera</option>
                  <option value="Pressure">Pressure</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  placeholder="Enter sensor location"
                  value={newSensor.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Initial Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={newSensor.status}
                  onChange={handleInputChange}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddSensor(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddSensor}>
                <Check className="btn-icon" />
                Add Sensor
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sensors-grid">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="card sensor-card">
            <div className="card-header">
              <h3 className="card-title">{sensor.name}</h3>
              <span className={`status-badge ${sensor.status.toLowerCase()}`}>{sensor.status}</span>
            </div>
            <div className="card-content">
              <div className="sensor-details">
                <div className="sensor-detail">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{sensor.type}</span>
                </div>
                <div className="sensor-detail">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{sensor.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
