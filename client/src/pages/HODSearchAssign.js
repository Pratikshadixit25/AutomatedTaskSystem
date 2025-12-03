import React, { useState } from "react";
import axios from "axios";
import "./HODSearchAssign.css";

function HODSearchAssign() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/search?q=${searchTerm}`
      );
      setUsers(res.data);
      if (res.data.length === 0) {
        setMessage("No users found with this name.");
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
      setMessage(
        error.response?.data?.message || "Error occurred while searching."
      );
    }
  };

  const handleAssignChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setMessage("Please select a user first.");
      return;
    }

    try {
      const payload = {
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        assignedTo:
          selectedUser.role === "Student"
            ? selectedUser.rollNo
            : selectedUser.staffId,
        role: selectedUser.role,
      };

      const res = await axios.post(
        "http://localhost:5000/api/tasks/add",
        payload
      );

      setMessage(res.data.message || "Task assigned successfully!");
      setTaskData({ title: "", description: "", deadline: "" });
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to assign task. Try again."
      );
    }
  };

  return (
    <div className="hod-page">
      <div className="hod-header">
        <div>
          <h2>Search & Assign Tasks</h2>
          <p className="hod-header-sub">
            Search students or staff, view their profile cards and assign tasks
            in one place.
          </p>
        </div>
      </div>

      {message && <p className="hod-message">{message}</p>}

      <div className="hod-layout">
        {/* LEFT SIDE - SEARCH + RESULTS */}
        <div className="hod-left">
          {/* Search box */}
          <form className="hod-search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter name to search (Student / Staff)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
            <button type="submit">Search</button>
          </form>

          {/* Result cards */}
          <div className="hod-user-list">
            {users.length > 0 && (
              <>
                <h3 className="hod-section-title">Search Results</h3>
                <div className="hod-user-grid">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className={
                        selectedUser && selectedUser._id === user._id
                          ? "hod-user-card selected"
                          : "hod-user-card"
                      }
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="hod-user-role">
                        {user.role === "Student" ? " Student" : " Staff"}
                      </div>
                      <h4 className="hod-user-name">{user.name}</h4>
                      <p className="hod-user-email">{user.email}</p>
                      <div className="hod-user-meta">
                        {user.role === "Student" && user.rollNo && (
                          <span>Roll: {user.rollNo}</span>
                        )}
                        {user.role === "Staff" && user.staffId && (
                          <span>Staff ID: {user.staffId}</span>
                        )}
                      </div>
                      <p className="hod-user-hint">
                        Click to assign task to this user
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - ASSIGN FORM */}
        <div className="hod-right">
          <div className="hod-assign-card">
            <h3>Task Assignment</h3>

            {!selectedUser && (
              <p className="hod-assign-hint">
                Select a user card from left to start assigning a task.
              </p>
            )}

            {selectedUser && (
              <div className="hod-selected-info">
                <p>
                  Assigning to: <strong>{selectedUser.name}</strong>{" "}
                  <span className="hod-tag">{selectedUser.role}</span>
                </p>
                <p className="hod-selected-email">{selectedUser.email}</p>
              </div>
            )}

            <form className="hod-assign-form" onSubmit={handleAssignTask}>
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={taskData.title}
                onChange={handleAssignChange}
                required
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={taskData.description}
                onChange={handleAssignChange}
                required
              />
              <label className="hod-date-label">
                Deadline:
                <input
                  type="date"
                  name="deadline"
                  value={taskData.deadline}
                  onChange={handleAssignChange}
                  required
                />
              </label>

              <button type="submit" disabled={!selectedUser}>
                Assign Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HODSearchAssign;

