import { useState } from "react"
import { Bell, AlertCircle, CheckCircle, Clock, ThumbsUp, Zap, Droplet, Thermometer } from "react-feather"

export function Notifications() {
  const [filter, setFilter] = useState("all")

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "High Temperature Alert",
      message: "Server Room A temperature has exceeded threshold (28°C)",
      timestamp: "10 minutes ago",
      read: false,
      category: "temperature",
      suggestion: "Consider increasing cooling capacity or redistributing server load",
    },
    {
      id: 2,
      type: "info",
      title: "Energy Optimization",
      message: "System detected potential energy savings by adjusting cooling schedule",
      timestamp: "1 hour ago",
      read: false,
      category: "energy",
      suggestion: "Shift pre-cooling to start at 5:30 AM instead of 6:00 AM to optimize energy usage",
    },
    {
      id: 3,
      type: "success",
      title: "Maintenance Completed",
      message: "Scheduled maintenance for Cooling System B completed successfully",
      timestamp: "3 hours ago",
      read: true,
      category: "maintenance",
    },
    {
      id: 4,
      type: "alert",
      title: "Humidity Warning",
      message: "Office Area humidity has dropped below optimal range (30%)",
      timestamp: "5 hours ago",
      read: true,
      category: "humidity",
      suggestion: "Consider activating humidifiers in the affected area",
    },
    {
      id: 5,
      type: "info",
      title: "System Update Available",
      message: "New firmware update available for temperature sensors",
      timestamp: "1 day ago",
      read: true,
      category: "system",
      suggestion: "Schedule update during non-peak hours",
    },
    {
      id: 6,
      type: "alert",
      title: "Gas Sensor Alert",
      message: "Unusual gas levels detected in Kitchen area",
      timestamp: "1 day ago",
      read: false,
      category: "gas",
      suggestion: "Increase ventilation and inspect gas equipment for leaks",
    },
  ]

  // Filter notifications based on selected filter
  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.category === filter)

  // Get icon based on notification type
  const getIcon = (type, category) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="notification-type-icon alert" />
      case "success":
        return <CheckCircle className="notification-type-icon success" />
      case "info":
        if (category === "energy") return <Zap className="notification-type-icon info" />
        if (category === "humidity") return <Droplet className="notification-type-icon info" />
        if (category === "temperature") return <Thermometer className="notification-type-icon info" />
        return <Bell className="notification-type-icon info" />
      default:
        return <Clock className="notification-type-icon" />
    }
  }

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h2 className="page-title">Notifications</h2>
        <div className="notification-stats">
          <span className="notification-count">{notifications.filter((n) => !n.read).length} unread</span>
        </div>
      </div>

      <div className="notification-filters">
        <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        <button className={`filter-btn ${filter === "unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>
          Unread
        </button>
        <button className={`filter-btn ${filter === "alert" ? "active" : ""}`} onClick={() => setFilter("alert")}>
          Alerts
        </button>
        <button
          className={`filter-btn ${filter === "temperature" ? "active" : ""}`}
          onClick={() => setFilter("temperature")}
        >
          Temperature
        </button>
        <button className={`filter-btn ${filter === "humidity" ? "active" : ""}`} onClick={() => setFilter("humidity")}>
          Humidity
        </button>
        <button className={`filter-btn ${filter === "energy" ? "active" : ""}`} onClick={() => setFilter("energy")}>
          Energy
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell className="empty-icon" />
            <p>No notifications to display</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className={`notification-card ${!notification.read ? "unread" : ""}`}>
              <div className="notification-icon">{getIcon(notification.type, notification.category)}</div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className="notification-time">{notification.timestamp}</span>
                </div>
                <p className="notification-message">{notification.message}</p>

                {notification.suggestion && (
                  <div className="suggestion-box">
                    <div className="suggestion-header">
                      <ThumbsUp className="suggestion-icon" />
                      <span>Suggested Action</span>
                    </div>
                    <p className="suggestion-text">{notification.suggestion}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
