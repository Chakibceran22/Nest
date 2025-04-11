import { useState } from "react"
import { Sidebar } from "./components/SideBar"
import { Dashboard } from "./components/Dashboard"
import { Schedule } from "./components/Scheduel"
import { Sensors } from "./components/Sensor"
import { Controllers } from "./components/Controller"
import { Troubleshoot } from "./components/TroubleShoot"
import { Cooling } from "./components/Cooling"
import { Notifications } from "./components/Notifications"
import { Hardware } from "./components/Hardware"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="main-content">
        <main className="page-content">
          {currentPage === "home" && <Dashboard />}
          {currentPage === "cooling" && <Cooling />}
          {currentPage === "sensors" && <Sensors />}
          {currentPage === "controllers" && <Controllers />}
          {currentPage === "troubleshoot" && <Troubleshoot />}
          {currentPage === "schedule" && <Schedule />}
          {currentPage === "notifications" && <Notifications />}
          {currentPage === "hardware" && <Hardware />}
        </main>
      </div>
    </div>
  )
}

export default App
