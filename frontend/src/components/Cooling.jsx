export function Cooling() {
    // Sample data for pre-cooling schedule
    const preCoolingData = [
      { id: 1, room: "Server Room A", startTime: "06:00", endTime: "08:00", targetTemp: "22°C", status: "Active" },
      { id: 2, room: "Conference Room", startTime: "07:30", endTime: "09:00", targetTemp: "24°C", status: "Scheduled" },
      { id: 3, room: "Office Area", startTime: "07:00", endTime: "08:30", targetTemp: "23°C", status: "Active" },
      { id: 4, room: "Server Room B", startTime: "05:30", endTime: "07:30", targetTemp: "21°C", status: "Completed" },
      { id: 5, room: "Reception", startTime: "08:00", endTime: "09:30", targetTemp: "24°C", status: "Scheduled" },
    ]
  
    return (
      <div className="cooling-container">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pre-Cooling Schedule</h3>
          </div>
          <div className="card-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Target Temp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {preCoolingData.map((item) => (
                  <tr key={item.id}>
                    <td className="room-name">{item.room}</td>
                    <td>{item.startTime}</td>
                    <td>{item.endTime}</td>
                    <td>{item.targetTemp}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  