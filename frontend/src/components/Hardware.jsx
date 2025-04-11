import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import {
  Server,
  Cpu,
  HardDrive,
  Database,
  Thermometer,
  Clock,
  RefreshCw,
  AlertTriangle,
  Wind,
  Layers,
  Wifi,
} from "react-feather"

export function Hardware() {
  // Sample data for servers and network equipment
  const [hardwareItems, setHardwareItems] = useState([
    {
      id: 1,
      name: "Server 01",
      type: "server",
      status: "Online",
      uptime: "45 days, 3 hours",
      cpu: 42,
      memory: 68,
      disk: 56,
      temperature: 42,
      fan: 65,
      alerts: 0,
    },
    {
      id: 2,
      name: "Server 02",
      type: "server",
      status: "Online",
      uptime: "12 days, 7 hours",
      cpu: 78,
      memory: 82,
      disk: 34,
      temperature: 56,
      fan: 85,
      alerts: 2,
    },
    {
      id: 3,
      name: "Server 03",
      type: "server",
      status: "Maintenance",
      uptime: "0 days, 5 hours",
      cpu: 5,
      memory: 12,
      disk: 45,
      temperature: 28,
      fan: 30,
      alerts: 0,
    },
    {
      id: 4,
      name: "Server 04",
      type: "server",
      status: "Online",
      uptime: "124 days, 11 hours",
      cpu: 35,
      memory: 45,
      disk: 72,
      temperature: 38,
      fan: 55,
      alerts: 0,
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
    },
    {
      id: 6,
      name: "Router 01",
      type: "network",
      status: "Online",
      uptime: "89 days, 3 hours",
      bandwidth: "4.5 Gbps",
      connections: 145,
      temperature: 36,
      fan: 60,
      power: 70,
      alerts: 1,
    },
    {
      id: 7,
      name: "Storage Array 01",
      type: "storage",
      status: "Online",
      uptime: "34 days, 8 hours",
      capacity: "12/24 TB used",
      disk: 50,
      temperature: 34,
      fan: 50,
      power: 60,
      alerts: 0,
    },
  ])

  // Calculate total metrics
  const totalCpuUsage =
    hardwareItems
      .filter((item) => item.type === "server" && item.status === "Online")
      .reduce((sum, item) => sum + item.cpu, 0) /
      hardwareItems.filter((item) => item.type === "server" && item.status === "Online").length || 0

  const totalMemoryUsage =
    hardwareItems
      .filter((item) => item.type === "server" && item.status === "Online")
      .reduce((sum, item) => sum + item.memory, 0) /
      hardwareItems.filter((item) => item.type === "server" && item.status === "Online").length || 0

  const totalFanStatus =
    hardwareItems.filter((item) => item.status === "Online").reduce((sum, item) => sum + item.fan, 0) /
      hardwareItems.filter((item) => item.status === "Online").length || 0

  // CPU usage history data
  const cpuHistory = [
    { time: "00:00", server1: 35, server2: 65, server3: 5, server4: 28 },
    { time: "04:00", server1: 42, server2: 72, server3: 5, server4: 32 },
    { time: "08:00", server1: 67, server2: 78, server3: 5, server4: 45 },
    { time: "12:00", server1: 52, server2: 65, server3: 5, server4: 38 },
    { time: "16:00", server1: 38, server2: 58, server3: 5, server4: 30 },
    { time: "20:00", server1: 45, server2: 70, server3: 5, server4: 35 },
    { time: "23:59", server1: 42, server2: 78, server3: 5, server4: 35 },
  ]

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHardwareItems((prevItems) =>
        prevItems.map((item) => {
          if (item.status === "Maintenance") return item

          // Update server metrics
          if (item.type === "server") {
            return {
              ...item,
              cpu: Math.min(
                100,
                Math.max(5, item.cpu + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)),
              ),
              memory: Math.min(
                100,
                Math.max(10, item.memory + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)),
              ),
              temperature: Math.min(
                70,
                Math.max(25, item.temperature + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
              ),
              fan: Math.min(
                100,
                Math.max(20, item.fan + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)),
              ),
            }
          }

          // Update network equipment metrics
          if (item.type === "network" || item.type === "storage") {
            return {
              ...item,
              temperature: Math.min(
                60,
                Math.max(25, item.temperature + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
              ),
              fan: Math.min(
                100,
                Math.max(20, item.fan + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)),
              ),
              power: Math.min(
                100,
                Math.max(40, item.power + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
              ),
            }
          }

          return item
        }),
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
  const getTemperatureLevel = (value) => {
    if (value < 40) return "low"
    if (value < 55) return "medium"
    return "high"
  }

  // Get fan level class
  const getFanLevel = (value) => {
    if (value < 40) return "low"
    if (value < 75) return "medium"
    return "high"
  }

  return (
    <div className="hardware-container">
      <div className="page-header">
        <h2 className="page-title">Hardware Management</h2>
        <div className="action-buttons">
          <button className="btn btn-secondary">
            <RefreshCw className="btn-icon" />
            Refresh
          </button>
          <button className="btn btn-primary">
            <Server className="btn-icon" />
            Add Hardware
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Cpu className="card-icon" /> Total CPU Usage
            </h3>
          </div>
          <div className="card-content">
            <div className="total-metric">
              <div className="metric-value">{totalCpuUsage.toFixed(1)}%</div>
              <div className="progress-container">
                <div
                  className={`progress-bar ${getUsageLevel(totalCpuUsage)}`}
                  style={{ width: `${totalCpuUsage}%` }}
                ></div>
              </div>
              <div className="metric-label">Average across all online servers</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Layers className="card-icon" /> Total Memory Usage
            </h3>
          </div>
          <div className="card-content">
            <div className="total-metric">
              <div className="metric-value">{totalMemoryUsage.toFixed(1)}%</div>
              <div className="progress-container">
                <div
                  className={`progress-bar ${getUsageLevel(totalMemoryUsage)}`}
                  style={{ width: `${totalMemoryUsage}%` }}
                ></div>
              </div>
              <div className="metric-label">Average across all online servers</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Wind className="card-icon" /> Fan Status
            </h3>
          </div>
          <div className="card-content">
            <div className="total-metric">
              <div className="metric-value">{totalFanStatus.toFixed(1)}%</div>
              <div className="progress-container">
                <div
                  className={`progress-bar ${getFanLevel(totalFanStatus)}`}
                  style={{ width: `${totalFanStatus}%` }}
                ></div>
              </div>
              <div className="metric-label">Average fan speed across all hardware</div>
            </div>
          </div>
        </div>
      </div>

      {/* CPU Usage Chart */}
      <div className="card chart-card">
        <div className="card-header">
          <h3 className="card-title">CPU Usage History</h3>
        </div>
        <div className="card-content chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cpuHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="server1" stroke="#8884d8" name="Server 01" />
              <Line type="monotone" dataKey="server2" stroke="#82ca9d" name="Server 02" />
              <Line type="monotone" dataKey="server3" stroke="#ffc658" name="Server 03" />
              <Line type="monotone" dataKey="server4" stroke="#ff8042" name="Server 04" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hardware List */}
      <h3 className="section-title">Servers and Network Equipment</h3>
      <div className="hardware-list">
        {hardwareItems.map((item) => (
          <div key={item.id} className="card hardware-item">
            <div className="card-header">
              <div className="hardware-header">
                <h3 className="hardware-title">
                  {item.type === "server" && <Server className="hardware-icon" />}
                  {item.type === "network" && <Wifi className="hardware-icon" />}
                  {item.type === "storage" && <Database className="hardware-icon" />}
                  {item.name}
                </h3>
                <span className={`status-badge ${getStatusColor(item.status)}`}>{item.status}</span>
              </div>
            </div>
            <div className="card-content">
              <div className="hardware-stats">
                {/* Server specific metrics */}
                {item.type === "server" && (
                  <>
                    <div className="hardware-stat">
                      <div className="stat-header">
                        <Cpu className="stat-icon" />
                        <span className="stat-label">CPU Usage</span>
                      </div>
                      <div className="progress-container">
                        <div className={`progress-bar ${getUsageLevel(item.cpu)}`} style={{ width: `${item.cpu}%` }}>
                          {item.cpu}%
                        </div>
                      </div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header">
                        <Layers className="stat-icon" />
                        <span className="stat-label">Memory Usage</span>
                      </div>
                      <div className="progress-container">
                        <div
                          className={`progress-bar ${getUsageLevel(item.memory)}`}
                          style={{ width: `${item.memory}%` }}
                        >
                          {item.memory}%
                        </div>
                      </div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header">
                        <HardDrive className="stat-icon" />
                        <span className="stat-label">Disk Usage</span>
                      </div>
                      <div className="progress-container">
                        <div className={`progress-bar ${getUsageLevel(item.disk)}`} style={{ width: `${item.disk}%` }}>
                          {item.disk}%
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Network equipment specific metrics */}
                {item.type === "network" && (
                  <>
                    {item.ports && (
                      <div className="hardware-stat">
                        <div className="stat-header">
                          <Wifi className="stat-icon" />
                          <span className="stat-label">Ports</span>
                        </div>
                        <div className="stat-value">{item.ports}</div>
                      </div>
                    )}

                    {item.bandwidth && (
                      <div className="hardware-stat">
                        <div className="stat-header">
                          <Wifi className="stat-icon" />
                          <span className="stat-label">Bandwidth</span>
                        </div>
                        <div className="stat-value">{item.bandwidth}</div>
                      </div>
                    )}

                    {item.connections && (
                      <div className="hardware-stat">
                        <div className="stat-header">
                          <Wifi className="stat-icon" />
                          <span className="stat-label">Active Connections</span>
                        </div>
                        <div className="stat-value">{item.connections}</div>
                      </div>
                    )}
                  </>
                )}

                {/* Storage specific metrics */}
                {item.type === "storage" && (
                  <>
                    <div className="hardware-stat">
                      <div className="stat-header">
                        <Database className="stat-icon" />
                        <span className="stat-label">Storage Capacity</span>
                      </div>
                      <div className="stat-value">{item.capacity}</div>
                    </div>

                    <div className="hardware-stat">
                      <div className="stat-header">
                        <HardDrive className="stat-icon" />
                        <span className="stat-label">Disk Usage</span>
                      </div>
                      <div className="progress-container">
                        <div className={`progress-bar ${getUsageLevel(item.disk)}`} style={{ width: `${item.disk}%` }}>
                          {item.disk}%
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Common metrics for all hardware types */}
                <div className="hardware-stat">
                  <div className="stat-header">
                    <Thermometer className="stat-icon" />
                    <span className="stat-label">Temperature</span>
                  </div>
                  <div className="progress-container">
                    <div
                      className={`progress-bar ${getTemperatureLevel(item.temperature)}`}
                      style={{ width: `${(item.temperature / 70) * 100}%` }}
                    >
                      {item.temperature}°C
                    </div>
                  </div>
                </div>

                <div className="hardware-stat">
                  <div className="stat-header">
                    <Wind className="stat-icon" />
                    <span className="stat-label">Fan Speed</span>
                  </div>
                  <div className="progress-container">
                    <div className={`progress-bar ${getFanLevel(item.fan)}`} style={{ width: `${item.fan}%` }}>
                      {item.fan}%
                    </div>
                  </div>
                </div>

                {/* Meta information */}
                <div className="hardware-meta">
                  <div className="meta-item">
                    <Clock className="meta-icon" />
                    <span>Uptime: {item.uptime}</span>
                  </div>
                  {item.alerts > 0 && (
                    <div className="meta-item alert">
                      <AlertTriangle className="meta-icon" />
                      <span>{item.alerts} active alerts</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-secondary btn-sm">Details</button>
              <button className="btn btn-secondary btn-sm">Restart</button>
              <button className="btn btn-secondary btn-sm">Maintenance</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
