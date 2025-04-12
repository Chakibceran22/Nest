"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Thermometer, Zap, Sun, Moon, Edit, Trash, Plus, ChevronDown, ChevronUp } from "lucide-react"

export function Schedule() {
  const [activeTab, setActiveTab] = useState("power")
  const [editMode, setEditMode] = useState(false)
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [expandedDay, setExpandedDay] = useState(null)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Sample data for power schedule
  const [powerScheduleData, setPowerScheduleData] = useState([
    {
      day: "Monday",
      periods: [
        { time: "00:00 - 06:00", type: "Backup", note: "Low traffic", efficiency: "Standard" },
        { time: "06:00 - 18:00", type: "Main", note: "Peak operation", efficiency: "High" },
        { time: "18:00 - 00:00", type: "Backup", note: "Evening usage", efficiency: "Standard" },
      ],
    },
    {
      day: "Tuesday",
      periods: [
        { time: "00:00 - 06:00", type: "Backup", note: "Low traffic", efficiency: "Standard" },
        { time: "06:00 - 18:00", type: "Main", note: "Peak operation", efficiency: "High" },
        { time: "18:00 - 00:00", type: "Backup", note: "Evening usage", efficiency: "Standard" },
      ],
    },
    {
      day: "Wednesday",
      periods: [
        { time: "00:00 - 06:00", type: "Backup", note: "Low traffic", efficiency: "Standard" },
        { time: "06:00 - 18:00", type: "Main", note: "Peak operation", efficiency: "High" },
        { time: "18:00 - 00:00", type: "Backup", note: "Evening usage", efficiency: "Standard" },
      ],
    },
    {
      day: "Thursday",
      periods: [
        { time: "00:00 - 06:00", type: "Backup", note: "Low traffic", efficiency: "Standard" },
        { time: "06:00 - 18:00", type: "Main", note: "Peak operation", efficiency: "High" },
        { time: "18:00 - 00:00", type: "Backup", note: "Evening usage", efficiency: "Standard" },
      ],
    },
    {
      day: "Friday",
      periods: [
        { time: "00:00 - 06:00", type: "Backup", note: "Low traffic", efficiency: "Standard" },
        { time: "06:00 - 18:00", type: "Main", note: "Peak operation", efficiency: "High" },
        { time: "18:00 - 00:00", type: "Backup", note: "Evening usage", efficiency: "Standard" },
      ],
    },
    {
      day: "Saturday",
      periods: [
        { time: "00:00 - 08:00", type: "Backup", note: "Low traffic", efficiency: "Standard" },
        { time: "08:00 - 16:00", type: "Main", note: "Weekend usage", efficiency: "Medium" },
        { time: "16:00 - 00:00", type: "Backup", note: "Evening usage", efficiency: "Standard" },
      ],
    },
    {
      day: "Sunday",
      periods: [
        { time: "00:00 - 08:00", type: "Backup", note: "Low traffic", efficiency: "Standard" },
        { time: "08:00 - 16:00", type: "Main", note: "Weekend usage", efficiency: "Medium" },
        { time: "16:00 - 00:00", type: "Backup", note: "Evening usage", efficiency: "Standard" },
      ],
    },
  ])

  // Sample data for cooling schedule
  const [coolingScheduleData, setCoolingScheduleData] = useState([
    {
      id: 1,
      room: "Hardware Room A",
      days: "Mon-Fri",
      startTime: "06:00",
      endTime: "08:00",
      targetTemp: "22°C",
      status: "Active",
    },
    {
      id: 2,
      room: "Network Center",
      days: "Mon-Fri",
      startTime: "07:30",
      endTime: "09:00",
      targetTemp: "24°C",
      status: "Active",
    },
    {
      id: 3,
      room: "Equipment Area",
      days: "Mon-Fri",
      startTime: "07:00",
      endTime: "08:30",
      targetTemp: "23°C",
      status: "Active",
    },
    {
      id: 4,
      room: "Monitoring Station",
      days: "Mon-Fri",
      startTime: "08:00",
      endTime: "09:30",
      targetTemp: "24°C",
      status: "Inactive",
    },
    {
      id: 5,
      room: "Hardware Room B",
      days: "Daily",
      startTime: "05:30",
      endTime: "07:00",
      targetTemp: "21°C",
      status: "Active",
    },
  ])

  // New schedule properties
  const [newCoolingSchedule, setNewCoolingSchedule] = useState({
    room: "",
    days: "Mon-Fri",
    startTime: "07:00",
    endTime: "09:00",
    targetTemp: "23",
    status: "Active",
  })

  // Current edit item (for cooling schedule)
  const [currentEditItem, setCurrentEditItem] = useState(null)

  // Power usage statistics
  const powerStats = {
    mainUsage: "65%",
    backupUsage: "35%",
    peakHours: "10:00 - 14:00",
    estimatedSavings: "12,500 DZD/month",
  }

  // Cooling efficiency statistics
  const coolingStats = {
    energySaved: "18%",
    optimalStartTimes: "Yes",
    targetAchievement: "92%",
    estimatedSavings: "8,750 DZD/month",
  }

  const handleAddCoolingSchedule = () => {
    if (newCoolingSchedule.room) {
      const newId = Math.max(...coolingScheduleData.map((item) => item.id)) + 1
      setCoolingScheduleData([
        ...coolingScheduleData,
        {
          id: newId,
          ...newCoolingSchedule,
          targetTemp: `${newCoolingSchedule.targetTemp}°C`,
        },
      ])

      // Reset form and hide
      setNewCoolingSchedule({
        room: "",
        days: "Mon-Fri",
        startTime: "07:00",
        endTime: "09:00",
        targetTemp: "23",
        status: "Active",
      })
      setShowAddSchedule(false)
    }
  }

  const handleUpdateCoolingSchedule = () => {
    if (currentEditItem && newCoolingSchedule.room) {
      setCoolingScheduleData(
        coolingScheduleData.map((item) =>
          item.id === currentEditItem.id
            ? {
                ...item,
                room: newCoolingSchedule.room,
                days: newCoolingSchedule.days,
                startTime: newCoolingSchedule.startTime,
                endTime: newCoolingSchedule.endTime,
                targetTemp: `${newCoolingSchedule.targetTemp}°C`,
                status: newCoolingSchedule.status,
              }
            : item,
        ),
      )

      // Reset edit state
      setCurrentEditItem(null)
      setNewCoolingSchedule({
        room: "",
        days: "Mon-Fri",
        startTime: "07:00",
        endTime: "09:00",
        targetTemp: "23",
        status: "Active",
      })
      setShowAddSchedule(false)
    }
  }

  const handleEditCoolingSchedule = (schedule) => {
    // Set current edit item
    setCurrentEditItem(schedule)

    // Populate form with current values
    setNewCoolingSchedule({
      room: schedule.room,
      days: schedule.days,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      targetTemp: schedule.targetTemp.replace("°C", ""),
      status: schedule.status,
    })

    // Show form
    setShowAddSchedule(true)
  }

  const handleDeleteCoolingSchedule = (id) => {
    setCoolingScheduleData(coolingScheduleData.filter((item) => item.id !== id))
  }

  const handleToggleCoolingSchedule = (id) => {
    setCoolingScheduleData(
      coolingScheduleData.map((item) =>
        item.id === id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item,
      ),
    )
  }

  const handleCancelEdit = () => {
    setCurrentEditItem(null)
    setNewCoolingSchedule({
      room: "",
      days: "Mon-Fri",
      startTime: "07:00",
      endTime: "09:00",
      targetTemp: "23",
      status: "Active",
    })
    setShowAddSchedule(false)
  }

  // Get current day name
  const getCurrentDayName = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[currentTime.getDay()]
  }

  // Check if a time period is currently active
  const isActivePeriod = (period) => {
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    const [startTime, endTime] = period.time.split(" - ")

    const startHour = Number.parseInt(startTime.split(":")[0])
    const startMinute = Number.parseInt(startTime.split(":")[1])

    const endHour = Number.parseInt(endTime.split(":")[0])
    const endMinute = Number.parseInt(endTime.split(":")[1])

    // Convert to minutes for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    const startTimeInMinutes = startHour * 60 + startMinute
    const endTimeInMinutes = endHour * 60 + endMinute

    // Handle cases where the period crosses midnight
    if (startTimeInMinutes <= endTimeInMinutes) {
      return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes
    } else {
      return currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes < endTimeInMinutes
    }
  }

  // Toggle expanded day view
  const toggleDayExpand = (day) => {
    if (expandedDay === day) {
      setExpandedDay(null)
    } else {
      setExpandedDay(day)
    }
  }

  // Render the daily timeline view for each day
  const renderDayTimeline = (day, periods) => {
    return (
      <div className="day-timeline">
        <div className="timeline-hours">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className="hour-mark">
              <span className="hour-label">{i.toString().padStart(2, "0")}:00</span>
            </div>
          ))}
        </div>

        <div className="timeline-periods">
          {periods.map((period, index) => {
            const [startStr, endStr] = period.time.split(" - ")
            const startHour = Number.parseInt(startStr.split(":")[0])
            const endHour = Number.parseInt(endStr.split(":")[0]) || 24

            // Calculate position and width
            const startPercent = (startHour / 24) * 100
            const periodWidth = ((endHour - startHour) / 24) * 100

            return (
              <div
                key={index}
                className={`day-period ${period.type.toLowerCase()} ${isActivePeriod(period) && day === getCurrentDayName() ? "active-now" : ""}`}
                style={{
                  left: `${startPercent}%`,
                  width: `${periodWidth}%`,
                }}
                title={`${period.time} - ${period.type} (${period.note})`}
              >
                <div className="period-label">
                  <span className="period-type-label">{period.type}</span>
                  <span className="period-time-label">{period.time}</span>
                </div>
              </div>
            )
          })}

          {/* Current time indicator - only show for current day */}
          {day === getCurrentDayName() && (
            <div
              className="day-time-indicator"
              style={{
                left: `${((currentTime.getHours() + currentTime.getMinutes() / 60) / 24) * 100}%`,
              }}
            >
              <div className="time-marker"></div>
              <span className="time-now">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Visual schedule view that shows time blocks graphically for today
  const renderTimelineView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const currentDay = new Date().getDay()
    const dayIndex = currentDay === 0 ? 6 : currentDay - 1
    const today = powerScheduleData[dayIndex]

    return (
      <div className="timeline-view">
        <h4 className="timeline-title">
          Today's Power Schedule
          <span className="current-time-display">
            <Clock size={14} />
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </h4>

        <div className="timeline-container">
          <div className="timeline-hours">
            {hours.map((hour) => (
              <div key={hour} className="hour-marker">
                <span className="hour-label">{hour.toString().padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          <div className="timeline-periods">
            {today.periods.map((period, index) => {
              const [startStr, endStr] = period.time.split(" - ")
              const startHour = Number.parseInt(startStr.split(":")[0])
              const endHour = Number.parseInt(endStr.split(":")[0])
              const duration = endHour > startHour ? endHour - startHour : 24 - startHour + endHour
              const startPos = (startHour / 24) * 100
              const width = (duration / 24) * 100

              return (
                <div
                  key={index}
                  className={`timeline-period ${period.type.toLowerCase()} ${isActivePeriod(period) ? "active-now" : ""}`}
                  style={{
                    left: `${startPos}%`,
                    width: `${width}%`,
                  }}
                >
                  <div className="period-info">
                    <span className="period-type">{period.type}</span>
                    <span className="period-time">{period.time}</span>
                  </div>
                </div>
              )
            })}

            {/* Current time indicator */}
            <div
              className="current-time-indicator"
              style={{
                left: `${((currentTime.getHours() + currentTime.getMinutes() / 60) / 24) * 100}%`,
              }}
            >
              <div className="time-marker"></div>
              <span className="time-label">Now</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>
          <Calendar className="header-icon" />
          ATM Mobilis Schedule Management
        </h2>
        <div className="header-actions">
          <div className="current-date">
            <Clock size={16} className="date-icon" />
            <span>
              {currentTime.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <button
            className={`btn btn-sm ${editMode ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setEditMode(!editMode)}
          >
            <Edit size={16} /> {editMode ? "Done Editing" : "Edit Schedules"}
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-button ${activeTab === "power" ? "active" : ""}`} onClick={() => setActiveTab("power")}>
          <Zap size={16} className="tab-icon" />
          Power Schedule
        </button>
        <button
          className={`tab-button ${activeTab === "cooling" ? "active" : ""}`}
          onClick={() => setActiveTab("cooling")}
        >
          <Thermometer size={16} className="tab-icon" />
          Cooling Schedule
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "power" && (
          <div className="schedule-section">
            {/* Timeline view for today */}
            {renderTimelineView()}

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Calendar className="card-icon" />
                  7-Day Power Schedule
                </h3>
                <div className="efficiency-indicator">
                  <Sun className="efficiency-icon" />
                  <span>Main Power Usage: {powerStats.mainUsage}</span>
                </div>
              </div>
              <div className="card-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Time Periods</th>
                    </tr>
                  </thead>
                  <tbody>
                    {powerScheduleData.map((day) => {
                      const isCurrentDay = day.day === getCurrentDayName()
                      const isExpanded = expandedDay === day.day

                      return (
                        <tr key={day.day} className={isCurrentDay ? "current-day-row" : ""}>
                          <td className="day-name">
                            <div className="day-header">
                              <span className={isCurrentDay ? "current-day" : ""}>{day.day}</span>
                              <button
                                className="expand-btn"
                                onClick={() => toggleDayExpand(day.day)}
                                title={isExpanded ? "Collapse" : "Expand"}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </td>
                          <td>
                            {isExpanded ? (
                              <div className="expanded-view">
                                {renderDayTimeline(day.day, day.periods)}
                                <div className="time-periods">
                                  {day.periods.map((period, index) => (
                                    <div
                                      key={index}
                                      className={`time-period ${isActivePeriod(period) && isCurrentDay ? "active-period" : ""}`}
                                    >
                                      <span className={`period-type ${period.type.toLowerCase()}`}>
                                        {period.type === "Main" ? <Sun size={14} /> : <Zap size={14} />}
                                        {period.type}
                                      </span>
                                      <span className="period-time">
                                        <Clock size={14} className="period-icon" />
                                        {period.time}
                                      </span>
                                      <span className="period-note">({period.note})</span>
                                      <span className={`efficiency-badge ${period.efficiency.toLowerCase()}`}>
                                        {period.efficiency} Efficiency
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="time-periods">
                                {day.periods.map((period, index) => (
                                  <div
                                    key={index}
                                    className={`time-period ${isActivePeriod(period) && isCurrentDay ? "active-period" : ""}`}
                                  >
                                    <span className={`period-type ${period.type.toLowerCase()}`}>
                                      {period.type === "Main" ? <Sun size={14} /> : <Zap size={14} />}
                                      {period.type}
                                    </span>
                                    <span className="period-time">
                                      <Clock size={14} className="period-icon" />
                                      {period.time}
                                    </span>
                                    <span className="period-note">({period.note})</span>
                                    <span className={`efficiency-badge ${period.efficiency.toLowerCase()}`}>
                                      {period.efficiency} Efficiency
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {/* Power Stats Card */}
                <div className="stats-panel">
                  <div className="stat-item">
                    <div className="stat-label">Main Usage</div>
                    <div className="stat-value">{powerStats.mainUsage}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Backup Usage</div>
                    <div className="stat-value">{powerStats.backupUsage}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Peak Hours</div>
                    <div className="stat-value">{powerStats.peakHours}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Est. Savings</div>
                    <div className="stat-value savings">{powerStats.estimatedSavings}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cooling" && (
          <div className="schedule-section">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Thermometer className="card-icon" />
                  Equipment Cooling Schedule
                </h3>
                {!showAddSchedule && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setCurrentEditItem(null)
                      setShowAddSchedule(true)
                    }}
                  >
                    <Plus size={14} /> Add Schedule
                  </button>
                )}
              </div>
              <div className="card-content">
                {showAddSchedule && (
                  <div className="add-schedule-form">
                    <h4>{currentEditItem ? "Edit Schedule" : "Add New Schedule"}</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Room</label>
                        <input
                          type="text"
                          value={newCoolingSchedule.room}
                          onChange={(e) => setNewCoolingSchedule({ ...newCoolingSchedule, room: e.target.value })}
                          placeholder="Enter room name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Days</label>
                        <select
                          value={newCoolingSchedule.days}
                          onChange={(e) => setNewCoolingSchedule({ ...newCoolingSchedule, days: e.target.value })}
                        >
                          <option value="Daily">Daily</option>
                          <option value="Mon-Fri">Mon-Fri</option>
                          <option value="Sat-Sun">Sat-Sun</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Time</label>
                        <input
                          type="time"
                          value={newCoolingSchedule.startTime}
                          onChange={(e) => setNewCoolingSchedule({ ...newCoolingSchedule, startTime: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Time</label>
                        <input
                          type="time"
                          value={newCoolingSchedule.endTime}
                          onChange={(e) => setNewCoolingSchedule({ ...newCoolingSchedule, endTime: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Target Temp (°C)</label>
                        <input
                          type="number"
                          min="18"
                          max="28"
                          value={newCoolingSchedule.targetTemp}
                          onChange={(e) => setNewCoolingSchedule({ ...newCoolingSchedule, targetTemp: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          value={newCoolingSchedule.status}
                          onChange={(e) => setNewCoolingSchedule({ ...newCoolingSchedule, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn btn-secondary" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={currentEditItem ? handleUpdateCoolingSchedule : handleAddCoolingSchedule}
                      >
                        {currentEditItem ? "Update Schedule" : "Add Schedule"}
                      </button>
                    </div>
                  </div>
                )}

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Days</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Target Temp</th>
                      <th>Status</th>
                      {editMode && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {coolingScheduleData.map((schedule) => (
                      <tr key={schedule.id} className={schedule.status === "Inactive" ? "inactive-row" : ""}>
                        <td className="room-name">{schedule.room}</td>
                        <td>{schedule.days}</td>
                        <td>
                          <Clock size={14} className="time-icon" />
                          {schedule.startTime}
                        </td>
                        <td>
                          <Clock size={14} className="time-icon" />
                          {schedule.endTime}
                        </td>
                        <td>
                          <Thermometer size={14} className="temp-icon" />
                          {schedule.targetTemp}
                        </td>
                        <td>
                          <span className={`status-badge ${schedule.status.toLowerCase()}`}>{schedule.status}</span>
                        </td>
                        {editMode && (
                          <td className="action-buttons">
                            <button
                              className="action-btn toggle-btn"
                              onClick={() => handleToggleCoolingSchedule(schedule.id)}
                              title={schedule.status === "Active" ? "Deactivate" : "Activate"}
                            >
                              {schedule.status === "Active" ? <Moon size={16} /> : <Sun size={16} />}
                            </button>
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEditCoolingSchedule(schedule)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteCoolingSchedule(schedule.id)}
                              title="Delete"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Cooling Stats Card */}
                <div className="stats-panel">
                  <div className="stat-item">
                    <div className="stat-label">Energy Saved</div>
                    <div className="stat-value">{coolingStats.energySaved}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Optimal Start Times</div>
                    <div className="stat-value">{coolingStats.optimalStartTimes}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Target Achievement</div>
                    <div className="stat-value">{coolingStats.targetAchievement}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Est. Savings</div>
                    <div className="stat-value savings">{coolingStats.estimatedSavings}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
