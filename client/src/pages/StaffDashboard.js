import React, { useState } from "react";
import axios from "axios";
import "./StaffDashboard.css";

function StaffDashboard() {
  const [staffId, setStaffId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  const handleFetchTasks = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/byUser/${staffId}`
      );
      setTasks(res.data);
      if (res.data.length === 0) {
        setMessage("No tasks found for this Staff ID.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Failed to fetch tasks for this Staff ID."
      );
      setTasks([]);
    }
  };

  return (
    <div className="staff-page">
      <div className="staff-header">
        <h2>Staff Dashboard</h2>
        <p>
          Enter your <strong>Staff ID</strong> to view tasks assigned to you by
          the HOD.
        </p>
      </div>

      {/* Form Card */}
      <div className="staff-card staff-form-card">
        <form className="staff-form" onSubmit={handleFetchTasks}>
          <input
            type="text"
            placeholder="Enter your Staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          />
          <button type="submit">Get My Tasks</button>
        </form>

        {message && <p className="staff-message">{message}</p>}
      </div>

      {/* Tasks Table */}
      {tasks.length > 0 && (
        <div className="staff-card staff-table-card">
          <h3>My Tasks</h3>

          <div className="staff-table-wrap">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={
                          task.status === "Completed"
                            ? "staff-badge staff-badge-completed"
                            : "staff-badge staff-badge-pending"
                        }
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;

