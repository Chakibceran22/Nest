import { useState } from "react"

export function Schedule() {
  const [activeTab, setActiveTab] = useState("energy")

  // Sample data for schedule
  const scheduleData = [
    {
      day: "Monday",
      periods: [
        { time: "00:00 - 06:00", type: "Grid", note: "Low demand" },
        { time: "06:00 - 18:00", type: "Solar", note: "Peak production" },
        { time: "18:00 - 00:00", type: "Grid", note: "Evening usage" },
      ],
    },
    {
      day: "Tuesday",
      periods: [
        { time: "00:00 - 06:00", type: "Grid", note: "Low demand" },
        { time: "06:00 - 18:00", type: "Solar", note: "Peak production" },
        { time: "18:00  - 00:00", type: "Grid", note: "Evening usage" },
      ],
    },
    {
      day: "Wednesday",
      periods: [
        { time: "00:00 - 06:00", type: "Grid", note: "Low demand" },
        { time: "06:00 - 18:00", type: "Solar", note: "Peak production" },
        { time: "18:00 - 00:00", type: "Grid", note: "Evening usage" },
      ],
    },
    {
      day: "Thursday",
      periods: [
        { time: "00:00 - 06:00", type: "Grid", note: "Low demand" },
        { time: "06:00 - 18:00", type: "Solar", note: "Peak production" },
        { time: "18:00 - 00:00", type: "Grid", note: "Evening usage" },
      ],
    },
    {
      day: "Friday",
      periods: [
        { time: "00:00 - 06:00", type: "Grid", note: "Low demand" },
        { time: "06:00 - 18:00", type: "Solar", note: "Peak production" },
        { time: "18:00 - 00:00", type: "Grid", note: "Evening usage" },
      ],
    },
    {
      day: "Saturday",
      periods: [
        { time: "00:00 - 08:00", type: "Grid", note: "Low demand" },
        { time: "08:00 - 16:00", type: "Solar", note: "Weekend usage" },
        { time: "16:00 - 00:00", type: "Grid", note: "Evening usage" },
      ],
    },
    {
      day: "Sunday",
      periods: [
        { time: "00:00 - 08:00", type: "Grid", note: "Low demand" },
        { time: "08:00 - 16:00", type: "Solar", note: "Weekend usage" },
        { time: "16:00 - 00:00", type: "Grid", note: "Evening usage" },
      ],
    },
  ]

  return (
    <div className="schedule-container">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "energy" ? "active" : ""}`}
          onClick={() => setActiveTab("energy")}
        >
          Energy Type
        </button>
        <button
          className={`tab-button ${activeTab === "cooling" ? "active" : ""}`}
          onClick={() => setActiveTab("cooling")}
        >
          Pre-Cooling
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "energy" && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">7-Day Energy Schedule</h3>
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
                  {scheduleData.map((day) => (
                    <tr key={day.day}>
                      <td className="day-name">{day.day}</td>
                      <td>
                        <div className="time-periods">
                          {day.periods.map((period, index) => (
                            <div key={index} className="time-period">
                              <span className={`period-type ${period.type.toLowerCase()}`}>{period.type}</span>
                              <span className="period-time">{period.time}</span>
                              <span className="period-note">({period.note})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "cooling" && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Pre-Cooling Schedule</h3>
            </div>
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Days</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Target Temp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="room-name">Server Room A</td>
                    <td>Mon-Fri</td>
                    <td>06:00</td>
                    <td>08:00</td>
                    <td>22°C</td>
                  </tr>
                  <tr>
                    <td className="room-name">Conference Room</td>
                    <td>Mon-Fri</td>
                    <td>07:30</td>
                    <td>09:00</td>
                    <td>24°C</td>
                  </tr>
                  <tr>
                    <td className="room-name">Office Area</td>
                    <td>Mon-Fri</td>
                    <td>07:00</td>
                    <td>08:30</td>
                    <td>23°C</td>
                  </tr>
                  <tr>
                    <td className="room-name">Reception</td>
                    <td>Mon-Fri</td>
                    <td>08:00</td>
                    <td>09:30</td>
                    <td>24°C</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
