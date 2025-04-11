import { useState, useEffect } from "react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Thermometer, Droplet, Wind, MapPin, Calendar, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react"

export  function Dashboard() {
  const [currentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  
  // Sample data for daily energy consumption
  const energyData = [
    { name: "00:00", consumption: 40, production: 24 },
    { name: "04:00", consumption: 30, production: 13 },
    { name: "08:00", consumption: 20, production: 98 },
    { name: "12:00", consumption: 27, production: 39 },
    { name: "16:00", consumption: 18, production: 48 },
    { name: "20:00", consumption: 23, production: 38 },
    { name: "23:59", consumption: 34, production: 43 },
  ]
  
  // Sample data for weekly energy consumption
  const weeklyEnergyData = [
    { day: "Mon", consumption: 210, average: 180 },
    { day: "Tue", consumption: 180, average: 180 },
    { day: "Wed", consumption: 200, average: 180 },
    { day: "Thu", consumption: 190, average: 180 },
    { day: "Fri", consumption: 240, average: 180 },
    { day: "Sat", consumption: 150, average: 180 },
    { day: "Sun", consumption: 160, average: 180 },
  ]
  
  // Sample data for monthly overview
  const monthlyData = {
    totalConsumption: 35.7,
    dailyAverage: 1.2,
    highestDay: 1.8,
    lowestDay: 0.9,
    percentChange: 8
  }
  
  // Sample environmental data with real-time updates
  const [environmentalData, setEnvironmentalData] = useState({
    interiorTemperature: 24,
    exteriorTemperature: 28,
    interiorHumidity: 42,
    exteriorHumidity: 65,
    airQuality: "Good",
    gasSensor: "Normal"
  })
  
  // Simulate real-time updates for environmental data
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironmentalData(prev => ({
        ...prev,
        interiorTemperature: Math.round((prev.interiorTemperature + (Math.random() > 0.5 ? 0.1 : -0.1)) * 10) / 10,
        exteriorTemperature: Math.round((prev.exteriorTemperature + (Math.random() > 0.5 ? 0.2 : -0.2)) * 10) / 10,
        interiorHumidity: Math.min(60, Math.max(35, Math.round(prev.interiorHumidity + (Math.random() > 0.5 ? 0.5 : -0.5)))),
        exteriorHumidity: Math.min(80, Math.max(50, Math.round(prev.exteriorHumidity + (Math.random() > 0.5 ? 0.5 : -0.5))))
      }))
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    
    // First day of the month
    const firstDay = new Date(year, month, 1)
    const firstDayOfWeek = firstDay.getDay()
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    const totalDays = lastDay.getDate()
    
    const days = []
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add calendar days
    for (let day = 1; day <= totalDays; day++) {
      const currentDay = new Date(year, month, day)
      days.push({
        date: currentDay,
        day: day,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        hasData: Math.random() > 0.3 // Simulate days with data
      })
    }
    
    return days
  }
  
  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedDate(newDate)
  }
  
  const selectDay = (day) => {
    if (day) {
      setSelectedDate(day.date)
      setShowCalendar(false)
    }
  }

  return (
    <div className="dashboard-grid">
      <div className="main-content-area">
        <div className="stats-cards">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Energy Consumption</h3>
            </div>
            <div className="card-content">
              <div className="stat-value">2.4 kWh</div>
              <p className="stat-change">+12% from yesterday</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Weekly Average</h3>
            </div>
            <div className="card-content">
              <div className="stat-value">1.8 kWh/day</div>
              <p className="stat-info">This week's average consumption</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Monthly Total</h3>
            </div>
            <div className="card-content">
              <div className="stat-value">{monthlyData.totalConsumption} kWh</div>
              <p className="stat-info">
                {monthlyData.percentChange > 0 ? (
                  <span className="text-red-500"><ArrowUp className="inline h-4 w-4" /> {monthlyData.percentChange}%</span>
                ) : (
                  <span className="text-green-500"><ArrowDown className="inline h-4 w-4" /> {Math.abs(monthlyData.percentChange)}%</span>
                )}
                {' vs last month'}
              </p>
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Energy Consumption Over Time</h3>
          </div>
          <div className="card-content chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="consumption" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="production" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Weekly Consumption</h3>
          </div>
          <div className="card-content chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEnergyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumption" fill="#8884d8" name="Daily Consumption (kWh)" />
                <Bar dataKey="average" fill="#82ca9d" name="Weekly Average (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="sidebar-content-area">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <MapPin className="card-icon" /> Location
            </h3>
          </div>
          <div className="card-content">
            <p className="location-name">Building A, Floor 3</p>
            <p className="location-address">123 Main Street, City</p>
            <div className="date-display">
              <Calendar className="card-icon" />
              <div>
                <p className="current-day">{currentDate.toLocaleDateString("en-US", { weekday: "long" })}</p>
                <p className="current-date">
                  {currentDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            
            {/* Calendar Button */}
            <button 
              className="calendar-button"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              View Energy History
            </button>
            
            {/* Calendar Popup */}
            {showCalendar && (
              <div className="calendar-popup">
                <div className="calendar-header">
                  <button className="nav-button" onClick={() => navigateMonth('prev')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <h4>{selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h4>
                  <button className="nav-button" onClick={() => navigateMonth('next')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
                
                <div className="calendar-weekdays">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>
                
                <div className="calendar-days">
                  {generateCalendarDays().map((day, index) => (
                    <div 
                      key={index} 
                      className={`calendar-day ${!day ? 'empty' : ''} ${day?.isToday ? 'today' : ''} ${day?.hasData ? 'has-data' : ''} ${
                        day && day.date.toDateString() === selectedDate.toDateString() ? 'selected' : ''
                      }`}
                      onClick={() => selectDay(day)}
                    >
                      {day?.day}
                      {day?.hasData && <span className="data-indicator"></span>}
                    </div>
                  ))}
                </div>
                
                <div className="calendar-info">
                  {selectedDate.toDateString() === new Date().toDateString() ? (
                    <span className="selected-date-info">Today's consumption: 2.4 kWh</span>
                  ) : (
                    <span className="selected-date-info">
                      {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} consumption: 
                      {" " + (1 + Math.random() * 2).toFixed(1)} kWh
                    </span>
                  )}
                </div>
                
                {/* View selection */}
                <div className="calendar-footer">
                  <button className="active">Daily</button>
                  <button>Weekly</button>
                  <button>Monthly</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Room Climate</h3>
          </div>
          <div className="card-content">
            <div className="climate-item">
              <div className="climate-label">
                <Thermometer className="climate-icon interior" />
                <span>Interior Temperature</span>
              </div>
              <span className="climate-value">{environmentalData.interiorTemperature}°C</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <Thermometer className="climate-icon exterior" />
                <span>Exterior Temperature</span>
              </div>
              <span className="climate-value">{environmentalData.exteriorTemperature}°C</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <Droplet className="climate-icon interior" />
                <span>Interior Humidity</span>
              </div>
              <span className="climate-value">{environmentalData.interiorHumidity}%</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <Droplet className="climate-icon exterior" />
                <span>Exterior Humidity</span>
              </div>
              <span className="climate-value">{environmentalData.exteriorHumidity}%</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <Wind className="climate-icon" />
                <span>Air Quality</span>
              </div>
              <span className="climate-value">{environmentalData.airQuality}</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <AlertTriangle className="climate-icon" />
                <span>Gas Sensor</span>
              </div>
              <span className="climate-value">{environmentalData.gasSensor}</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Energy Insights</h3>
          </div>
          <div className="card-content">
            <div className="insight-item">
              <div className="insight-label">Highest usage day</div>
              <div className="insight-value">{monthlyData.highestDay} kWh</div>
            </div>
            <div className="insight-item">
              <div className="insight-label">Lowest usage day</div>
              <div className="insight-value">{monthlyData.lowestDay} kWh</div>
            </div>
            <div className="insight-item">
              <div className="insight-label">Daily average</div>
              <div className="insight-value">{monthlyData.dailyAverage} kWh</div>
            </div>
            <div className="insight-item">
              <div className="insight-label">Peak usage time</div>
              <div className="insight-value">12:00 - 14:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}