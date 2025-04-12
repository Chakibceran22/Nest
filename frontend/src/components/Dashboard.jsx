import { useState, useEffect } from "react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Thermometer, Droplet, Wind, MapPin, Calendar, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react"

export function Dashboard() {
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
  
  // Modified weekly energy data with energy source breakdown for Algerie Telecom Mobile (Mobilis) ATM site
  const weeklyEnergyData = [
    { day: "Mon", consumption: 210, grid: 80, solar: 100, grouper: 30, average: 180 },
    { day: "Tue", consumption: 180, grid: 90, solar: 70, grouper: 20, average: 180 },
    { day: "Wed", consumption: 200, grid: 70, solar: 110, grouper: 20, average: 180 },
    { day: "Thu", consumption: 190, grid: 60, solar: 100, grouper: 30, average: 180 },
    { day: "Fri", consumption: 240, grid: 100, solar: 90, grouper: 50, average: 180 },
    { day: "Sat", consumption: 150, grid: 40, solar: 80, grouper: 30, average: 180 },
    { day: "Sun", consumption: 160, grid: 50, solar: 90, grouper: 20, average: 180 },
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
  
  // Calculate energy source percentages for the site
  const energySources = {
    grid: weeklyEnergyData.reduce((sum, day) => sum + day.grid, 0),
    solar: weeklyEnergyData.reduce((sum, day) => sum + day.solar, 0),
    grouper: weeklyEnergyData.reduce((sum, day) => sum + day.grouper, 0),
  }
  
  const totalEnergy = energySources.grid + energySources.solar + energySources.grouper
  
  const energySourcePercentages = {
    grid: Math.round((energySources.grid / totalEnergy) * 100),
    solar: Math.round((energySources.solar / totalEnergy) * 100),
    grouper: Math.round((energySources.grouper / totalEnergy) * 100),
  }
  
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
              <h3 className="card-title">Active Power Source</h3>
            </div>
            <div className="card-content">
              <div className="active-power-source">
                <div className="power-source-indicator solar"></div>
                <div className="power-source-name">Solar</div>
              </div>
              <p className="stat-info">Currently powering the site</p>
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
        
        {/* Power Source Type Dashboard */}
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Power Source Type</h3>
            <div className="site-info">Algerie Telecom Mobile (Mobilis) ATM Site</div>
          </div>
          <div className="power-sources-container">
            <div className="power-source-card grid">
              <div className="power-source-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 16.36v-1.36a6 6 0 1 0-12 0v1.36"></path>
                  <path d="M18 20a2 2 0 0 0 1-3.73V8a7 7 0 0 0-14 0v8.27A2 2 0 0 0 6 20"></path>
                  <path d="M12 12v8"></path>
                </svg>
              </div>
              <div className="power-source-info">
                <h4>Grid Power</h4>
                <div className="power-source-metrics">
                  <div className="metric">
                    <span className="metric-value">{energySourcePercentages.grid}%</span>
                    <span className="metric-label">Current Usage</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">95%</span>
                    <span className="metric-label">Availability</span>
                  </div>
                </div>
                <div className="power-source-status">
                  <div className="status-indicator online"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>

            <div className="power-source-card solar">
              <div className="power-source-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              </div>
              <div className="power-source-info">
                <h4>Solar Power</h4>
                <div className="power-source-metrics">
                  <div className="metric">
                    <span className="metric-value">{energySourcePercentages.solar}%</span>
                    <span className="metric-label">Current Usage</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">68%</span>
                    <span className="metric-label">Efficiency</span>
                  </div>
                </div>
                <div className="power-source-status">
                  <div className="status-indicator online"></div>
                  <span>Active - Generating</span>
                </div>
              </div>
            </div>

            <div className="power-source-card grouper">
              <div className="power-source-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="power-source-info">
                <h4>Grouper Power</h4>
                <div className="power-source-metrics">
                  <div className="metric">
                    <span className="metric-value">{energySourcePercentages.grouper}%</span>
                    <span className="metric-label">Current Usage</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">75%</span>
                    <span className="metric-label">Fuel Level</span>
                  </div>
                </div>
                <div className="power-source-status">
                  <div className="status-indicator standby"></div>
                  <span>Standby Mode</span>
                </div>
              </div>
            </div>
          </div>

          <div className="energy-source-summary">
            <h4>Current Energy Distribution</h4>
            <div className="energy-source-bars">
              <div className="energy-source-item">
                <div className="source-label">Grid</div>
                <div className="source-bar-container">
                  <div className="source-bar grid" style={{ width: `${energySourcePercentages.grid}%` }}></div>
                </div>
                <div className="source-percentage">{energySourcePercentages.grid}%</div>
              </div>
              <div className="energy-source-item">
                <div className="source-label">Solar</div>
                <div className="source-bar-container">
                  <div className="source-bar solar" style={{ width: `${energySourcePercentages.solar}%` }}></div>
                </div>
                <div className="source-percentage">{energySourcePercentages.solar}%</div>
              </div>
              <div className="energy-source-item">
                <div className="source-label">Grouper</div>
                <div className="source-bar-container">
                  <div className="source-bar grouper" style={{ width: `${energySourcePercentages.grouper}%` }}></div>
                </div>
                <div className="source-percentage">{energySourcePercentages.grouper}%</div>
              </div>
            </div>
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
            <p className="location-name">Mobilis ATM Site</p>
            <p className="location-address">Algerie Telecom Mobile</p>
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

      {/* CSS styles for the new energy source elements */}
      <style jsx>{`
        .site-info {
          font-size: 0.85rem;
          color: #6B7280;
          margin-top: 2px;
        }
        
        .energy-source-summary {
          padding: 1rem;
          border-top: 1px solid #E5E7EB;
        }
        
        .energy-source-summary h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        
        .energy-source-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .energy-source-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .source-label {
          width: 55px;
          font-size: 0.85rem;
        }
        
        .source-bar-container {
          flex: 1;
          height: 10px;
          background-color: #E5E7EB;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .source-bar {
          height: 100%;
          border-radius: 5px;
        }
        
        .source-bar.grid {
          background-color: #F87171;
        }
        
        .source-bar.solar {
          background-color: #34D399;
        }
        
        .source-bar.grouper {
          background-color: #60A5FA;
        }
        
        .source-percentage {
          width: 35px;
          font-size: 0.85rem;
          text-align: right;
        }
        
        /* Active Power Source */
        .active-power-source {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
        }
        
        .power-source-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .power-source-indicator.grid {
          background-color: #F87171;
          box-shadow: 0 0 8px rgba(248, 113, 113, 0.6);
        }
        
        .power-source-indicator.solar {
          background-color: #34D399;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
        }
        
        .power-source-indicator.grouper {
          background-color: #60A5FA;
          box-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
        }
        
        .power-source-name {
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        /* Power Source Cards */
        .power-sources-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }
        
        .power-source-card {
          display: flex;
          padding: 1rem;
          border-radius: 0.5rem;
          background-color: #F9FAFB;
          border: 1px solid #E5E7EB;
        }
        
        .power-source-card.grid {
          border-left: 4px solid #F87171;
        }
        
        .power-source-card.solar {
          border-left: 4px solid #34D399;
        }
        
        .power-source-card.grouper {
          border-left: 4px solid #60A5FA;
        }
        
        .power-source-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 0.5rem;
          margin-right: 1rem;
        }
        
        .power-source-card.grid .power-source-icon {
          color: #F87171;
          background-color: #FEF2F2;
        }
        
        .power-source-card.solar .power-source-icon {
          color: #34D399;
          background-color: #ECFDF5;
        }
        
        .power-source-card.grouper .power-source-icon {
          color: #60A5FA;
          background-color: #EFF6FF;
        }
        
        .power-source-info {
          flex: 1;
        }
        
        .power-source-info h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .power-source-metrics {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .metric {
          display: flex;
          flex-direction: column;
        }
        
        .metric-value {
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .metric-label {
          font-size: 0.75rem;
          color: #6B7280;
        }
        
        .power-source-status {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #6B7280;
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 0.5rem;
        }
        
        .status-indicator.online {
          background-color: #34D399;
        }
        
        .status-indicator.standby {
          background-color: #FBBF24;
        }
        
        .status-indicator.offline {
          background-color: #F87171;
        }
      `}</style>
    </div>
  )
}