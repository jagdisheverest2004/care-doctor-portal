import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { acknowledgeAIAlert, clearAIAlerts, getAIAlerts } from "../services/aiAlerts";

function formatTimestamp(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function AIAlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(() => getAIAlerts());
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSeverity =
        filterSeverity === "all" ||
        String(alert?.severity || "").toLowerCase() === filterSeverity;

      const matchesStatus =
        filterStatus === "all" ||
        String(alert?.status || "OPEN").toLowerCase() === filterStatus;

      return matchesSeverity && matchesStatus;
    });
  }, [alerts, filterSeverity, filterStatus]);

  const insightSummary = useMemo(() => {
    return alerts.reduce(
      (accumulator, alert) => {
        const severity = String(alert?.severity || "LOW").toUpperCase();
        if (severity === "CRITICAL") accumulator.critical += 1;
        if (String(alert?.status || "OPEN").toUpperCase() === "OPEN") accumulator.open += 1;
        accumulator.maxPriority = Math.max(accumulator.maxPriority, Number(alert?.priorityScore || 0));
        return accumulator;
      },
      { critical: 0, open: 0, maxPriority: 0 }
    );
  }, [alerts]);

  const severityColors = {
    CRITICAL: "danger",
    HIGH: "warning",
    MEDIUM: "warning",
    LOW: "info",
  };

  const handleAcknowledge = (alertId) => {
    acknowledgeAIAlert(alertId);
    setAlerts(getAIAlerts());
  };

  const handleClearAlerts = () => {
    clearAIAlerts();
    setAlerts([]);
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
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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

          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            style={{ maxWidth: "180px" }}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="acknowledged">Acknowledged</option>
          </select>

          <button className="btn btn-secondary" onClick={handleClearAlerts}>Clear Alerts</button>
        </div>

        <div className="grid-3" style={{ marginTop: "14px", gap: "10px" }}>
          <div className="token-chip token-chip-neutral">Open Alerts: {insightSummary.open}</div>
          <div className="token-chip token-chip-neutral">Critical Alerts: {insightSummary.critical}</div>
          <div className="token-chip token-chip-neutral">Max Priority Score: {insightSummary.maxPriority}</div>
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
                <th>Confidence</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!filteredAlerts.length ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                    No AI alerts found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <strong>{alert.patientName}</strong>
                    </td>
                    <td>{alert.type}</td>
                    <td>{alert.message}</td>
                    <td>
                      <span className={`badge badge-${severityColors[String(alert.severity).toUpperCase()] || "info"}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td>{alert.confidenceLabel || "--"}</td>
                    <td>{alert.priorityScore ?? "--"}</td>
                    <td>
                      <span className="token-chip token-chip-neutral">{alert.status || "OPEN"}</span>
                    </td>
                    <td style={{ fontSize: "12px" }}>{formatTimestamp(alert.createdAt)}</td>
                    <td>
                      {String(alert.status || "OPEN").toUpperCase() === "ACKNOWLEDGED" ? (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Acknowledged</span>
                      ) : (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleAcknowledge(alert.id)}>
                          Acknowledge
                        </button>
                      )}

                      <div style={{ marginTop: "8px" }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/patient/${alert.patientId}`)}
                          disabled={!alert.patientId || alert.patientId === "--"}
                        >
                          Open Patient
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

export default AIAlertsPage;
