import React from "react";
import { Link } from "react-router-dom";
import "./HODDashboard.css";

function HODDashboard() {
  return (
    <div className="hod-dashboard-container">
      <div className="hod-card">
        <h1 className="hod-title">HOD Dashboard</h1>
        <p className="hod-subtitle">
          Manage student & staff tasks from dashboard.
        </p>

        <div className="hod-actions">
          <Link to="/search" className="hod-btn hod-btn-primary">
            Search & Assign Tasks
          </Link>

          <Link to="/alltasks" className="hod-btn hod-btn-secondary">
            View All Tasks
          </Link>
        </div>
      </div>
    </div>
    
  );
}

export default HODDashboard;



