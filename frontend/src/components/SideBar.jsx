import { User } from "lucide-react"
import { Home, Calendar, Thermometer, Camera, Sliders, AlertTriangle, Sun, Moon, Bell, Server } from "react-feather"

export function Sidebar({ currentPage, setCurrentPage, darkMode, toggleDarkMode }) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "sensors", label: "Sensors", icon: Camera },
    { id: "hardware", label: "Hardware", icon: Server },
    { id: "controllers", label: "Controllers", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "troubleshoot", label: "Troubleshoot", icon: AlertTriangle },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Mobilis ATM</h1>
      </div>

      <div className="profile-section">
        <div className="avatar">
          <User  />
        </div>
        <div className="profile-info">
          <p className="profile-name">Admin Mobilis</p>
          <p className="profile-role">Administrator</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
          >
            <item.icon className="nav-icon" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={toggleDarkMode} className="nav-item">
          {darkMode ? <Sun className="nav-icon" /> : <Moon className="nav-icon" />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  )
}
