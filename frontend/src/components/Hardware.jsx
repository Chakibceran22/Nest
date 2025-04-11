import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import {
  Radio,
  Cpu,
  HardDrive,
  Battery,
  Thermometer,
  Clock,
  RefreshCw,
  AlertTriangle,
  Wind,
  Zap,
  Wifi,
  Server
} from "lucide-react"

export default function Hardware() {
  // Sample data for telecom equipment at Mobilis ATM sites
  const [hardwareItems, setHardwareItems] = useState([
    {
      id: 1,
      name: "BTS Unit 01",
      type: "bts",
      status: "Online",
      uptime: "45 days, 3 hours",
      cpu: 42,
      memory: 68,
      power: 56,
      temperature: 42,
      fan: 65,
      alerts: 0,
      location: "Algiers Central"
    },
    {
      id: 2,
      name: "BTS Unit 02",
      type: "bts",
      status: "Online",
      uptime: "12 days, 7 hours",
      cpu: 78,
      memory: 82,
      power: 74,
      temperature: 56,
      fan: 85,
      alerts: 2,
      location: "Oran North"
    },
    {
      id: 3,
      name: "BTS Unit 03",
      type: "bts",
      status: "Maintenance",
      uptime: "0 days, 5 hours",
      cpu: 5,
      memory: 12,
      power: 25,
      temperature: 28,
      fan: 30,
      alerts: 1,
      location: "Constantine West"
    },
    {
      id: 4,
      name: "Microwave Link 01",
      type: "transmission",
      status: "Online",
      uptime: "124 days, 11 hours",
      signalStrength: 85,
      bandwidth: "320 Mbps",
      capacity: "78%",
      temperature: 38,
      power: 55,
      alerts: 0,
      location: "Algiers-Blida Link"
    },
    {
      id: 5,
      name: "Network Switch 01",
      type: "network",
      status: "Online",
      uptime: "67 days, 14 hours",
      ports: "24/48 active",
      bandwidth: "7.2 Gbps",
      temperature: 32,
      fan: 45,
      power: 65,
      alerts: 0,
      location: "Algiers Central"
    },
    {
      id: 6,
      name: "Power System 01",
      type: "power",
      status: "Online",
      uptime: "89 days, 3 hours",
      mainPower: "Active",
      backupPower: "Standby",
      batteryLevel: 95,
      temperature: 36,
      load: 60,
      alerts: 0,
      location: "Algiers Central"
    },
    {
      id: 7,
      name: "Air Conditioning 01",
      type: "hvac",
      status: "Online",
      uptime: "34 days, 8 hours",
      temperature: 22,
      humidity: 45,
      performance: 85,
      power: 60,
      alerts: 0,
      location: "Algiers Central"
    },
  ])

  // Calculate total metrics
  const totalSystemUsage =
    hardwareItems
      .filter(item => item.type === "bts" && item.status === "Online")
      .reduce((sum, item) => sum + item.cpu, 0) /
    hardwareItems.filter(item => item.type === "bts" && item.status === "Online").length || 0

  const totalPowerUsage =
    hardwareItems
      .filter(item => item.status === "Online" && item.power !== undefined)
      .reduce((sum, item) => sum + item.power, 0) /
    hardwareItems.filter(item => item.status === "Online" && item.power !== undefined).length || 0

  const totalTemperature =
    hardwareItems
      .filter(item => item.status === "Online")
      .reduce((sum, item) => sum + item.temperature, 0) /
    hardwareItems.filter(item => item.status === "Online").length || 0

  // BTS Performance history data
  const btsPerformanceHistory = [
    { time: "00:00", bts01: 35, bts02: 65, bts03: 5 },
    { time: "04:00", bts01: 42, bts02: 72, bts03: 5 },
    { time: "08:00", bts01: 67, bts02: 78, bts03: 5 },
    { time: "12:00", bts01: 52, bts02: 65, bts03: 25 },
    { time: "16:00", bts01: 38, bts02: 58, bts03: 15 },
    { time: "20:00", bts01: 45, bts02: 70, bts03: 5 },
    { time: "23:59", bts01: 42, bts02: 78, bts03: 5 },
  ]

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHardwareItems(prevItems =>
        prevItems.map(item => {
          if (item.status === "Maintenance") return item

          // Update BTS metrics
          if (item.type === "bts") {
            return {
              ...item,
              cpu: Math.min(
                100,
                Math.max(5, item.cpu + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))
              ),
              memory: Math.min(
                100,
                Math.max(10, item.memory + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))
              ),
              temperature: Math.min(
                70,
                Math.max(25, item.temperature + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))
              ),
              fan: item.fan ? Math.min(
                100,
                Math.max(20, item.fan + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))
              ) : undefined,
              power: Math.min(
                100,
                Math.max(20, item.power + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))
              ),
            }
          }

          // Update other equipment metrics
          if (["network", "transmission", "power", "hvac"].includes(item.type)) {
            const updatedItem = { ...item }
            
            if (item.temperature !== undefined) {
              updatedItem.temperature = Math.min(
                60,
                Math.max(15, item.temperature + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))
              )
            }
            
            if (item.fan !== undefined) {
              updatedItem.fan = Math.min(
                100,
                Math.max(20, item.fan + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))
              )
            }
            
            if (item.power !== undefined) {
              updatedItem.power = Math.min(
                100,
                Math.max(40, item.power + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))
              )
            }
            
            if (item.batteryLevel !== undefined) {
              updatedItem.batteryLevel = Math.min(
                100,
                Math.max(90, item.batteryLevel + (Math.random() > 0.7 ? 0 : -1) * Math.floor(Math.random() * 1))
              )
            }
            
            if (item.humidity !== undefined) {
              updatedItem.humidity = Math.min(
                60,
                Math.max(40, item.humidity + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))
              )
            }
            
            if (item.signalStrength !== undefined) {
              updatedItem.signalStrength = Math.min(
                95,
                Math.max(75, item.signalStrength + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))
              )
            }
            
            return updatedItem
          }

          return item
        })
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Online":
        return "online"
      case "Offline":
        return "offline"
      case "Maintenance":
        return "scheduled"
      default:
        return ""
    }
  }

  // Get usage level class
  const getUsageLevel = (value) => {
    if (value < 50) return "low"
    if (value < 80) return "medium"
    return "high"
  }

  // Get temperature level class
  const getTemperatureLevel = (value, type = "normal") => {
    if (type === "hvac") {
      // For HVAC, different temperature ranges are optimal
      if (value >= 20 && value <= 24) return "low"
      if (value >= 18 && value <= 26) return "medium"
      return "high"
    } else {
      // For equipment
      if (value < 40) return "low"
      if (value < 55) return "medium"
      return "high"
    }
  }

  // Get fan level class
  const getFanLevel = (value) => {
    if (value < 40) return "low"
    if (value < 75) return "medium"
    return "high"
  }

  // Get hardware icon based on type
  const getHardwareIcon = (type) => {
    switch (type) {
      case "bts":
        return <Radio className="hardware-icon" />
      case "transmission":
        return <Wifi className="hardware-icon" />
      case "network":
        return <Server className="hardware-icon" />
      case "power":
        return <Zap className="hardware-icon" />
      case "hvac":
        return <Thermometer className="hardware-icon" />
      default:
        return <Server className="hardware-icon" />
    }
  }

  return (
    <div className="hardware-container bg-transparent p-6">
      <div className="page-header flex justify-between items-center mb-6">
        <h2 className="page-title text-2xl font-bold text-gray-800">Mobilis ATM Site Hardware Monitoring</h2>
        <div className="action-buttons flex gap-2">
          <button className="btn btn-secondary flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            <RefreshCw className="btn-icon w-4 h-4" />
            Refresh
          </button>
          <button className="btn btn-primary flex items-center gap-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">
            <Radio className="btn-icon w-4 h-4" />
            Add Hardware
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-white rounded shadow p-4">
          <div className="card-header border-b pb-2 mb-3">
            <h3 className="card-title text-lg font-semibold flex items-center gap-2">
              <Cpu className="card-icon w-5 h-5 text-blue-600" /> System Performance
            </h3>
          </div>
          <div className="card-content">
            <div className="total-metric">
              <div className="metric-value text-3xl font-bold mb-2">{totalSystemUsage.toFixed(1)}%</div>
              <div className="progress-container w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`progress-bar h-4 rounded-full ${
                    getUsageLevel(totalSystemUsage) === "low"
                      ? "bg-green-500"
                      : getUsageLevel(totalSystemUsage) === "medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${totalSystemUsage}%` }}
                ></div>
              </div>
              <div className="metric-label text-sm text-gray-600">Average across all online BTS units</div>
            </div>
          </div>
        </div>

        <div className="card bg-white rounded shadow p-4">
          <div className="card-header border-b pb-2 mb-3">
            <h3 className="card-title text-lg font-semibold flex items-center gap-2">
              <Zap className="card-icon w-5 h-5 text-yellow-600" /> Power Consumption
            </h3>
          </div>
          <div className="card-content">
            <div className="total-metric">
              <div className="metric-value text-3xl font-bold mb-2">{totalPowerUsage.toFixed(1)}%</div>
              <div className="progress-container w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`progress-bar h-4 rounded-full ${
                    getUsageLevel(totalPowerUsage) === "low"
                      ? "bg-green-500"
                      : getUsageLevel(totalPowerUsage) === "medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${totalPowerUsage}%` }}
                ></div>
              </div>
              <div className="metric-label text-sm text-gray-600">Average power usage across all equipment</div>
            </div>
          </div>
        </div>

        <div className="card bg-white rounded shadow p-4">
          <div className="card-header border-b pb-2 mb-3">
            <h3 className="card-title text-lg font-semibold flex items-center gap-2">
              <Thermometer className="card-icon w-5 h-5 text-red-600" /> Temperature Status
            </h3>
          </div>
          <div className="card-content">
            <div className="total-metric">
              <div className="metric-value text-3xl font-bold mb-2">{totalTemperature.toFixed(1)}°C</div>
              <div className="progress-container w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`progress-bar h-4 rounded-full ${
                    getTemperatureLevel(totalTemperature) === "low"
                      ? "bg-green-500"
                      : getTemperatureLevel(totalTemperature) === "medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${(totalTemperature / 70) * 100}%` }}
                ></div>
              </div>
              <div className="metric-label text-sm text-gray-600">Average temperature across all equipment</div>
            </div>
          </div>
        </div>
      </div>

      {/* BTS Performance Chart */}
      <div className="card chart-card bg-white rounded shadow mb-6">
        <div className="card-header border-b p-4">
          <h3 className="card-title text-lg font-semibold">BTS Performance History</h3>
        </div>
        <div className="card-content p-4 chart-container h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={btsPerformanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bts01" stroke="#8884d8" name="BTS Unit 01" />
              <Line type="monotone" dataKey="bts02" stroke="#82ca9d" name="BTS Unit 02" />
              <Line type="monotone" dataKey="bts03" stroke="#ffc658" name="BTS Unit 03" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hardware List */}
      <h3 className="section-title text-xl font-semibold mb-4">Telecom Equipment Status</h3>
      <div className="hardware-list grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {hardwareItems.map((item) => (
          <div key={item.id} className="card hardware-item bg-white rounded shadow">
            <div className="card-header p-4 border-b">
              <div className="hardware-header flex justify-between items-center">
                <h3 className="hardware-title text-lg font-semibold flex items-center gap-2">
                  {getHardwareIcon(item.type)}
                  {item.name}
                </h3>
                <span className={`status-badge px-2 py-1 text-xs rounded-full ${
                  getStatusColor(item.status) === "online" 
                    ? "bg-green-100 text-green-800" 
                    : getStatusColor(item.status) === "offline"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>{item.status}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">{item.location}</div>
            </div>
            <div className="card-content p-4">
              <div className="hardware-stats space-y-3">
                {/* BTS specific metrics */}
                {item.type === "bts" && (
                  <>
                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Cpu className="stat-icon w-4 h-4 text-blue-600" />
                        <span className="stat-label text-sm">System Usage</span>
                      </div>
                      <div className="progress-container w-full bg-gray-200 rounded-full h-3">
                        <div className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                          getUsageLevel(item.cpu) === "low"
                            ? "bg-green-500"
                            : getUsageLevel(item.cpu) === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`} style={{ width: `${item.cpu}%` }}>
                          {item.cpu}%
                        </div>
                      </div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Server className="stat-icon w-4 h-4 text-blue-600" />
                        <span className="stat-label text-sm">Memory Usage</span>
                      </div>
                      <div className="progress-container w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                            getUsageLevel(item.memory) === "low"
                              ? "bg-green-500"
                              : getUsageLevel(item.memory) === "medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${item.memory}%` }}
                        >
                          {item.memory}%
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Transmission equipment specific metrics */}
                {item.type === "transmission" && (
                  <>
                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Wifi className="stat-icon w-4 h-4 text-blue-600" />
                        <span className="stat-label text-sm">Signal Strength</span>
                      </div>
                      <div className="progress-container w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                            item.signalStrength > 80 
                              ? "bg-green-500" 
                              : item.signalStrength > 70 
                              ? "bg-yellow-500" 
                              : "bg-red-500"
                          }`}
                          style={{ width: `${item.signalStrength}%` }}
                        >
                          {item.signalStrength}%
                        </div>
                      </div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Wifi className="stat-icon w-4 h-4 text-blue-600" />
                        <span className="stat-label text-sm">Bandwidth</span>
                      </div>
                      <div className="stat-value text-sm">{item.bandwidth}</div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Wifi className="stat-icon w-4 h-4 text-blue-600" />
                        <span className="stat-label text-sm">Capacity Utilization</span>
                      </div>
                      <div className="stat-value text-sm">{item.capacity}</div>
                    </div>
                  </>
                )}

                {/* Network equipment specific metrics */}
                {item.type === "network" && (
                  <>
                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Server className="stat-icon w-4 h-4 text-blue-600" />
                        <span className="stat-label text-sm">Ports</span>
                      </div>
                      <div className="stat-value text-sm">{item.ports}</div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Wifi className="stat-icon w-4 h-4 text-blue-600" />
                        <span className="stat-label text-sm">Bandwidth</span>
                      </div>
                      <div className="stat-value text-sm">{item.bandwidth}</div>
                    </div>
                  </>
                )}

                {/* Power system specific metrics */}
                {item.type === "power" && (
                  <>
                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Zap className="stat-icon w-4 h-4 text-yellow-600" />
                        <span className="stat-label text-sm">Main Power</span>
                      </div>
                      <div className="stat-value text-sm">{item.mainPower}</div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Zap className="stat-icon w-4 h-4 text-yellow-600" />
                        <span className="stat-label text-sm">Backup Power</span>
                      </div>
                      <div className="stat-value text-sm">{item.backupPower}</div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Battery className="stat-icon w-4 h-4 text-green-600" />
                        <span className="stat-label text-sm">Battery Level</span>
                      </div>
                      <div className="progress-container w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                            item.batteryLevel > 80 ? "bg-green-500" : item.batteryLevel > 50 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${item.batteryLevel}%` }}
                        >
                          {item.batteryLevel}%
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* HVAC specific metrics */}
                {item.type === "hvac" && (
                  <>
                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Thermometer className="stat-icon w-4 h-4 text-red-600" />
                        <span className="stat-label text-sm">Room Temperature</span>
                      </div>
                      <div className="progress-container w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                            getTemperatureLevel(item.temperature, "hvac") === "low"
                            ? "bg-green-500"
                            : getTemperatureLevel(item.temperature, "hvac") === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          }`}
                          style={{ width: `${(item.temperature / 40) * 100}%` }}
                        >
                          {item.temperature}°C
                        </div>
                      </div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Wind className="stat-icon w-4 h-4 text-blue-600" />
                        <span className="stat-label text-sm">Humidity</span>
                      </div>
                      <div className="stat-value text-sm">{item.humidity}%</div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header flex items-center gap-1 mb-1">
                        <Zap className="stat-icon w-4 h-4 text-yellow-600" />
                        <span className="stat-label text-sm">Performance</span>
                      </div>
                      <div className="progress-container w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                            item.performance > 80 ? "bg-green-500" : item.performance > 60 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${item.performance}%` }}
                        >
                          {item.performance}%
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Common metrics shown based on availability */}
                {item.temperature !== undefined && item.type !== "hvac" && (
                  <div className="hardware-stat">
                    <div className="stat-header flex items-center gap-1 mb-1">
                      <Thermometer className="stat-icon w-4 h-4 text-red-600" />
                      <span className="stat-label text-sm">Temperature</span>
                    </div>
                    <div className="progress-container w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                          getTemperatureLevel(item.temperature) === "low"
                            ? "bg-green-500"
                            : getTemperatureLevel(item.temperature) === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${(item.temperature / 70) * 100}%` }}
                      >
                        {item.temperature}°C
                      </div>
                    </div>
                  </div>
                )}

                {item.fan !== undefined && (
                  <div className="hardware-stat">
                    <div className="stat-header flex items-center gap-1 mb-1">
                      <Wind className="stat-icon w-4 h-4 text-blue-600" />
                      <span className="stat-label text-sm">Fan Speed</span>
                    </div>
                    <div className="progress-container w-full bg-gray-200 rounded-full h-3">
                      <div className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                        getFanLevel(item.fan) === "low"
                          ? "bg-green-500"
                          : getFanLevel(item.fan) === "medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`} style={{ width: `${item.fan}%` }}>
                        {item.fan}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Meta information */}
                <div className="hardware-meta mt-4 text-sm text-gray-600">
                  <div className="meta-item flex items-center gap-1 mb-1">
                    <Clock className="meta-icon w-4 h-4" />
                    <span>Uptime: {item.uptime}</span>
                  </div>
                  {item.alerts > 0 && (
                    <div className="meta-item alert flex items-center gap-1 text-red-600">
                      <AlertTriangle className="meta-icon w-4 h-4" />
                      <span>{item.alerts} active alerts</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card-footer p-3 border-t bg-gray-50 flex justify-end gap-2">
              <button className="btn btn-secondary btn-sm px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">Details</button>
              <button className="btn btn-secondary btn-sm px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">Restart</button>
              <button className="btn btn-secondary btn-sm px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">Maintenance</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}