import { motion } from "framer-motion";
import { FiAlertTriangle, FiClock } from "react-icons/fi";

function EmergencyPage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>🚨 Emergency Break-Glass Access</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Limited emergency access to critical patient information
        </p>
      </motion.div>

      <motion.div
        className="card"
        style={{ background: "rgba(255, 243, 224, 0.5)", borderLeft: "4px solid #dc2626" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
          <FiAlertTriangle size={32} color="#dc2626" />
          <div>
            <h2 style={{ color: "#dc2626", margin: 0 }}>EMERGENCY MODE ACTIVE</h2>
            <p style={{ margin: "4px 0 0 0", color: "#9ca3af", fontSize: "12px" }}>
              This access mode has been logged for audit purposes
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid-2">
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="card-title">Patient Lookup</h3>
          <div className="form-group">
            <label>Enter Health ID or Scan QR</label>
            <input type="text" placeholder="Health ID / QR Code" />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }}>
            🔍 Lookup Patient
          </button>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="card-title">Access Timer</h3>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "48px", fontWeight: "bold", color: "#ef4444" }}>
              15:00
            </div>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              <FiClock size={16} style={{ marginRight: "5px" }} />
              Minutes remaining
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="card-title">Available Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginTop: "20px" }}>
          <div className="alert alert-danger">
            <strong>🆘 Blood Group:</strong> <br /> O+
          </div>
          <div className="alert alert-danger">
            <strong>⚠️ Allergies:</strong> <br /> Penicillin, Shellfish
          </div>
          <div className="alert alert-warning">
            <strong>💊 Current Medications:</strong> <br /> Warfarin, Metformin
          </div>
          <div className="alert alert-warning">
            <strong>🏥 Critical Conditions:</strong> <br /> Type 2 Diabetes, AFib
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: "20px" }}>
          ℹ️ <strong>Note:</strong> This limited view shows only critical information necessary for emergency treatment. Full patient records are not accessible in this mode.
        </div>
      </motion.div>
    </>
  );
}

export default EmergencyPage;
