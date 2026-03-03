import { motion } from "framer-motion";
import { FiFilter, FiCalendar } from "react-icons/fi";
import { useState } from "react";
import { getAuditLogs } from "../data/mockData";

function AuditLogsPage() {
  const logs = getAuditLogs();
  const [filterAction, setFilterAction] = useState("all");

  const filteredLogs = logs.filter(
    (log) =>
      filterAction === "all" ||
      log.action.toLowerCase().includes(filterAction.toLowerCase())
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Audit Logs</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Complete record of all system access and modifications
        </p>
      </motion.div>

      {/* FILTER */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <FiFilter />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="all">All Actions</option>
            <option value="accessed">Accessed Patient Record</option>
            <option value="override">Override Prescription</option>
            <option value="modified">Modified Prescription</option>
          </select>
        </div>
      </motion.div>

      {/* LOGS TABLE */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="card-title">Access Log ({filteredLogs.length})</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Action</th>
                <th>Reason</th>
                <th>Timestamp</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{log.doctor}</strong>
                  </td>
                  <td>
                    <span className="token-chip token-chip-neutral">
                      {log.patient}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`audit-action-label ${
                        log.action.includes("Override") || log.action.includes("Modified")
                          ? "audit-action-label-danger"
                          : "audit-action-label-brand"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px" }}>{log.reason}</td>
                  <td style={{ fontSize: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FiCalendar size={14} />
                      {log.timestamp}
                    </div>
                  </td>
                  <td style={{ fontSize: "11px", color: "#6b7280", fontFamily: "monospace" }}>
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* COMPLIANCE INFO */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="card-title">Compliance Information</h3>
        <div className="alert alert-info" style={{ marginTop: "20px" }}>
          <strong>ℹ️ HIPAA Compliance</strong>
          <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
            All access is logged in accordance with HIPAA regulations. Unauthorized access attempts are blocked and reported.
          </p>
        </div>
        <div className="alert alert-success" style={{ marginTop: "10px" }}>
          <strong>✓ Data Integrity</strong>
          <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
            All modifications are tracked with immutable timestamps. Audit logs cannot be modified or deleted.
          </p>
        </div>
      </motion.div>
    </>
  );
}

export default AuditLogsPage;
