import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Thermometer, Droplet, Wind, MapPin, Calendar, AlertTriangle } from "react-feather"

export function Dashboard() {
  const [currentDate] = useState(new Date())

  // Sample data for charts
  const energyData = [
    { name: "00:00", consumption: 40, production: 24 },
    { name: "04:00", consumption: 30, production: 13 },
    { name: "08:00", consumption: 20, production: 98 },
    { name: "12:00", consumption: 27, production: 39 },
    { name: "16:00", consumption: 18, production: 48 },
    { name: "20:00", consumption: 23, production: 38 },
    { name: "23:59", consumption: 34, production: 43 },
  ]

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
              <h3 className="card-title">Humidity</h3>
            </div>
            <div className="card-content">
              <div className="stat-value">42%</div>
              <p className="stat-info">Optimal range: 40-60%</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Temperature</h3>
            </div>
            <div className="card-content">
              <div className="stat-value">24°C</div>
              <p className="stat-info">Outside: 28°C</p>
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
              <span className="climate-value">24°C</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <Thermometer className="climate-icon exterior" />
                <span>Exterior Temperature</span>
              </div>
              <span className="climate-value">28°C</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <Droplet className="climate-icon interior" />
                <span>Interior Humidity</span>
              </div>
              <span className="climate-value">42%</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <Droplet className="climate-icon exterior" />
                <span>Exterior Humidity</span>
              </div>
              <span className="climate-value">65%</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <Wind className="climate-icon" />
                <span>Air Quality</span>
              </div>
              <span className="climate-value">Good</span>
            </div>

            <div className="climate-item">
              <div className="climate-label">
                <AlertTriangle className="climate-icon" />
                <span>Gas Sensor</span>
              </div>
              <span className="climate-value">Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
