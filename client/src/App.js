import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import HODDashboard from "./pages/HODDashboard";
import HODSearchAssign from "./pages/HODSearchAssign";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllTasks from "./AllTasks";


function getCurrentUser() {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}


function RequireAuth({ allowedRoles, children }) {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "HOD") return <Navigate to="/hod" replace />;
    if (user.role === "Student") return <Navigate to="/student" replace />;
    if (user.role === "Staff") return <Navigate to="/staff" replace />;
  }

  return children;
}


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ? "nav-link active-link" : "nav-link";

  return (
    <nav
      style={{
        background: "#f8fafc",
        padding: "10px 30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      
      <span style={{ fontWeight: "700", fontSize: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#111827" }}>
          Automated Task System
        </Link>
      </span>

    
      <div className="center-links">
        {user?.role === "HOD" && (
          <>
            <Link className={isActive("/search")} to="/search">
              Search &amp; Assign
            </Link>

            <Link className={isActive("/alltasks")} to="/alltasks">
              All Tasks
            </Link>
          </>
        )}

        {user?.role === "Student" && (
          <Link className={isActive("/student")} to="/student">
            Student Dashboard
          </Link>
        )}

        {user?.role === "Staff" && (
          <Link className={isActive("/staff")} to="/staff">
            Staff Dashboard
          </Link>
        )}
      </div>

      
      <div style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
        {!user && (
          <>
            <Link className="nav-link" to="/login">
              Login
            </Link>

            <Link className="nav-link" to="/register">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span style={{ fontSize: "13px", color: "#4b5563" }}>
              Logged in as <strong>{user.role}</strong>
            </span>

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                background: "#ef4444",
                color: "white",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}


function Home() {
  const user = getCurrentUser();

  if (user?.role === "HOD") return <Navigate to="/hod" replace />;
  if (user?.role === "Student") return <Navigate to="/student" replace />;
  if (user?.role === "Staff") return <Navigate to="/staff" replace />;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Welcome to Automated Task System</h2>
      <p>Please login to access your dashboard.</p>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

       
        <Route
          path="/hod"
          element={
            <RequireAuth allowedRoles={["HOD"]}>
              <HODDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/search"
          element={
            <RequireAuth allowedRoles={["HOD"]}>
              <HODSearchAssign />
            </RequireAuth>
          }
        />
        <Route
          path="/alltasks"
          element={
            <RequireAuth allowedRoles={["HOD"]}>
              <AllTasks />
            </RequireAuth>
          }
        />

      
        <Route
          path="/student"
          element={
            <RequireAuth allowedRoles={["Student"]}>
              <StudentDashboard />
            </RequireAuth>
          }
        />

      
        <Route
          path="/staff"
          element={
            <RequireAuth allowedRoles={["Staff"]}>
              <StaffDashboard />
            </RequireAuth>
          }
        />

   
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

