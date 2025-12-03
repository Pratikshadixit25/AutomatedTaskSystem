import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllTasks.css";

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/all");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showNotification("Failed to fetch tasks", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${id}`);
      showNotification("Task deleted successfully", "success");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.response || error);
      showNotification(
        error.response?.data?.message || "Error deleting task",
        "error"
      );
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  return (
    <div className="alltasks-container">
      <h2 className="alltasks-title">All Assigned Tasks</h2>
      <p className="alltasks-sub">
        HOD can view all tasks assigned to students & staff. Status is updated
        by students/staff, HOD can only delete tasks if required.
      </p>

      {notification.message && (
        <div
          className={`alert ${
            notification.type === "success" ? "alert-success" : "alert-danger"
          } text-center fw-semibold`}
        >
          {notification.message}
        </div>
      )}

      <div className="table-wrap">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Roll / Staff ID</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
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
                          ? "badge-completed"
                          : "badge-pending"
                      }
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{task.assignedTo?.name || "-"}</td>
                  <td>
                    {task.assignedTo?.rollNo ||
                      task.assignedTo?.staffId ||
                      "-"}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No tasks assigned yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllTasks;
