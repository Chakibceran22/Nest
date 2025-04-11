import { useState, useEffect } from "react"
import { 
  Bell, AlertCircle, CheckCircle, Clock, ThumbsUp, Zap, Droplet, 
  Thermometer, Filter, Search, MoreVertical, Eye, Trash2, CheckSquare, 
  Calendar, RefreshCw, XCircle, Wind
} from "lucide-react"

export  function Notifications() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showActionMenu, setShowActionMenu] = useState(null)
  const [notificationsData, setNotificationsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  
  // Sample notifications data
  const initialNotifications = [
    {
      id: 1,
      type: "critical",
      title: "Critical Temperature Alert",
      message: "Server Room A temperature has exceeded critical threshold (30°C). Immediate action required.",
      timestamp: "10 minutes ago",
      read: false,
      category: "temperature",
      priority: "high",
      suggestion: "Immediately increase cooling capacity or reduce server load to prevent hardware damage",
      time: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
      id: 2,
      type: "alert",
      title: "High Temperature Alert",
      message: "Server Room A temperature has exceeded threshold (28°C)",
      timestamp: "25 minutes ago",
      read: false,
      category: "temperature",
      priority: "medium",
      suggestion: "Consider increasing cooling capacity or redistributing server load",
      time: new Date(Date.now() - 25 * 60000).toISOString(),
    },
    {
      id: 3,
      type: "info",
      title: "Energy Optimization",
      message: "System detected potential energy savings by adjusting cooling schedule",
      timestamp: "1 hour ago",
      read: false,
      category: "energy",
      priority: "low",
      suggestion: "Shift pre-cooling to start at 5:30 AM instead of 6:00 AM to optimize energy usage",
      time: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
      id: 4,
      type: "success",
      title: "Maintenance Completed",
      message: "Scheduled maintenance for Cooling System B completed successfully",
      timestamp: "3 hours ago",
      read: true,
      category: "maintenance",
      priority: "low",
      time: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    },
    {
      id: 5,
      type: "alert",
      title: "Humidity Warning",
      message: "Office Area humidity has dropped below optimal range (30%)",
      timestamp: "5 hours ago",
      read: true,
      category: "humidity",
      priority: "medium",
      suggestion: "Consider activating humidifiers in the affected area",
      time: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    },
    {
      id: 6,
      type: "info",
      title: "System Update Available",
      message: "New firmware update available for temperature sensors",
      timestamp: "1 day ago",
      read: true,
      category: "system",
      priority: "low",
      suggestion: "Schedule update during non-peak hours",
      time: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    },
    {
      id: 7,
      type: "critical",
      title: "Gas Sensor Critical Alert",
      message: "Dangerous gas levels detected in Kitchen area. Emergency protocols activated.",
      timestamp: "1 day ago",
      read: false,
      category: "gas",
      priority: "high",
      suggestion: "Evacuate the area immediately and contact emergency services",
      time: new Date(Date.now() - 25 * 60 * 60000).toISOString(),
    },
    {
      id: 8,
      type: "alert",
      title: "Unusual Power Consumption",
      message: "Detected abnormal power consumption in Office Area during non-working hours",
      timestamp: "2 days ago",
      read: true,
      category: "energy",
      priority: "medium",
      suggestion: "Check for equipment left on or possible unauthorized usage",
      time: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    },
    {
      id: 9,
      type: "info",
      title: "Air Quality Notification",
      message: "CO₂ levels in Conference Room are higher than optimal",
      timestamp: "2 days ago",
      read: false,
      category: "air",
      priority: "low",
      suggestion: "Increase ventilation during and after meetings to maintain air quality",
      time: new Date(Date.now() - 2 * 24 * 60 * 60000 - 2 * 60 * 60000).toISOString(),
    },
  ]
  
  // Simulate loading notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotificationsData(initialNotifications);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowActionMenu(null);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter notifications based on selected filter and search query
  const filteredNotifications = notificationsData
    .filter(n => {
      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(query) || 
          n.message.toLowerCase().includes(query) ||
          (n.suggestion && n.suggestion.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter(n => {
      // Category/type filter
      if (filter === "all") return true;
      if (filter === "unread") return !n.read;
      if (filter === "critical") return n.type === "critical";
      if (filter === "high") return n.priority === "high";
      if (filter === "medium") return n.priority === "medium";
      if (filter === "low") return n.priority === "low";
      return n.category === filter;
    })
    .sort((a, b) => {
      // Sort by priority and then by time
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const typeOrder = { critical: 0, alert: 1, info: 2, success: 3 };
      
      // First sort by read status (unread first)
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      
      // Then by priority
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Then by type
      if (a.type !== b.type) {
        return typeOrder[a.type] - typeOrder[b.type];
      }
      
      // Finally by time (most recent first)
      return new Date(b.time) - new Date(a.time);
    });

  // Get icon based on notification type and category
  const getIcon = (type, category) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="notification-type-icon critical" />
      case "alert":
        return <AlertCircle className="notification-type-icon alert" />
      case "success":
        return <CheckCircle className="notification-type-icon success" />
      case "info":
        if (category === "energy") return <Zap className="notification-type-icon info" />
        if (category === "humidity") return <Droplet className="notification-type-icon info" />
        if (category === "temperature") return <Thermometer className="notification-type-icon info" />
        if (category === "air") return <Wind className="notification-type-icon info" />
        return <Bell className="notification-type-icon info" />
      default:
        return <Clock className="notification-type-icon" />
    }
  }
  
  // Get badge class based on priority
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  }
  
  // Handle mark as read
  const handleMarkAsRead = (id) => {
    setNotificationsData(notificationsData.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    
    setShowActionMenu(null);
  }
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setNotificationsData(notificationsData.map(n => ({ ...n, read: true })));
  }
  
  // Handle delete notification
  const handleDeleteNotification = (id) => {
    setNotificationsData(notificationsData.filter(n => n.id !== id));
    setShowActionMenu(null);
  }
  
  // Handle clear all
  const handleClearAll = () => {
    // Only clear read notifications
    setNotificationsData(notificationsData.filter(n => !n.read));
  }
  
  // Get notification count by category
  const getCategoryCount = (category) => {
    return notificationsData.filter(n => n.category === category).length;
  }
  
  // Get unread count
  const getUnreadCount = () => {
    return notificationsData.filter(n => !n.read).length;
  }
  
  // Get priority count
  const getPriorityCount = (priority) => {
    return notificationsData.filter(n => n.priority === priority).length;
  }
  
  // Format relative time
  const formatRelativeTime = (isoTime) => {
    const now = new Date();
    const time = new Date(isoTime);
    const diffMs = now - time;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    const diffMonth = Math.floor(diffDay / 30);
    return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  }
  
  // Toggle action menu
  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === id ? null : id);
  }
  
  // Toggle filter menu
  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  }

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h2 className="page-title">
          <Bell className="header-icon" />
          Notifications
        </h2>
        <div className="notification-stats">
          <div className="unread-badge">
            <span className="unread-count">{getUnreadCount()}</span>
            <span className="unread-text">unread</span>
          </div>
          
          <button className="header-action-btn" onClick={handleMarkAllAsRead} title="Mark all as read">
            <CheckSquare size={18} className="action-icon" />
          </button>
          
          <button className="header-action-btn" onClick={handleClearAll} title="Clear read notifications">
            <Trash2 size={18} className="action-icon" />
          </button>
          
          <button className="header-action-btn" title="Refresh">
            <RefreshCw size={18} className="action-icon" />
          </button>
        </div>
      </div>

      <div className="notification-toolbar">
        <div className="search-box">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              <XCircle size={16} />
            </button>
          )}
        </div>
        
        <div className="filter-container">
          <button className="filter-toggle" onClick={toggleFilterMenu}>
            <Filter size={18} className="" />
            
          </button>
          
          {showFilterMenu && (
            <div className="filter-dropdown">
              <div className="filter-section">
                <div className="filter-section-header">Status</div>
                <div className="filter-options">
                  <button className={`filter-option ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                    All <span className="count">{notificationsData.length}</span>
                  </button>
                  <button className={`filter-option ${filter === "unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>
                    Unread <span className="count">{getUnreadCount()}</span>
                  </button>
                </div>
              </div>
              
              <div className="filter-section">
                <div className="filter-section-header">Priority</div>
                <div className="filter-options">
                  <button className={`filter-option ${filter === "high" ? "active" : ""}`} onClick={() => setFilter("high")}>
                    High <span className="count">{getPriorityCount("high")}</span>
                  </button>
                  <button className={`filter-option ${filter === "medium" ? "active" : ""}`} onClick={() => setFilter("medium")}>
                    Medium <span className="count">{getPriorityCount("medium")}</span>
                  </button>
                  <button className={`filter-option ${filter === "low" ? "active" : ""}`} onClick={() => setFilter("low")}>
                    Low <span className="count">{getPriorityCount("low")}</span>
                  </button>
                </div>
              </div>
              
              <div className="filter-section">
                <div className="filter-section-header">Category</div>
                <div className="filter-options">
                  <button className={`filter-option ${filter === "critical" ? "active" : ""}`} onClick={() => setFilter("critical")}>
                    Critical <span className="count">{notificationsData.filter(n => n.type === "critical").length}</span>
                  </button>
                  <button className={`filter-option ${filter === "temperature" ? "active" : ""}`} onClick={() => setFilter("temperature")}>
                    Temperature <span className="count">{getCategoryCount("temperature")}</span>
                  </button>
                  <button className={`filter-option ${filter === "humidity" ? "active" : ""}`} onClick={() => setFilter("humidity")}>
                    Humidity <span className="count">{getCategoryCount("humidity")}</span>
                  </button>
                  <button className={`filter-option ${filter === "energy" ? "active" : ""}`} onClick={() => setFilter("energy")}>
                    Energy <span className="count">{getCategoryCount("energy")}</span>
                  </button>
                  <button className={`filter-option ${filter === "air" ? "active" : ""}`} onClick={() => setFilter("air")}>
                    Air Quality <span className="count">{getCategoryCount("air")}</span>
                  </button>
                  <button className={`filter-option ${filter === "gas" ? "active" : ""}`} onClick={() => setFilter("gas")}>
                    Gas <span className="count">{getCategoryCount("gas")}</span>
                  </button>
                  <button className={`filter-option ${filter === "system" ? "active" : ""}`} onClick={() => setFilter("system")}>
                    System <span className="count">{getCategoryCount("system")}</span>
                  </button>
                  <button className={`filter-option ${filter === "maintenance" ? "active" : ""}`} onClick={() => setFilter("maintenance")}>
                    Maintenance <span className="count">{getCategoryCount("maintenance")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="active-filters">
        {filter !== "all" && (
          <div className="filter-pill">
            <span className="filter-name">
              {filter === "unread" ? "Unread" : 
               filter === "critical" ? "Critical" :
               filter === "high" ? "High Priority" :
               filter === "medium" ? "Medium Priority" :
               filter === "low" ? "Low Priority" :
               filter.charAt(0).toUpperCase() + filter.slice(1)}
            </span>
            <button className="clear-filter" onClick={() => setFilter("all")}>×</button>
          </div>
        )}
        
        {searchQuery && (
          <div className="filter-pill">
            <span className="filter-name">Search: "{searchQuery}"</span>
            <button className="clear-filter" onClick={() => setSearchQuery("")}>×</button>
          </div>
        )}
      </div>

      <div className="notifications-list">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell className="empty-icon" />
            <p>No notifications to display</p>
            {(filter !== "all" || searchQuery) && (
              <button className="btn btn-sm" onClick={() => {setFilter("all"); setSearchQuery("");}}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Group header for unread notifications */}
            {filteredNotifications.some(n => !n.read) && (
              <div className="notification-group-header">
                <div className="group-title">Unread</div>
                <div className="group-line"></div>
              </div>
            )}
            
            {/* Unread notifications */}
            {filteredNotifications.filter(n => !n.read).map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-card ${!notification.read ? "unread" : ""} ${notification.type}`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="notification-icon">{getIcon(notification.type, notification.category)}</div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">
                      {notification.title}
                      <span className={`priority-badge ${getPriorityBadge(notification.priority)}`}>
                        {notification.priority}
                      </span>
                    </h3>
                    <div className="notification-meta">
                      <span className="notification-time">
                        <Clock size={14} className="time-icon" />
                        {formatRelativeTime(notification.time)}
                      </span>
                      <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="action-menu-trigger" onClick={(e) => toggleActionMenu(notification.id, e)}>
                          <MoreVertical size={16} />
                        </button>
                        
                        {showActionMenu === notification.id && (
                          <div className="action-menu">
                            <button className="action-item" onClick={() => handleMarkAsRead(notification.id)}>
                              <Eye size={14} className="action-icon" />
                              Mark as read
                            </button>
                            <button className="action-item delete" onClick={() => handleDeleteNotification(notification.id)}>
                              <Trash2 size={14} className="action-icon" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-timestamp">
                    <Calendar size={14} className="calendar-icon" />
                    {new Date(notification.time).toLocaleString()}
                  </div>

                  {notification.suggestion && (
                    <div className="suggestion-box">
                      <div className="suggestion-header">
                        <ThumbsUp size={14} className="suggestion-icon" />
                        <span>Suggested Action</span>
                      </div>
                      <p className="suggestion-text">{notification.suggestion}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Group header for read notifications */}
            {filteredNotifications.some(n => n.read) && (
              <div className="notification-group-header">
                <div className="group-title">Earlier</div>
                <div className="group-line"></div>
              </div>
            )}
            
            {/* Read notifications */}
            {filteredNotifications.filter(n => n.read).map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-card ${notification.type}`}
              >
                <div className="notification-icon">{getIcon(notification.type, notification.category)}</div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">
                      {notification.title}
                      <span className={`priority-badge ${getPriorityBadge(notification.priority)}`}>
                        {notification.priority}
                      </span>
                    </h3>
                    <div className="notification-meta">
                      <span className="notification-time">
                        <Clock size={14} className="time-icon" />
                        {formatRelativeTime(notification.time)}
                      </span>
                      <div className="notification-actions">
                        <button className="action-menu-trigger" onClick={(e) => toggleActionMenu(notification.id, e)}>
                          <MoreVertical size={16} />
                        </button>
                        
                        {showActionMenu === notification.id && (
                          <div className="action-menu">
                            <button className="action-item delete" onClick={() => handleDeleteNotification(notification.id)}>
                              <Trash2 size={14} className="action-icon" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-timestamp">
                    <Calendar size={14} className="calendar-icon" />
                    {new Date(notification.time).toLocaleString()}
                  </div>

                  {notification.suggestion && (
                    <div className="suggestion-box">
                      <div className="suggestion-header">
                        <ThumbsUp size={14} className="suggestion-icon" />
                        <span>Suggested Action</span>
                      </div>
                      <p className="suggestion-text">{notification.suggestion}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}