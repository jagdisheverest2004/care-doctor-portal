import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiFilter,
  FiAlertCircle,
  FiTrendingUp,
  FiClipboard,
  FiAlertTriangle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

function Sidebar({ onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>🏥 Care++</h2>
      </div>

      <div className="sidebar-menu">
        <Link
          to="/dashboard"
          className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}
        >
          <FiHome /> Dashboard
        </Link>
        <Link
          to="/patients"
          className={`menu-item ${isActive("/patients") ? "active" : ""}`}
        >
          <FiUsers /> Patients
        </Link>
        <Link
          to="/appointments"
          className={`menu-item ${isActive("/appointments") ? "active" : ""}`}
        >
          <FiCalendar /> Appointments
        </Link>
        <Link
          to="/prescription"
          className={`menu-item ${isActive("/prescription") ? "active" : ""}`}
        >
          <FiFilter /> Prescription Builder
        </Link>
        <Link
          to="/alerts"
          className={`menu-item ${isActive("/alerts") ? "active" : ""}`}
        >
          <FiAlertCircle /> AI Alerts
        </Link>
        <Link
          to="/analytics"
          className={`menu-item ${isActive("/analytics") ? "active" : ""}`}
        >
          <FiTrendingUp /> Analytics
        </Link>
        <Link
          to="/audit"
          className={`menu-item ${isActive("/audit") ? "active" : ""}`}
        >
          <FiClipboard /> Audit Logs
        </Link>
        <Link
          to="/emergency"
          className={`menu-item ${isActive("/emergency") ? "active" : ""}`}
        >
          <FiAlertTriangle /> Emergency
        </Link>
        <Link
          to="/settings"
          className={`menu-item ${isActive("/settings") ? "active" : ""}`}
        >
          <FiSettings /> Settings
        </Link>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
