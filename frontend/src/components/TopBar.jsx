import { Bell, Search, Server } from "react-feather"

export function TopBar({ setCurrentPage }) {
  return (
    <div className="top-bar">
      <div className="search-container">
        <div className="search-box">
          <Search className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>

      <div className="top-bar-actions">
        <button className="notification-button" onClick={() => setCurrentPage("notifications")}>
          <Bell className="notification-icon" />
          <span className="notification-badge"></span>
          <span className="notification-count-badge">3</span>
        </button>

        <button className="hardware-button" onClick={() => setCurrentPage("hardware")}>
          <Server className="hardware-icon" />
          <span className="sr-only">Hardware</span>
        </button>

        <div className="profile-display">
          <span className="profile-name">John Doe</span>
          <div className="avatar small">
            <img src="/placeholder.svg" alt="Profile" />
          </div>
        </div>
      </div>
    </div>
  )
}
