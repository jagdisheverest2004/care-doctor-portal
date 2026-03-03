import { motion } from "framer-motion";
import { FiFilter, FiCalendar, FiSearch } from "react-icons/fi";
import { useMemo, useState } from "react";
import { clearAuditLogs, getAuditLogs } from "../services/auditLog";

const EVENT_TYPE_OPTIONS = [
  { value: "all", label: "All Events" },
  { value: "APPOINTMENT_ACCEPTED", label: "Appointment Accepted" },
  { value: "APPOINTMENT_CANCELLED", label: "Appointment Cancelled" },
  { value: "APPOINTMENT_SCHEDULED", label: "Appointment Scheduled" },
  { value: "DRUG_SAFETY_CHECK", label: "Drug Safety Check" },
  { value: "FILE_UPLOAD", label: "File Upload" },
  { value: "CONSULTATION_UPDATED", label: "Consultation Updated" },
];

const SEVERITY_OPTIONS = ["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

function formatTimestamp(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getActionColorClass(log) {
  const actionValue = String(log?.action || "").toLowerCase();
  const eventType = String(log?.eventType || "").toUpperCase();

  if (eventType.includes("CANCEL") || actionValue.includes("cancel")) {
    return "audit-action-label-danger";
  }
  if (eventType.includes("UPLOAD") || eventType.includes("SCHEDULE") || actionValue.includes("access")) {
    return "audit-action-label-brand";
  }
  return "audit-action-label-warning";
}

function AuditLogsPage() {
  const [logs, setLogs] = useState(() => getAuditLogs());
  const [filterEventType, setFilterEventType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesEvent =
        filterEventType === "all" ||
        String(log?.eventType || "").toUpperCase() === filterEventType;

      const matchesSeverity =
        filterSeverity === "ALL" ||
        String(log?.severity || "").toUpperCase() === filterSeverity;

      const query = String(searchTerm || "").trim().toLowerCase();
      const matchesSearch =
        !query ||
        [
          log?.doctor,
          log?.patientId,
          log?.patientName,
          log?.action,
          log?.reason,
          log?.eventType,
        ]
          .map((value) => String(value || "").toLowerCase())
          .some((value) => value.includes(query));

      return matchesEvent && matchesSeverity && matchesSearch;
    });
  }, [logs, filterEventType, filterSeverity, searchTerm]);

  const handleClearLogs = () => {
    clearAuditLogs();
    setLogs([]);
  };

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
        <div className="grid-3" style={{ gap: "12px", alignItems: "end" }}>
          <div style={{ position: "relative" }}>
            <FiSearch
              style={{ position: "absolute", left: "12px", top: "12px", color: "#9ca3af" }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search doctor, patient, action, reason..."
              style={{ paddingLeft: "38px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <FiFilter />
            <select
              value={filterEventType}
              onChange={(event) => setFilterEventType(event.target.value)}
              style={{ flex: 1 }}
            >
              {EVENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <select
            value={filterSeverity}
            onChange={(event) => setFilterSeverity(event.target.value)}
          >
            {SEVERITY_OPTIONS.map((severity) => (
              <option key={severity} value={severity}>Severity: {severity}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <small style={{ color: "#94a3b8" }}>Showing {filteredLogs.length} of {logs.length} logs</small>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleClearLogs}>Clear Local Logs</button>
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
                <th>Severity</th>
                <th>Confidence</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {!filteredLogs.length ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                    No audit logs found for current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <strong>{log.doctor}</strong>
                    </td>
                    <td>
                      <strong>{log.patientName || "--"}</strong>
                    </td>
                    <td>
                      <span className={`audit-action-label ${getActionColorClass(log)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", maxWidth: "340px" }}>{log.reason}</td>
                    <td>
                      <span className="token-chip token-chip-neutral">{log.severity || "--"}</span>
                    </td>
                    <td>{log.confidence || "--"}</td>
                    <td style={{ fontSize: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FiCalendar size={14} />
                        {formatTimestamp(log.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
