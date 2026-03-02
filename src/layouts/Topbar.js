import { FiMoon, FiSun, FiBell } from "react-icons/fi";
import { useState } from "react";

function Topbar({ doctorName, onDarkModeToggle, isDarkMode }) {
  const [notificationCount] = useState(3);
  const displayName = doctorName || "Doctor";
  const avatarChar = displayName?.charAt(0)?.toUpperCase() || "D";

  return (
    <div className="topbar">
      <div className="topbar-title">Doctor Portal</div>

      <div className="topbar-right">
        <button className="dark-mode-toggle" onClick={onDarkModeToggle}>
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>

        <div style={{ position: "relative", cursor: "pointer" }}>
          <FiBell size={20} />
          {notificationCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {notificationCount}
            </span>
          )}
        </div>

        <div className="doctor-info">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "1.2",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "14px" }}>
              Dr. {displayName}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Online</span>
          </div>
          <div className="doctor-avatar">{avatarChar}</div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
