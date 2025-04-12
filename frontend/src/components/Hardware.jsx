"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import {
  Radio,
  Cpu,
  Battery,
  Thermometer,
  Clock,
  RefreshCw,
  AlertTriangle,
  Wind,
  Zap,
  Wifi,
  Server,
  X,
  Activity,
  ChevronRight,
  Shield,
  CheckCircle,
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
      location: "Algiers Central",
      anomalies: [],
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
      location: "Oran North",
      anomalies: [
        {
          id: 1,
          type: "CPU",
          message: "High CPU usage detected",
          timestamp: "2023-04-12 14:32:45",
          severity: "warning",
        },
        {
          id: 2,
          type: "Memory",
          message: "Memory usage above threshold",
          timestamp: "2023-04-12 15:10:22",
          severity: "warning",
        },
      ],
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
      location: "Constantine West",
      anomalies: [
        {
          id: 3,
          type: "Maintenance",
          message: "Scheduled maintenance in progress",
          timestamp: "2023-04-12 08:00:00",
          severity: "info",
        },
      ],
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
      location: "Algiers-Blida Link",
      anomalies: [],
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
      location: "Algiers Central",
      anomalies: [],
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
      location: "Algiers Central",
      anomalies: [],
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
      location: "Algiers Central",
      anomalies: [],
    },
  ])

  // State for modal and selected hardware
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedHardware, setSelectedHardware] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate total metrics
  const totalSystemUsage =
    hardwareItems
      .filter((item) => item.type === "bts" && item.status === "Online")
      .reduce((sum, item) => sum + item.cpu, 0) /
      hardwareItems.filter((item) => item.type === "bts" && item.status === "Online").length || 0

  const totalPowerUsage =
    hardwareItems
      .filter((item) => item.status === "Online" && item.power !== undefined)
      .reduce((sum, item) => sum + item.power, 0) /
      hardwareItems.filter((item) => item.status === "Online" && item.power !== undefined).length || 0

  const totalTemperature =
    hardwareItems.filter((item) => item.status === "Online").reduce((sum, item) => sum + item.temperature, 0) /
      hardwareItems.filter((item) => item.status === "Online").length || 0

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
      setHardwareItems((prevItems) =>
        prevItems.map((item) => {
          if (item.status === "Maintenance") return item

          // Update BTS metrics
          if (item.type === "bts") {
            const newCpu = Math.min(
              100,
              Math.max(5, item.cpu + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)),
            )
            const newMemory = Math.min(
              100,
              Math.max(10, item.memory + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)),
            )
            const newTemp = Math.min(
              70,
              Math.max(25, item.temperature + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
            )

            // Check for new anomalies
            const anomalies = [...item.anomalies]

            if (newCpu > 85 && !anomalies.some((a) => a.type === "CPU" && a.severity === "critical")) {
              anomalies.push({
                id: Date.now(),
                type: "CPU",
                message: "Critical CPU usage detected",
                timestamp: new Date().toLocaleString(),
                severity: "critical",
              })
            } else if (newCpu > 75 && !anomalies.some((a) => a.type === "CPU")) {
              anomalies.push({
                id: Date.now(),
                type: "CPU",
                message: "High CPU usage detected",
                timestamp: new Date().toLocaleString(),
                severity: "warning",
              })
            }

            if (newMemory > 85 && !anomalies.some((a) => a.type === "Memory" && a.severity === "critical")) {
              anomalies.push({
                id: Date.now() + 1,
                type: "Memory",
                message: "Critical memory usage detected",
                timestamp: new Date().toLocaleString(),
                severity: "critical",
              })
            } else if (newMemory > 75 && !anomalies.some((a) => a.type === "Memory")) {
              anomalies.push({
                id: Date.now() + 1,
                type: "Memory",
                message: "High memory usage detected",
                timestamp: new Date().toLocaleString(),
                severity: "warning",
              })
            }

            if (newTemp > 60 && !anomalies.some((a) => a.type === "Temperature")) {
              anomalies.push({
                id: Date.now() + 2,
                type: "Temperature",
                message: "High temperature detected",
                timestamp: new Date().toLocaleString(),
                severity: "warning",
              })
            }

            return {
              ...item,
              cpu: newCpu,
              memory: newMemory,
              temperature: newTemp,
              fan: item.fan
                ? Math.min(100, Math.max(20, item.fan + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)))
                : undefined,
              power: Math.min(
                100,
                Math.max(20, item.power + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
              ),
              alerts: anomalies.length,
              anomalies,
            }
          }

          // Update other equipment metrics
          if (["network", "transmission", "power", "hvac"].includes(item.type)) {
            const updatedItem = { ...item }
            const anomalies = [...item.anomalies]

            if (item.temperature !== undefined) {
              updatedItem.temperature = Math.min(
                60,
                Math.max(15, item.temperature + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
              )

              if (updatedItem.temperature > 55 && !anomalies.some((a) => a.type === "Temperature")) {
                anomalies.push({
                  id: Date.now(),
                  type: "Temperature",
                  message: "High temperature detected",
                  timestamp: new Date().toLocaleString(),
                  severity: "warning",
                })
              }
            }

            if (item.fan !== undefined) {
              updatedItem.fan = Math.min(
                100,
                Math.max(20, item.fan + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)),
              )

              if (updatedItem.fan > 90 && !anomalies.some((a) => a.type === "Fan")) {
                anomalies.push({
                  id: Date.now() + 1,
                  type: "Fan",
                  message: "Fan running at high speed",
                  timestamp: new Date().toLocaleString(),
                  severity: "warning",
                })
              }
            }

            if (item.power !== undefined) {
              updatedItem.power = Math.min(
                100,
                Math.max(40, item.power + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
              )

              if (updatedItem.power > 85 && !anomalies.some((a) => a.type === "Power")) {
                anomalies.push({
                  id: Date.now() + 2,
                  type: "Power",
                  message: "High power consumption",
                  timestamp: new Date().toLocaleString(),
                  severity: "warning",
                })
              }
            }

            if (item.batteryLevel !== undefined) {
              updatedItem.batteryLevel = Math.min(
                100,
                Math.max(90, item.batteryLevel + (Math.random() > 0.7 ? 0 : -1) * Math.floor(Math.random() * 1)),
              )

              if (updatedItem.batteryLevel < 92 && !anomalies.some((a) => a.type === "Battery")) {
                anomalies.push({
                  id: Date.now() + 3,
                  type: "Battery",
                  message: "Battery level decreasing",
                  timestamp: new Date().toLocaleString(),
                  severity: "info",
                })
              }
            }

            if (item.humidity !== undefined) {
              updatedItem.humidity = Math.min(
                60,
                Math.max(40, item.humidity + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
              )
            }

            if (item.signalStrength !== undefined) {
              updatedItem.signalStrength = Math.min(
                95,
                Math.max(75, item.signalStrength + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
              )

              if (updatedItem.signalStrength < 80 && !anomalies.some((a) => a.type === "Signal")) {
                anomalies.push({
                  id: Date.now() + 4,
                  type: "Signal",
                  message: "Signal strength degradation",
                  timestamp: new Date().toLocaleString(),
                  severity: "warning",
                })
              }
            }

            updatedItem.anomalies = anomalies
            updatedItem.alerts = anomalies.length

            return updatedItem
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

  // Get anomaly icon based on type
  const getAnomalyIcon = (type) => {
    switch (type) {
      case "CPU":
        return <Cpu className="w-4 h-4" />
      case "Memory":
        return <Server className="w-4 h-4" />
      case "Temperature":
        return <Thermometer className="w-4 h-4" />
      case "Fan":
        return <Wind className="w-4 h-4" />
      case "Power":
        return <Zap className="w-4 h-4" />
      case "Battery":
        return <Battery className="w-4 h-4" />
      case "Signal":
        return <Wifi className="w-4 h-4" />
      case "Maintenance":
        return <RefreshCw className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "info":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  // Get severity badge color
  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle view details
  const handleViewDetails = (item) => {
    setSelectedHardware(item)
    setActiveTab("overview")
    setShowDetailsModal(true)
  }

  // Close modals
  const closeModals = () => {
    setShowDetailsModal(false)
    setSelectedHardware(null)
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
                <span
                  className={`status-badge px-2 py-1 text-xs rounded-full ${
                    getStatusColor(item.status) === "online"
                      ? "bg-green-100 text-green-800"
                      : getStatusColor(item.status) === "offline"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.status}
                </span>
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
                        <div
                          className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                            getUsageLevel(item.cpu) === "low"
                              ? "bg-green-500"
                              : getUsageLevel(item.cpu) === "medium"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${item.cpu}%` }}
                        >
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
                            item.batteryLevel > 80
                              ? "bg-green-500"
                              : item.batteryLevel > 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
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
                            item.performance > 80
                              ? "bg-green-500"
                              : item.performance > 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
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
                      <div
                        className={`progress-bar text-xs text-white text-center rounded-full h-3 ${
                          getFanLevel(item.fan) === "low"
                            ? "bg-green-500"
                            : getFanLevel(item.fan) === "medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${item.fan}%` }}
                      >
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
              <button
                className="btn btn-secondary btn-sm px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => handleViewDetails(item)}
              >
                Details
              </button>
              <button className="btn btn-secondary btn-sm px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">
                Restart
              </button>
              <button className="btn btn-secondary btn-sm px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">
                Maintenance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Improved Details Modal with Tabs */}
      {showDetailsModal && selectedHardware && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-gray-50">
              <h3 className="text-xl font-bold flex items-center gap-2">
                
                <div>
                  {selectedHardware.name}
                  <div className="text-sm font-normal text-gray-500">{selectedHardware.location}</div>
                </div>
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className={`status-badge px-3 py-1 text-xs rounded-full font-medium ${
                    getStatusColor(selectedHardware.status) === "online"
                      ? "bg-green-100 text-green-800"
                      : getStatusColor(selectedHardware.status) === "offline"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedHardware.status}
                </span>
                <button onClick={closeModals} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b">
              <div className="flex">
                <button
                  className={`px-5 py-3 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "overview"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <Shield className="w-4 h-4" />
                  Overview
                </button>
                <button
                  className={`px-5 py-3 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "anomalies"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("anomalies")}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Anomalies
                  {selectedHardware.alerts > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      {selectedHardware.alerts}
                    </span>
                  )}
                </button>
                <button
                  className={`px-5 py-3 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "details"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  <Activity className="w-4 h-4" />
                  Technical Details
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Metrics */}
                    <div className="bg-white rounded-lg border p-5 shadow-sm">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Key Metrics
                      </h4>
                      <div className="space-y-4">
                        {selectedHardware.cpu !== undefined && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600 font-medium">CPU Usage:</span>
                              <span
                                className={`font-medium ${
                                  getUsageLevel(selectedHardware.cpu) === "low"
                                    ? "text-green-600"
                                    : getUsageLevel(selectedHardware.cpu) === "medium"
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {selectedHardware.cpu}%
                              </span>
                            </div>
                            <div className="progress-container w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`progress-bar h-2.5 rounded-full ${
                                  getUsageLevel(selectedHardware.cpu) === "low"
                                    ? "bg-green-500"
                                    : getUsageLevel(selectedHardware.cpu) === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${selectedHardware.cpu}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {selectedHardware.memory !== undefined && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600 font-medium">Memory Usage:</span>
                              <span
                                className={`font-medium ${
                                  getUsageLevel(selectedHardware.memory) === "low"
                                    ? "text-green-600"
                                    : getUsageLevel(selectedHardware.memory) === "medium"
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {selectedHardware.memory}%
                              </span>
                            </div>
                            <div className="progress-container w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`progress-bar h-2.5 rounded-full ${
                                  getUsageLevel(selectedHardware.memory) === "low"
                                    ? "bg-green-500"
                                    : getUsageLevel(selectedHardware.memory) === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${selectedHardware.memory}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {selectedHardware.temperature !== undefined && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600 font-medium">Temperature:</span>
                              <span
                                className={`font-medium ${
                                  getTemperatureLevel(
                                    selectedHardware.temperature,
                                    selectedHardware.type === "hvac" ? "hvac" : "normal",
                                  ) === "low"
                                    ? "text-green-600"
                                    : getTemperatureLevel(
                                          selectedHardware.temperature,
                                          selectedHardware.type === "hvac" ? "hvac" : "normal",
                                        ) === "medium"
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {selectedHardware.temperature}°C
                              </span>
                            </div>
                            <div className="progress-container w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`progress-bar h-2.5 rounded-full ${
                                  getTemperatureLevel(
                                    selectedHardware.temperature,
                                    selectedHardware.type === "hvac" ? "hvac" : "normal",
                                  ) === "low"
                                    ? "bg-green-500"
                                    : getTemperatureLevel(
                                          selectedHardware.temperature,
                                          selectedHardware.type === "hvac" ? "hvac" : "normal",
                                        ) === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{
                                  width: `${(selectedHardware.temperature / (selectedHardware.type === "hvac" ? 40 : 70)) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {selectedHardware.power !== undefined && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600 font-medium">Power Usage:</span>
                              <span
                                className={`font-medium ${
                                  getUsageLevel(selectedHardware.power) === "low"
                                    ? "text-green-600"
                                    : getUsageLevel(selectedHardware.power) === "medium"
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {selectedHardware.power}%
                              </span>
                            </div>
                            <div className="progress-container w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`progress-bar h-2.5 rounded-full ${
                                  getUsageLevel(selectedHardware.power) === "low"
                                    ? "bg-green-500"
                                    : getUsageLevel(selectedHardware.power) === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${selectedHardware.power}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {selectedHardware.fan !== undefined && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600 font-medium">Fan Speed:</span>
                              <span
                                className={`font-medium ${
                                  getFanLevel(selectedHardware.fan) === "low"
                                    ? "text-green-600"
                                    : getFanLevel(selectedHardware.fan) === "medium"
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {selectedHardware.fan}%
                              </span>
                            </div>
                            <div className="progress-container w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`progress-bar h-2.5 rounded-full ${
                                  getFanLevel(selectedHardware.fan) === "low"
                                    ? "bg-green-500"
                                    : getFanLevel(selectedHardware.fan) === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${selectedHardware.fan}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Type-specific metrics */}
                        {selectedHardware.type === "transmission" && selectedHardware.signalStrength && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600 font-medium">Signal Strength:</span>
                              <span
                                className={`font-medium ${
                                  selectedHardware.signalStrength > 80
                                    ? "text-green-600"
                                    : selectedHardware.signalStrength > 70
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {selectedHardware.signalStrength}%
                              </span>
                            </div>
                            <div className="progress-container w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`progress-bar h-2.5 rounded-full ${
                                  selectedHardware.signalStrength > 80
                                    ? "bg-green-500"
                                    : selectedHardware.signalStrength > 70
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${selectedHardware.signalStrength}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {selectedHardware.type === "power" && selectedHardware.batteryLevel && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600 font-medium">Battery Level:</span>
                              <span
                                className={`font-medium ${
                                  selectedHardware.batteryLevel > 80
                                    ? "text-green-600"
                                    : selectedHardware.batteryLevel > 50
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {selectedHardware.batteryLevel}%
                              </span>
                            </div>
                            <div className="progress-container w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`progress-bar h-2.5 rounded-full ${
                                  selectedHardware.batteryLevel > 80
                                    ? "bg-green-500"
                                    : selectedHardware.batteryLevel > 50
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${selectedHardware.batteryLevel}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-white rounded-lg border p-5 shadow-sm">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Status Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`font-medium ${
                              getStatusColor(selectedHardware.status) === "online"
                                ? "text-green-600"
                                : getStatusColor(selectedHardware.status) === "offline"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {selectedHardware.status}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{selectedHardware.location}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Uptime:</span>
                          <span className="font-medium">{selectedHardware.uptime}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium uppercase">{selectedHardware.type}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Alerts:</span>
                          <span
                            className={`font-medium ${selectedHardware.alerts > 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            {selectedHardware.alerts} {selectedHardware.alerts === 1 ? "alert" : "alerts"}
                          </span>
                        </div>

                        {/* Type-specific information */}
                        {selectedHardware.type === "transmission" && (
                          <>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Bandwidth:</span>
                              <span className="font-medium">{selectedHardware.bandwidth}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-medium">{selectedHardware.capacity}</span>
                            </div>
                          </>
                        )}

                        {selectedHardware.type === "network" && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Active Ports:</span>
                            <span className="font-medium">{selectedHardware.ports}</span>
                          </div>
                        )}

                        {selectedHardware.type === "power" && (
                          <>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Main Power:</span>
                              <span className="font-medium">{selectedHardware.mainPower}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Backup Power:</span>
                              <span className="font-medium">{selectedHardware.backupPower}</span>
                            </div>
                          </>
                        )}

                        {selectedHardware.type === "hvac" && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Humidity:</span>
                            <span className="font-medium">{selectedHardware.humidity}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Anomalies Preview */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Recent Anomalies
                      </h4>
                      {selectedHardware.anomalies.length > 0 && (
                        <button
                          onClick={() => setActiveTab("anomalies")}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View All
                        </button>
                      )}
                    </div>

                    {selectedHardware.anomalies.length > 0 ? (
                      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <div className="divide-y">
                          {selectedHardware.anomalies.slice(0, 2).map((anomaly) => (
                            <div key={anomaly.id} className="p-4 hover:bg-gray-50">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-1 p-2 rounded-full ${
                                    anomaly.severity === "critical"
                                      ? "bg-red-100 text-red-600"
                                      : anomaly.severity === "warning"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  {getAnomalyIcon(anomaly.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-medium">{anomaly.type} Anomaly</h5>
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityBadgeColor(anomaly.severity)}`}
                                    >
                                      {anomaly.severity}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1 text-gray-600">{anomaly.message}</p>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500">{anomaly.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {selectedHardware.anomalies.length > 2 && (
                          <div className="bg-gray-50 p-3 text-center">
                            <button
                              onClick={() => setActiveTab("anomalies")}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View {selectedHardware.anomalies.length - 2} more anomalies
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h5 className="text-lg font-medium mb-1">No Anomalies Detected</h5>
                        <p className="text-sm text-gray-600">This hardware is operating within normal parameters.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Anomalies Tab */}
              {activeTab === "anomalies" && (
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold">Active Anomalies</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {selectedHardware.anomalies.length}{" "}
                        {selectedHardware.anomalies.length === 1 ? "anomaly" : "anomalies"} detected
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      The following anomalies have been detected for this hardware. Review and take appropriate action.
                    </p>
                  </div>

                  {selectedHardware.anomalies.length > 0 ? (
                    <div className="space-y-4">
                      {selectedHardware.anomalies.map((anomaly) => (
                        <div
                          key={anomaly.id}
                          className={`p-4 rounded-lg border shadow-sm ${getSeverityColor(anomaly.severity)}`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`mt-1 p-2 rounded-full ${
                                anomaly.severity === "critical"
                                  ? "bg-red-100 text-red-600"
                                  : anomaly.severity === "warning"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {getAnomalyIcon(anomaly.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h5 className="font-medium text-lg">{anomaly.type} Anomaly</h5>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityBadgeColor(anomaly.severity)}`}
                                >
                                  {anomaly.severity}
                                </span>
                              </div>
                              <p className="text-sm mt-2">{anomaly.message}</p>
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-xs text-gray-500">{anomaly.timestamp}</span>
                                <div className="flex gap-2">
                                  <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors">
                                    Ignore
                                  </button>
                                  <button className="text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded font-medium transition-colors">
                                    Resolve
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-green-50 rounded-lg border border-green-100">
                      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h5 className="text-xl font-medium mb-2">No Anomalies Detected</h5>
                      <p className="text-gray-600">This hardware is operating within normal parameters.</p>
                    </div>
                  )}

                  {selectedHardware.anomalies.length > 0 && (
                    <div className="mt-8 bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <h5 className="font-medium text-lg mb-4 text-blue-800">Recommended Actions</h5>
                      <ul className="space-y-3 text-sm">
                        {selectedHardware.anomalies.some((a) => a.type === "CPU" || a.type === "Memory") && (
                          <li className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm">
                            <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>
                              Check for resource-intensive processes and consider restarting the system if CPU or memory
                              usage remains high.
                            </span>
                          </li>
                        )}
                        {selectedHardware.anomalies.some((a) => a.type === "Temperature") && (
                          <li className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm">
                            <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>
                              Verify cooling system operation and ensure proper ventilation around the equipment.
                            </span>
                          </li>
                        )}
                        {selectedHardware.anomalies.some((a) => a.type === "Fan") && (
                          <li className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm">
                            <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>
                              Inspect fan for obstructions and consider replacement if noise or vibration is detected.
                            </span>
                          </li>
                        )}
                        {selectedHardware.anomalies.some((a) => a.type === "Power") && (
                          <li className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm">
                            <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>
                              Check power supply and connections. Consider load balancing if power consumption remains
                              high.
                            </span>
                          </li>
                        )}
                        {selectedHardware.anomalies.some((a) => a.type === "Battery") && (
                          <li className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm">
                            <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>
                              Monitor battery discharge rate and schedule replacement if capacity continues to decrease.
                            </span>
                          </li>
                        )}
                        {selectedHardware.anomalies.some((a) => a.type === "Signal") && (
                          <li className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm">
                            <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>
                              Check antenna alignment and inspect for physical obstructions or interference sources.
                            </span>
                          </li>
                        )}
                        {selectedHardware.anomalies.some((a) => a.type === "Maintenance") && (
                          <li className="flex items-start gap-3 bg-white p-3 rounded-md shadow-sm">
                            <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Scheduled maintenance is in progress. No action required until completion.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Technical Details Tab */}
              {activeTab === "details" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedHardware.type === "bts" && (
                      <>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Network Configuration</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Cell ID:</span>
                              <span className="font-medium">BTS-{selectedHardware.id.toString().padStart(3, "0")}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Frequency Band:</span>
                              <span className="font-medium">900/1800 MHz</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Transmission Type:</span>
                              <span className="font-medium">Microwave</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Coverage Radius:</span>
                              <span className="font-medium">5.2 km</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Antenna Height:</span>
                              <span className="font-medium">45 m</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Power Output:</span>
                              <span className="font-medium">40 W</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Performance History</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Last Restart:</span>
                              <span className="font-medium">{selectedHardware.uptime} ago</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Peak CPU Usage:</span>
                              <span className="font-medium">85%</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Average Temperature:</span>
                              <span className="font-medium">45°C</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Firmware Version:</span>
                              <span className="font-medium">v4.2.1</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Last Maintenance:</span>
                              <span className="font-medium">2023-03-15</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Next Scheduled Maintenance:</span>
                              <span className="font-medium">2023-09-15</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedHardware.type === "transmission" && (
                      <>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Link Information</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Link Type:</span>
                              <span className="font-medium">Point-to-Point Microwave</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Frequency:</span>
                              <span className="font-medium">18 GHz</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Distance:</span>
                              <span className="font-medium">12.5 km</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Antenna Type:</span>
                              <span className="font-medium">Parabolic</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Antenna Gain:</span>
                              <span className="font-medium">38 dBi</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Polarization:</span>
                              <span className="font-medium">Vertical</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Performance Metrics</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Latency:</span>
                              <span className="font-medium">4.2 ms</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Packet Loss:</span>
                              <span className="font-medium">0.02%</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Modulation:</span>
                              <span className="font-medium">256 QAM</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Firmware Version:</span>
                              <span className="font-medium">v3.8.2</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Last Alignment:</span>
                              <span className="font-medium">2023-02-10</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Weather Resistance:</span>
                              <span className="font-medium">IP67</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedHardware.type === "network" && (
                      <>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Network Configuration</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">IP Range:</span>
                              <span className="font-medium">10.45.67.0/24</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">VLAN Count:</span>
                              <span className="font-medium">8</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Management IP:</span>
                              <span className="font-medium">10.45.67.1</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Switch Model:</span>
                              <span className="font-medium">Cisco Catalyst 9300</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Firmware Version:</span>
                              <span className="font-medium">IOS-XE 17.3.4</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Redundancy:</span>
                              <span className="font-medium">Active/Standby</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Traffic Statistics</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Throughput:</span>
                              <span className="font-medium">3.2 Gbps</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Packets/sec:</span>
                              <span className="font-medium">45,000</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Error Rate:</span>
                              <span className="font-medium">0.001%</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Broadcast Traffic:</span>
                              <span className="font-medium">2.5%</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Multicast Traffic:</span>
                              <span className="font-medium">1.8%</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">QoS Enabled:</span>
                              <span className="font-medium">Yes</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedHardware.type === "power" && (
                      <>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Power System</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Input Voltage:</span>
                              <span className="font-medium">220V AC</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Output Voltage:</span>
                              <span className="font-medium">48V DC</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Backup Runtime:</span>
                              <span className="font-medium">8 hours</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Power Capacity:</span>
                              <span className="font-medium">10 kVA</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Generator:</span>
                              <span className="font-medium">Diesel, 15 kVA</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Transfer Switch:</span>
                              <span className="font-medium">Automatic</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Battery Information</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Battery Type:</span>
                              <span className="font-medium">Lithium-Ion</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-medium">200 Ah</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Last Replaced:</span>
                              <span className="font-medium">2023-01-15</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Charge Cycles:</span>
                              <span className="font-medium">124</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Charging Method:</span>
                              <span className="font-medium">Float Charging</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Expected Lifespan:</span>
                              <span className="font-medium">5 years</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedHardware.type === "hvac" && (
                      <>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">HVAC System</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Cooling Capacity:</span>
                              <span className="font-medium">24,000 BTU</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Target Temperature:</span>
                              <span className="font-medium">22°C</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Target Humidity:</span>
                              <span className="font-medium">45%</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">System Type:</span>
                              <span className="font-medium">Split System</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Refrigerant Type:</span>
                              <span className="font-medium">R-410A</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Energy Efficiency:</span>
                              <span className="font-medium">SEER 18</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border p-5 shadow-sm">
                          <h5 className="font-medium text-lg mb-4 border-b pb-2">Maintenance</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Filter Status:</span>
                              <span className="font-medium">Good</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Last Service:</span>
                              <span className="font-medium">2023-02-20</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Next Service:</span>
                              <span className="font-medium">2023-08-20</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Compressor Hours:</span>
                              <span className="font-medium">3,245</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-600">Condenser Cleaning:</span>
                              <span className="font-medium">2023-01-10</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Backup System:</span>
                              <span className="font-medium">Available</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button
                onClick={closeModals}
                className="btn btn-secondary px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                Close
              </button>
              <button className="btn btn-primary px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
