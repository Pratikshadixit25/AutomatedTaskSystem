
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Task System</h2>

      <nav className="sidebar-menu">
        <Link to="/hod" className="sidebar-link">HOD Dashboard</Link>
        <Link to="/search" className="sidebar-link">Search & Assign Tasks</Link>
        <Link to="/alltasks" className="sidebar-link">All Tasks</Link>
        <Link to="/student" className="sidebar-link">Student Dashboard</Link>
        <Link to="/staff" className="sidebar-link">Staff Dashboard</Link>
        <Link to="/login" className="sidebar-link logout">Logout</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
