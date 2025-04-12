import { useState, useEffect } from "react"
import { 
  Bell, AlertCircle, CheckCircle, Clock, ThumbsUp, Zap, Droplet, 
  Thermometer, Filter, Search, MoreVertical, Eye, Trash2, CheckSquare, 
  Calendar, RefreshCw, XCircle, Wind, Flame
} from "lucide-react"

// This component uses local mock data and doesn't depend on Firebase or external APIs
export function Notifications() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showActionMenu, setShowActionMenu] = useState(null)
  const [notificationsData, setNotificationsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [lampState, setLampState] = useState(false)
  
  // Mock data for notifications including fire alarms
  const mockFireAlarms = [
    {
      id: "fire1",
      isActive: true,
      source: "FLAME DETECTED by ESP32 sensor!",
      temperature: 32.5, // Outside temperature range
      humidity: 40.2,
      gasValue: 850,
      location: "Main Building - Floor 1",
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      detectedAt: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: "fire2",
      isActive: false,
      source: "Fire alarm has been resolved",
      temperature: 25.8, // Within temperature range
      humidity: 65.1, // Outside humidity range
      gasValue: 120,
      location: "Main Building - Floor 1",
      timestamp: new Date(Date.now() - 60 * 60000), // 1 hour ago
      detectedAt: new Date(Date.now() - 60 * 60000).toISOString()
    },
    {
      id: "fire3",
      isActive: false,
      source: "System status update",
      temperature: 15.2, // Outside temperature range (too cold)
      humidity: 25.5, // Outside humidity range (too dry)
      gasValue: 100,
      location: "Server Room",
      timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
      detectedAt: new Date(Date.now() - 120 * 60000).toISOString()
    }
  ];
  
  const mockGeneralNotifications = [
    {
      id: "notif1",
      title: "High Temperature Warning",
      message: "Temperature in Server Room has exceeded 30°C",
      category: "temperature",
      priority: "medium",
      timestamp: new Date(Date.now() - 25 * 60000), // 25 minutes ago
      read: false,
      suggestion: "Check air conditioning system and server load"
    },
    {
      id: "notif2",
      title: "System Update Available",
      message: "New firmware update for temperature sensors is available",
      category: "system",
      priority: "low",
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      read: true
    }
  ];
  
  // Function to control the lamp via API
  const controlLamp = async (state) => {
    try {
      console.log(`Turning lamp ${state ? 'ON' : 'OFF'} due to temperature conditions...`);
      
      const response = await fetch('http://localhost:3000/api/lamp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state })
      });
      
      if (response.ok) {
        console.log(`Lamp turned ${state ? 'ON' : 'OFF'} successfully`);
        setLampState(state);
      } else {
        console.error('Failed to control lamp:', await response.text());
      }
    } catch (error) {
      console.error('Error controlling lamp:', error);
    }
  };

  // Function to generate temperature and humidity notifications based on sensor data
  const generateEnvironmentNotifications = (fireAlarms) => {
    const environmentNotifications = [];
    let hasHighTemperature = false;
    
    fireAlarms.forEach((alarm, index) => {
      // Temperature check
      if (alarm.temperature !== undefined) {
        if (alarm.temperature > 26) {
          // High temperature detected - turn on the lamp
          hasHighTemperature = true;
          
          // High temperature notification
          environmentNotifications.push({
            id: `temp-high-${index}`,
            title: "High Temperature Alert",
            message: `Temperature at ${alarm.location} is ${alarm.temperature.toFixed(1)}°C, which exceeds the safe range (17-26°C)`,
            category: "temperature",
            priority: alarm.temperature > 30 ? "high" : "medium",
            timestamp: new Date(Date.now() - (2 * 60000) - (index * 1000)), // Slightly different timestamps
            read: false,
            suggestion: "Check cooling systems and ensure proper ventilation",
            location: alarm.location,
            temperature: alarm.temperature,
            humidity: alarm.humidity
          });
        } else if (alarm.temperature < 17) {
          // Low temperature notification
          environmentNotifications.push({
            id: `temp-low-${index}`,
            title: "Low Temperature Alert",
            message: `Temperature at ${alarm.location} is ${alarm.temperature.toFixed(1)}°C, which is below the safe range (17-26°C)`,
            category: "temperature",
            priority: alarm.temperature < 10 ? "high" : "medium",
            timestamp: new Date(Date.now() - (3 * 60000) - (index * 1000)),
            read: false,
            suggestion: "Check heating systems and ensure they are functioning properly",
            location: alarm.location,
            temperature: alarm.temperature,
            humidity: alarm.humidity
          });
        }
      }
      
      // Humidity check
      if (alarm.humidity !== undefined) {
        if (alarm.humidity > 60) {
          // High humidity notification
          environmentNotifications.push({
            id: `humid-high-${index}`,
            title: "High Humidity Alert",
            message: `Humidity at ${alarm.location} is ${alarm.humidity.toFixed(1)}%, which exceeds the safe range (30-60%)`,
            category: "humidity",
            priority: alarm.humidity > 70 ? "high" : "medium",
            timestamp: new Date(Date.now() - (4 * 60000) - (index * 1000)),
            read: false,
            suggestion: "Check dehumidifiers and ensure proper air circulation",
            location: alarm.location,
            temperature: alarm.temperature,
            humidity: alarm.humidity
          });
        } else if (alarm.humidity < 30) {
          // Low humidity notification
          environmentNotifications.push({
            id: `humid-low-${index}`,
            title: "Low Humidity Alert",
            message: `Humidity at ${alarm.location} is ${alarm.humidity.toFixed(1)}%, which is below the safe range (30-60%)`,
            category: "humidity",
            priority: alarm.humidity < 20 ? "high" : "medium",
            timestamp: new Date(Date.now() - (5 * 60000) - (index * 1000)),
            read: false,
            suggestion: "Check humidifiers and ensure they are functioning properly",
            location: alarm.location,
            temperature: alarm.temperature,
            humidity: alarm.humidity
          });
        }
      }
    });
    
    // If high temperature is detected, turn on the lamp
    if (hasHighTemperature && !lampState) {
      // Schedule this after state update to avoid rendering issues
      setTimeout(() => {
        controlLamp(true);
      }, 100);
    } else if (!hasHighTemperature && lampState) {
      // If no high temperature detected but lamp is on, turn it off
      setTimeout(() => {
        controlLamp(false);
      }, 100);
    }
    
    return environmentNotifications;
  };
  
  // Load mock data
  useEffect(() => {
    const loadMockData = async () => {
      setIsLoading(true);
      
      // Add a small delay to simulate loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate environment notifications based on sensor data
      const environmentNotifications = generateEnvironmentNotifications(mockFireAlarms);
      
      // Transform mock data to component format
      const fireAlarmNotifications = mockFireAlarms.map(data => transformFireAlarm(data.id, data));
      const generalNotifications = [...mockGeneralNotifications, ...environmentNotifications]
        .map(data => transformNotification(data.id, data));
      
      // Combine notifications
      setNotificationsData([...fireAlarmNotifications, ...generalNotifications]);
      setIsLoading(false);
    };
    
    loadMockData();
  }, []);
  
  // Transform notification to component format
  const transformNotification = (id, data) => {
    return {
      id: id,
      type: mapNotificationType(data.category),
      title: data.title,
      message: data.message,
      timestamp: formatRelativeTime(data.timestamp),
      read: data.read !== undefined ? data.read : false,
      category: data.category || "system",
      priority: data.priority || "low",
      suggestion: data.suggestion,
      time: data.timestamp instanceof Date ? data.timestamp.toISOString() : data.timestamp,
      temperature: data.temperature,
      humidity: data.humidity,
      gasValue: data.gasValue,
      location: data.location
    };
  };
  
  // Transform fire alarm to component format
  const transformFireAlarm = (id, data) => {
    // Initialize variables for timestamp handling
    let timestamp;
    let timeString;
    
    // Safely handle the timestamp
    if (data.timestamp instanceof Date) {
      timestamp = data.timestamp;
      timeString = timestamp.toISOString();
    } else if (typeof data.timestamp === 'string') {
      timestamp = new Date(data.timestamp);
      timeString = data.timestamp;
    } else if (data.detectedAt) {
      timestamp = new Date(data.detectedAt);
      timeString = data.detectedAt;
    } else {
      timestamp = new Date();
      timeString = timestamp.toISOString();
    }
    
    // Check if the fire alarm is active
    const isActive = data.isActive === undefined ? true : Boolean(data.isActive);
    
    return {
      id: id,
      type: "critical",
      title: isActive ? "🔥 FIRE ALARM ACTIVATED!" : "Fire Alarm Cleared",
      message: data.source || (isActive ? "Fire detected. Immediate evacuation required." : "Fire alarm has been reset."),
      timestamp: formatRelativeTime(timestamp),
      read: false, // Fire alarms are always unread by default
      category: "fire",
      priority: "high",
      suggestion: isActive ? "Evacuate the building immediately and follow emergency procedures." : "Normal operations can resume.",
      time: timeString,
      temperature: data.temperature,
      humidity: data.humidity,
      gasValue: data.gasValue,
      isActive: isActive,
      location: data.location || "Main building"
    };
  };
  
  // Map notification type based on category
  const mapNotificationType = (category) => {
    if (!category) return "info";
    
    switch (category.toLowerCase()) {
      case "fire":
        return "critical";
      case "temperature":
        return "alert";
      case "humidity":
        return "info";
      case "gas":
        return "alert";
      case "system":
        return "info";
      default:
        return "info";
    }
  };
  
  // Refresh notifications
  const refreshNotifications = () => {
    setIsLoading(true);
    
    // Just reload the same mock data with a slight delay
    setTimeout(() => {
      // Generate environment notifications based on sensor data
      const environmentNotifications = generateEnvironmentNotifications(mockFireAlarms);
      
      // Transform mock data to component format
      const fireAlarmNotifications = mockFireAlarms.map(data => transformFireAlarm(data.id, data));
      const generalNotifications = [...mockGeneralNotifications, ...environmentNotifications]
        .map(data => transformNotification(data.id, data));
      
      // Combine notifications
      setNotificationsData([...fireAlarmNotifications, ...generalNotifications]);
      setIsLoading(false);
    }, 800);
  };
  
  // Add control buttons for lamp
  const toggleLamp = () => {
    controlLamp(!lampState);
  };
  
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
      if (filter === "fire") return n.category === "fire";
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
    if (category === "fire") {
      return <Flame className="notification-type-icon critical" />;
    }
    
    switch (type) {
      case "critical":
        return <AlertCircle className="notification-type-icon critical" />;
      case "alert":
        return <AlertCircle className="notification-type-icon alert" />;
      case "success":
        return <CheckCircle className="notification-type-icon success" />;
      case "info":
        if (category === "energy") return <Zap className="notification-type-icon info" />;
        if (category === "humidity") return <Droplet className="notification-type-icon info" />;
        if (category === "temperature") return <Thermometer className="notification-type-icon info" />;
        if (category === "air") return <Wind className="notification-type-icon info" />;
        return <Bell className="notification-type-icon info" />;
      default:
        return <Clock className="notification-type-icon" />;
    }
  };
  
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
  };
  
  // Handle mark as read (local state only)
  const handleMarkAsRead = (id) => {
    setNotificationsData(notificationsData.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    
    setShowActionMenu(null);
  };
  
  // Handle mark all as read (local state only)
  const handleMarkAllAsRead = () => {
    setNotificationsData(notificationsData.map(n => ({ ...n, read: true })));
  };
  
  // Handle delete notification (local state only)
  const handleDeleteNotification = (id) => {
    setNotificationsData(notificationsData.filter(n => n.id !== id));
    setShowActionMenu(null);
  };
  
  // Handle clear all read notifications (local state only)
  const handleClearAll = () => {
    setNotificationsData(notificationsData.filter(n => !n.read));
  };
  
  // Get notification count by category
  const getCategoryCount = (category) => {
    return notificationsData.filter(n => n.category === category).length;
  };
  
  // Get unread count
  const getUnreadCount = () => {
    return notificationsData.filter(n => !n.read).length;
  };
  
  // Get priority count
  const getPriorityCount = (priority) => {
    return notificationsData.filter(n => n.priority === priority).length;
  };
  
  // Format relative time
  const formatRelativeTime = (dateInput) => {
    try {
      const now = new Date();
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      
      if (isNaN(date.getTime())) {
        return "Unknown time";
      }
      
      const diffMs = now - date;
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
    } catch (error) {
      console.error("Error formatting relative time:", error);
      return "Unknown time";
    }
  };
  
  // Toggle action menu
  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === id ? null : id);
  };
  
  // Toggle filter menu
  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

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
          
          <button className="header-action-btn" onClick={refreshNotifications} title="Refresh">
            <RefreshCw size={18} className="action-icon" />
          </button>
        </div>
      </div>
      
      {/* Lamp status indicator */}
      <div className="lamp-status">
        <div className={`lamp-indicator ${lampState ? 'lamp-on' : 'lamp-off'}`}>
          <Zap size={18} />
          <span>Lamp: {lampState ? 'ON' : 'OFF'}</span>
        </div>
        <button 
          className={`lamp-toggle ${lampState ? 'lamp-on-btn' : 'lamp-off-btn'}`}
          onClick={toggleLamp}
        >
          {lampState ? 'Turn Off' : 'Turn On'}
        </button>
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
                  <button className={`filter-option ${filter === "fire" ? "active" : ""}`} onClick={() => setFilter("fire")}>
                    Fire <span className="count">{getCategoryCount("fire")}</span>
                  </button>
                  <button className={`filter-option ${filter === "temperature" ? "active" : ""}`} onClick={() => setFilter("temperature")}>
                    Temperature <span className="count">{getCategoryCount("temperature")}</span>
                  </button>
                  <button className={`filter-option ${filter === "humidity" ? "active" : ""}`} onClick={() => setFilter("humidity")}>
                    Humidity <span className="count">{getCategoryCount("humidity")}</span>
                  </button>
                  <button className={`filter-option ${filter === "gas" ? "active" : ""}`} onClick={() => setFilter("gas")}>
                    Gas <span className="count">{getCategoryCount("gas")}</span>
                  </button>
                  <button className={`filter-option ${filter === "system" ? "active" : ""}`} onClick={() => setFilter("system")}>
                    System <span className="count">{getCategoryCount("system")}</span>
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
                        {notification.timestamp}
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
                  
                  {notification.location && (
                    <div className="notification-location">
                      <span>Location: {notification.location}</span>
                    </div>
                  )}
                  
                  {(notification.temperature || notification.humidity) && (
                    <div className="sensor-readings">
                      {notification.temperature && (
                        <span className="temperature-reading">
                          <Thermometer size={14} className="reading-icon" />
                          {notification.temperature.toFixed(1)}°C
                        </span>
                      )}
                      {notification.humidity && (
                        <span className="humidity-reading">
                          <Droplet size={14} className="reading-icon" />
                          {notification.humidity.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  )}
                  
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
                        {notification.timestamp}
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
                  
                  {notification.location && (
                    <div className="notification-location">
                      <span>Location: {notification.location}</span>
                    </div>
                  )}
                  
                  {(notification.temperature || notification.humidity) && (
                    <div className="sensor-readings">
                      {notification.temperature && (
                        <span className="temperature-reading">
                          <Thermometer size={14} className="reading-icon" />
                          {notification.temperature.toFixed(1)}°C
                        </span>
                      )}
                      {notification.humidity && (
                        <span className="humidity-reading">
                          <Droplet size={14} className="reading-icon" />
                          {notification.humidity.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  )}
                  
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
      
      {/* Add some basic CSS for the lamp indicator */}
      <style jsx>{`
        .lamp-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding: 8px 12px;
          background-color: #f5f5f5;
          border-radius: 6px;
        }
        
        .lamp-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }
        
        .lamp-on {
          color: #e67e22;
        }
        
        .lamp-off {
          color: #7f8c8d;
        }
        
        .lamp-toggle {
          padding: 6px 12px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        
        .lamp-on-btn {
          background-color: #e74c3c;
          color: white;
        }
        
        .lamp-off-btn {
          background-color: #2ecc71;
          color: white;
        }
        
        .sensor-readings {
          display: flex;
          gap: 12px;
          margin: 8px 0;
        }
        
        .temperature-reading, .humidity-reading {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background-color: #f8f9fa;
          border-radius: 4px;
          font-size: 0.9em;
        }
        
        .temperature-reading {
          color: #e74c3c;
        }
        
        .humidity-reading {
          color: #3498db;
        }
      `}</style>
    </div>
  )
}