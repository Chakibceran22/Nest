import { useState } from "react"
import { Plus, AlertTriangle } from "react-feather"

export function Troubleshoot() {
  const [showForm, setShowForm] = useState(false)

  // Sample data for existing problems
  const problems = [
    {
      id: 1,
      title: "Temperature Sensor Malfunction",
      type: "Hardware",
      status: "Open",
      date: "2023-06-15",
      description: "Temperature sensor in Server Room A is showing inconsistent readings.",
    },
    {
      id: 2,
      title: "Cooling System Not Responding",
      type: "System",
      status: "In Progress",
      date: "2023-06-14",
      description: "The cooling system in the office area is not responding to commands.",
    },
    {
      id: 3,
      title: "Camera Feed Interrupted",
      type: "Hardware",
      status: "Resolved",
      date: "2023-06-10",
      description: "Camera feed from the parking area is intermittently going offline.",
    },
  ]

  return (
    <div className="troubleshoot-container">
      <div className="page-header">
        <h2 className="page-title">Troubleshoot</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus className="btn-icon" />
          Report Problem
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <div className="card-header">
            <h3 className="card-title">Report a New Problem</h3>
          </div>
          <div className="card-content">
            <form className="problem-form">
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="Enter problem title" className="form-input" />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select className="form-select">
                  <option value="">Select problem type</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="system">System</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe the problem in detail" rows="4" className="form-textarea"></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="problems-list">
        {problems.map((problem) => (
          <div key={problem.id} className="card problem-card">
            <div className="card-header">
              <div className="problem-header">
                <h3 className="problem-title">
                  <AlertTriangle
                    className={`problem-icon ${
                      problem.status === "Open"
                        ? "status-open"
                        : problem.status === "In Progress"
                          ? "status-progress"
                          : "status-resolved"
                    }`}
                  />
                  {problem.title}
                </h3>
                <div className="problem-meta">
                  <span
                    className={`status-badge ${
                      problem.status === "Open" ? "open" : problem.status === "In Progress" ? "in-progress" : "resolved"
                    }`}
                  >
                    {problem.status}
                  </span>
                  <span className="problem-date">{problem.date}</span>
                </div>
              </div>
            </div>
            <div className="card-content">
              <div className="problem-details">
                <div className="problem-type">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{problem.type}</span>
                </div>
                <p className="problem-description">{problem.description}</p>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-secondary btn-sm">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
