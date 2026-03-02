import { motion } from "framer-motion";
import { FiToggleRight, FiToggleLeft, FiLock, FiBell, FiUser } from "react-icons/fi";
import { useState } from "react";

function SettingsPage() {
  const [settings, setSettings] = useState({
    twoFA: true,
    emailNotifications: true,
    smsAlerts: false,
    darkMode: false,
    dataSharing: true,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Settings</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Manage your account and preferences
        </p>
      </motion.div>

      {/* PROFILE SECTION */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <FiUser size={32} />
          <div>
            <h3 className="card-title" style={{ margin: 0 }}>
              Dr. Kailash Kumar
            </h3>
            <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>
              Medical License: MED-2024-001 | Verified ✓
            </p>
          </div>
        </div>
      </motion.div>

      {/* SECURITY SETTINGS */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="card-title">
          <FiLock style={{ marginRight: "10px" }} />
          Security
        </h3>

        <div style={{ marginTop: "20px" }}>
          {/* CHANGE PASSWORD */}
          <div style={{ marginBottom: "30px" }}>
            <h4 style={{ marginBottom: "15px" }}>Change Password</h4>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
            <button className="btn btn-primary" onClick={handlePasswordChange}>
              Update Password
            </button>
          </div>

          {/* 2FA TOGGLE */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 0",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: "0 0 4px 0" }}>
                Two-Factor Authentication
              </p>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                Add an extra layer of security
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => handleToggle("twoFA")}
            >
              {settings.twoFA ? <FiToggleRight size={24} color="#16a34a" /> : <FiToggleLeft size={24} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* NOTIFICATION SETTINGS */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="card-title">
          <FiBell style={{ marginRight: "10px" }} />
          Notifications
        </h3>

        <div style={{ marginTop: "20px" }}>
          {/* EMAIL NOTIFICATIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: "0 0 4px 0" }}>
                Email Notifications
              </p>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                Receive alerts via email
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => handleToggle("emailNotifications")}
            >
              {settings.emailNotifications ? <FiToggleRight size={24} color="#16a34a" /> : <FiToggleLeft size={24} />}
            </button>
          </div>

          {/* SMS ALERTS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 0",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: "0 0 4px 0" }}>SMS Alerts</p>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                Receive critical alerts via SMS
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => handleToggle("smsAlerts")}
            >
              {settings.smsAlerts ? <FiToggleRight size={24} color="#16a34a" /> : <FiToggleLeft size={24} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* PRIVACY SETTINGS */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="card-title">Privacy & Data</h3>

        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 0",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: "0 0 4px 0" }}>
                Anonymous Data Sharing
              </p>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                Help improve AI models with anonymized data
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => handleToggle("dataSharing")}
            >
              {settings.dataSharing ? <FiToggleRight size={24} color="#16a34a" /> : <FiToggleLeft size={24} />}
            </button>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: "20px" }}>
          <strong>ℹ️ Privacy Policy</strong>
          <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
            Your data is always encrypted and protected according to HIPAA standards. <a href="#" style={{ color: "#2563eb" }}>Learn more</a>
          </p>
        </div>
      </motion.div>

      {/* DANGER ZONE */}
      <motion.div
        className="card"
        style={{ borderLeft: "4px solid #ef4444" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="card-title" style={{ color: "#ef4444" }}>
          Danger Zone
        </h3>

        <div style={{ marginTop: "20px" }}>
          <button className="btn btn-danger" style={{ width: "100%" }}>
            🚪 Logout from All Devices
          </button>
          <button
            className="btn btn-danger"
            style={{ width: "100%", marginTop: "10px" }}
          >
            🗑️ Delete Account
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default SettingsPage;
