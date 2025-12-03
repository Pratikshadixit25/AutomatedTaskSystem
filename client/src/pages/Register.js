import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    rollNo: "",
    staffId: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "Student") {
        payload.rollNo = formData.rollNo;
      } else if (formData.role === "Staff") {
        payload.staffId = formData.staffId;
      }

      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        payload
      );

      setMessage(res.data.message || "User registered successfully!");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "Student",
        rollNo: "",
        staffId: "",
      });
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Registration failed, please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        <h2>Register User</h2>

        {message && <p className="auth-message">{message}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="auth-row">
            <label className="auth-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="auth-select"
            >
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="HOD">HOD</option>
            </select>
          </div>

          {formData.role === "Student" && (
            <input
              type="text"
              name="rollNo"
              placeholder="Roll No"
              value={formData.rollNo}
              onChange={handleChange}
              required
            />
          )}

          {formData.role === "Staff" && (
            <input
              type="text"
              name="staffId"
              placeholder="Staff ID"
              value={formData.staffId}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
