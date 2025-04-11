import { useState, useEffect } from "react"
import { Camera, Plus, X, Check, Thermometer, Droplet, Activity, AlertTriangle, Video, Wind, Zap, Search, Filter, RefreshCw, Trash2, Edit2, Power } from "lucide-react"

export default function Sensors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [showAddSensor, setShowAddSensor] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Sensor readings data
  const [sensorReadings, setSensorReadings] = useState({
    "Temperature Sensor 1": { value: 23.5, unit: "°C", trend: "rising", lastUpdated: "2 min ago" },
    "Humidity Sensor 1": { value: 45, unit: "%", trend: "stable", lastUpdated: "1 min ago" },
    "Motion Sensor 1": { value: "No motion", unit: "", trend: "inactive", lastUpdated: "5 min ago" },
    "Temperature Sensor 2": { value: 0, unit: "°C", trend: "unknown", lastUpdated: "1 day ago" },
    "Smoke Detector 1": { value: "Clear", unit: "", trend: "stable", lastUpdated: "3 min ago" },
    "Camera 1": { value: "Recording", unit: "", trend: "active", lastUpdated: "Just now" },
  })

  const [sensors, setSensors] = useState([
    { id: 1, name: "Temperature Sensor 1", type: "Temperature", location: "Server Room A", status: "Online", battery: 85, lastMaintenance: "2025-01-15" },
    { id: 2, name: "Humidity Sensor 1", type: "Humidity", location: "Server Room A", status: "Online", battery: 72, lastMaintenance: "2025-02-10" },
    { id: 3, name: "Motion Sensor 1", type: "Motion", location: "Entrance", status: "Online", battery: 90, lastMaintenance: "2025-01-28" },
    { id: 4, name: "Temperature Sensor 2", type: "Temperature", location: "Office Area", status: "Offline", battery: 12, lastMaintenance: "2024-11-15" },
    { id: 5, name: "Smoke Detector 1", type: "Smoke", location: "Kitchen", status: "Online", battery: 65, lastMaintenance: "2025-03-05" },
    { id: 6, name: "Camera 1", type: "Camera", location: "Parking", status: "Online", battery: 100, lastMaintenance: "2025-02-28", isPowered: true },
  ])

  const [newSensor, setNewSensor] = useState({
    name: "",
    type: "Temperature",
    location: "",
    status: "Online",
    battery: 100,
    lastMaintenance: new Date().toISOString().split('T')[0]
  })

  // Simulate sensor readings updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedReadings = {...sensorReadings}
      
      // Update temperature sensor readings
      if (updatedReadings["Temperature Sensor 1"]) {
        updatedReadings["Temperature Sensor 1"].value = +(updatedReadings["Temperature Sensor 1"].value + (Math.random() * 0.4 - 0.2)).toFixed(1)
        updatedReadings["Temperature Sensor 1"].lastUpdated = "Just now"
        updatedReadings["Temperature Sensor 1"].trend = Math.random() > 0.5 ? "rising" : "falling"
      }
      
      // Update humidity sensor readings
      if (updatedReadings["Humidity Sensor 1"]) {
        updatedReadings["Humidity Sensor 1"].value = Math.floor(updatedReadings["Humidity Sensor 1"].value + (Math.random() * 2 - 1))
        updatedReadings["Humidity Sensor 1"].lastUpdated = "Just now"
        updatedReadings["Humidity Sensor 1"].trend = Math.random() > 0.5 ? "rising" : "falling"
      }
      
      // Randomly update motion sensor
      if (updatedReadings["Motion Sensor 1"] && Math.random() > 0.8) {
        updatedReadings["Motion Sensor 1"].value = updatedReadings["Motion Sensor 1"].value === "No motion" ? "Motion detected" : "No motion"
        updatedReadings["Motion Sensor 1"].lastUpdated = "Just now"
        updatedReadings["Motion Sensor 1"].trend = updatedReadings["Motion Sensor 1"].value === "Motion detected" ? "active" : "inactive"
      }
      
      // Update smoke detector randomly
      if (updatedReadings["Smoke Detector 1"] && Math.random() > 0.95) {
        updatedReadings["Smoke Detector 1"].value = updatedReadings["Smoke Detector 1"].value === "Clear" ? "Smoke detected" : "Clear"
        updatedReadings["Smoke Detector 1"].lastUpdated = "Just now"
        updatedReadings["Smoke Detector 1"].trend = updatedReadings["Smoke Detector 1"].value === "Smoke detected" ? "alert" : "stable"
      }
      
      setSensorReadings(updatedReadings)
      
      // Update sensor battery levels
      setSensors(prevSensors => prevSensors.map(sensor => {
        if (sensor.status === "Online" && !sensor.isPowered && Math.random() > 0.7) {
          return {
            ...sensor,
            battery: Math.max(0, sensor.battery - 1)
          }
        }
        return sensor
      }))
      
    }, 5000)
    
    return () => clearInterval(interval)
  }, [sensorReadings])

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
        id: isEditing ? selectedSensor.id : Math.max(...sensors.map(s => s.id)) + 1,
        ...newSensor,
      }
      
      if (isEditing) {
        setSensors(sensors.map(s => s.id === sensor.id ? sensor : s))
        
        // Update sensor readings for renamed sensors
        if (selectedSensor.name !== sensor.name) {
          const updatedReadings = {...sensorReadings}
          if (updatedReadings[selectedSensor.name]) {
            updatedReadings[sensor.name] = updatedReadings[selectedSensor.name]
            delete updatedReadings[selectedSensor.name]
            setSensorReadings(updatedReadings)
          }
        }
        
        setIsEditing(false)
      } else {
        setSensors([...sensors, sensor])
        
        // Initialize sensor readings based on type
        const newReadings = {...sensorReadings}
        switch(sensor.type) {
          case "Temperature":
            newReadings[sensor.name] = { value: 22 + (Math.random() * 4 - 2), unit: "°C", trend: "stable", lastUpdated: "Just now" }
            break
          case "Humidity":
            newReadings[sensor.name] = { value: 45 + (Math.random() * 10 - 5), unit: "%", trend: "stable", lastUpdated: "Just now" }
            break
          case "Motion":
            newReadings[sensor.name] = { value: "No motion", unit: "", trend: "inactive", lastUpdated: "Just now" }
            break
          case "Smoke":
            newReadings[sensor.name] = { value: "Clear", unit: "", trend: "stable", lastUpdated: "Just now" }
            break
          case "Gas":
            newReadings[sensor.name] = { value: "Normal", unit: "", trend: "stable", lastUpdated: "Just now" }
            break
          case "Camera":
            newReadings[sensor.name] = { value: "Standby", unit: "", trend: "inactive", lastUpdated: "Just now" }
            break
          case "Pressure":
            newReadings[sensor.name] = { value: 1013 + (Math.random() * 10 - 5), unit: "hPa", trend: "stable", lastUpdated: "Just now" }
            break
          default:
            newReadings[sensor.name] = { value: 0, unit: "", trend: "unknown", lastUpdated: "Just now" }
        }
        setSensorReadings(newReadings)
      }
      
      resetForm()
    }
  }
  
  const handleEditSensor = (sensor) => {
    setSelectedSensor(sensor)
    setNewSensor({
      name: sensor.name,
      type: sensor.type,
      location: sensor.location,
      status: sensor.status,
      battery: sensor.battery,
      lastMaintenance: sensor.lastMaintenance,
      isPowered: sensor.isPowered || false
    })
    setIsEditing(true)
    setShowAddSensor(true)
  }
  
  const handleDeleteSensor = (sensor) => {
    setSelectedSensor(sensor)
    setShowDeleteConfirm(true)
  }
  
  const confirmDeleteSensor = () => {
    if (selectedSensor) {
      setSensors(sensors.filter(s => s.id !== selectedSensor.id))
      
      // Remove sensor readings
      const updatedReadings = {...sensorReadings}
      delete updatedReadings[selectedSensor.name]
      setSensorReadings(updatedReadings)
      
      setShowDeleteConfirm(false)
      setSelectedSensor(null)
    }
  }
  
  const toggleSensorStatus = (sensor) => {
    const newStatus = sensor.status === "Online" ? "Offline" : "Online"
    setSensors(sensors.map(s => s.id === sensor.id ? {...s, status: newStatus} : s))
    
    // Update sensor readings status
    if (newStatus === "Offline" && sensorReadings[sensor.name]) {
      const updatedReadings = {...sensorReadings}
      updatedReadings[sensor.name].trend = "inactive"
      updatedReadings[sensor.name].lastUpdated = "Just now"
      setSensorReadings(updatedReadings)
    }
  }
  
  const resetForm = () => {
    setNewSensor({
      name: "",
      type: "Temperature",
      location: "",
      status: "Online",
      battery: 100,
      lastMaintenance: new Date().toISOString().split('T')[0]
    })
    setShowAddSensor(false)
    setIsEditing(false)
    setSelectedSensor(null)
  }
  
  const getSensorTypeIcon = (type) => {
    switch(type) {
      case "Temperature": return <Thermometer size={18} className="sensor-icon temperature" />
      case "Humidity": return <Droplet size={18} className="sensor-icon humidity" />
      case "Motion": return <Activity size={18} className="sensor-icon motion" />
      case "Smoke": return <AlertTriangle size={18} className="sensor-icon smoke" />
      case "Camera": return <Video size={18} className="sensor-icon camera" />
      case "Gas": return <Wind size={18} className="sensor-icon gas" />
      case "Pressure": return <Activity size={18} className="sensor-icon pressure" />
      default: return <Activity size={18} className="sensor-icon" />
    }
  }
  
  // Filter sensors based on search term and filters
  const filteredSensors = sensors.filter(sensor => {
    // Filter by search term
    const matchesSearch = 
      sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by type
    const matchesType = filterType === "All" || sensor.type === filterType
    
    // Filter by status
    const matchesStatus = filterStatus === "All" || sensor.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })
  
  // Get reading trend icon
  const getTrendIcon = (trend) => {
    switch(trend) {
      case "rising": return <span className="trend-icon rising">↑</span>
      case "falling": return <span className="trend-icon falling">↓</span>
      case "stable": return <span className="trend-icon stable">→</span>
      case "active": return <span className="trend-icon active">●</span>
      case "inactive": return <span className="trend-icon inactive">○</span>
      case "alert": return <span className="trend-icon alert">!</span>
      default: return <span className="trend-icon">-</span>
    }
  }
  
  // Get battery level class
  const getBatteryClass = (level) => {
    if (level > 70) return "high"
    if (level > 30) return "medium"
    return "low"
  }

  return (
    <div className="sensors-container">
      <div className="page-header">
        <h2 className="page-title">Sensors Management</h2>
        <div className="action-buttons">
          <button className="btn btn-secondary">
            <RefreshCw size={16} className="btn-icon" />
            Refresh
          </button>
          
          <button className="btn btn-primary" onClick={() => setShowAddSensor(true)}>
            <Plus size={16} className="btn-icon" />
            Add Sensor
          </button>
        </div>
      </div>
      
      <div className="sensors-filters">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search sensors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Types</option>
              <option value="Temperature">Temperature</option>
              <option value="Humidity">Humidity</option>
              <option value="Motion">Motion</option>
              <option value="Smoke">Smoke</option>
              <option value="Gas">Gas</option>
              <option value="Camera">Camera</option>
              <option value="Pressure">Pressure</option>
            </select>
          </div>
          
          <div className="filter-group">
            <Activity size={16} className="filter-icon" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="sensors-summary">
        <div className="summary-item">
          <div className="summary-value">{sensors.filter(s => s.status === "Online").length}</div>
          <div className="summary-label">Online Sensors</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{sensors.filter(s => s.status === "Offline").length}</div>
          <div className="summary-label">Offline Sensors</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{sensors.filter(s => s.battery < 20).length}</div>
          <div className="summary-label">Low Battery</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{Object.values(sensorReadings).filter(r => r.trend === "alert").length}</div>
          <div className="summary-label">Alerts</div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="sensors-grid">
        {filteredSensors.map((sensor) => {
          const reading = sensorReadings[sensor.name]
          return (
            <div key={sensor.id} className={`card sensor-card ${sensor.status.toLowerCase()}`}>
              <div className="card-header">
                <div className="sensor-title">
                  {getSensorTypeIcon(sensor.type)}
                  <h3 className="card-title">{sensor.name}</h3>
                </div>
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
                  
                  {reading && (
                    <div className="sensor-reading">
                      <div className="reading-value">
                        {typeof reading.value === 'number' ? reading.value.toFixed(1) : reading.value}
                        {reading.unit} {getTrendIcon(reading.trend)}
                      </div>
                      <div className="reading-time">Updated: {reading.lastUpdated}</div>
                    </div>
                  )}
                  
                  <div className="sensor-battery">
                    <div className="battery-label">Battery:</div>
                    <div className={`battery-indicator ${getBatteryClass(sensor.battery)}`}>
                      <div className="battery-level" style={{width: `${sensor.battery}%`}}></div>
                    </div>
                    <div className="battery-percentage">{sensor.battery}%</div>
                  </div>
                </div>
                
                <div className="sensor-actions">
                  <button className="action-btn toggle-btn" onClick={() => toggleSensorStatus(sensor)}>
                    <Power size={16} className="action-icon" />
                    {sensor.status === "Online" ? "Turn Off" : "Turn On"}
                  </button>
                  <button className="action-btn edit-btn" onClick={() => handleEditSensor(sensor)}>
                    <Edit2 size={16} className="action-icon" />
                    Edit
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDeleteSensor(sensor)}>
                    <Trash2 size={16} className="action-icon" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        
        {filteredSensors.length === 0 && (
          <div className="no-sensors-message">
            <AlertTriangle size={24} />
            <p>No sensors found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Sensor Modal */}
      {showAddSensor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? "Edit Sensor" : "Add New Sensor"}</h3>
              <button className="modal-close" onClick={resetForm}>
                <X size={18} />
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
                  required
                />
              </div>
              <div className="form-row">
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
                  <label htmlFor="status">Status</label>
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
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="battery">Battery Level (%)</label>
                  <input
                    type="number"
                    id="battery"
                    name="battery"
                    className="form-input"
                    min="0"
                    max="100"
                    value={newSensor.battery}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastMaintenance">Last Maintenance</label>
                  <input
                    type="date"
                    id="lastMaintenance"
                    name="lastMaintenance"
                    className="form-input"
                    value={newSensor.lastMaintenance}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isPowered"
                  name="isPowered"
                  checked={newSensor.isPowered || false}
                  onChange={(e) => setNewSensor({...newSensor, isPowered: e.target.checked})}
                />
                <label htmlFor="isPowered">AC Powered (no battery drain)</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddSensor}>
                <Check size={16} className="btn-icon" />
                {isEditing ? "Update Sensor" : "Add Sensor"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedSensor && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Deletion</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <AlertTriangle size={48} className="delete-icon" />
              <p>Are you sure you want to delete <strong>{selectedSensor.name}</strong>?</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDeleteSensor}>
                <Trash2 size={16} className="btn-icon" />
                Delete Sensor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}