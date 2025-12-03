import React, { useState } from "react";
import axios from "axios";
import "./StudentDashboard.css"; // ✅ CSS same folder me honi chahiye

function StudentDashboard() {
  const [rollNo, setRollNo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  const handleFetchTasks = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/byUser/${rollNo}`
      );
      setTasks(res.data);
      if (res.data.length === 0) {
        setMessage("No tasks found for this Roll No.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Failed to fetch tasks for this Roll No."
      );
      setTasks([]);
    }
  };

  const handleMarkCompleted = async (taskId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/update/${taskId}`,
        { status: "Completed" }
      );
      setMessage(res.data.message || "Task marked as Completed.");

      // frontend status update
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: "Completed" } : t
        )
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Failed to update task status. Try again."
      );
    }
  };

  return (
    <div className="stu-page">
      <div className="stu-header">
        <h2>Student Dashboard</h2>
        <p>
          View and update tasks assigned to you using your <strong>Roll No.</strong>
        </p>
      </div>

      {/* Form Card */}
      <div className="stu-card stu-form-card">
        <form className="stu-form" onSubmit={handleFetchTasks}>
          <input
            type="text"
            placeholder="Enter your Roll No"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
          />
          <button type="submit">Get My Tasks</button>
        </form>

        {message && <p className="stu-message">{message}</p>}
      </div>

      {/* Tasks Table */}
      {tasks.length > 0 && (
        <div className="stu-card stu-table-card">
          <h3>My Tasks</h3>

          <div className="stu-table-wrap">
            <table className="stu-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Action</th>
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
                            ? "stu-badge stu-badge-completed"
                            : "stu-badge stu-badge-pending"
                        }
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>
                      {task.status !== "Completed" ? (
                        <button
                          className="stu-complete-btn"
                          onClick={() => handleMarkCompleted(task._id)}
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="stu-done-text">Done ✔</span>
                      )}
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

export default StudentDashboard;

