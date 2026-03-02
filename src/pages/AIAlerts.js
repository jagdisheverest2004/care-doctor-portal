import React, { useState } from "react";
import { motion } from "framer-motion";
import { getAlerts } from "../data/mockData";

function AIAlertsPage() {
  const alerts = getAlerts();
  const [filterSeverity, setFilterSeverity] = useState("all");

  const filteredAlerts = alerts.filter(
    (alert) =>
      filterSeverity === "all" ||
      alert.severity.toLowerCase() === filterSeverity.toLowerCase()
  );

  const severityColors = {
    Critical: "danger",
    High: "warning",
    Medium: "warning",
    Low: "info",
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>AI Safety Alerts</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Real-time AI-generated clinical alerts
        </p>
      </motion.div>

      {/* FILTER */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {["all", "critical", "high", "medium", "low"].map((severity) => (
            <button
              key={severity}
              className={`btn ${
                filterSeverity === severity ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setFilterSeverity(severity)}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ALERTS LIST */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="card-title">Alerts ({filteredAlerts.length})</h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Alert Type</th>
                <th>Message</th>
                <th>Severity</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <strong>{alert.patientName}</strong>
                    <br />
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {alert.patientId}
                    </span>
                  </td>
                  <td>{alert.type}</td>
                  <td>{alert.message}</td>
                  <td>
                    <span className={`badge badge-${severityColors[alert.severity]}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px" }}>{alert.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

export default AIAlertsPage;
