import { motion } from "framer-motion";
import { FiUsers, FiAlertCircle, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { getRecentPatients, getHighRiskPatients, getAlerts } from "../data/mockData";

function Dashboard() {
  const recentPatients = getRecentPatients();
  const highRiskPatients = getHighRiskPatients();
  const alerts = getAlerts();

  const statsData = [
    {
      icon: <FiUsers />,
      label: "Active Patients",
      value: "152",
      change: "+12",
      color: "info",
    },
    {
      icon: <FiAlertCircle />,
      label: "AI Alerts",
      value: "8",
      change: "+2",
      color: "warning",
    },
    {
      icon: <FiCalendar />,
      label: "Today's Appointments",
      value: "12",
      change: "+3",
      color: "success",
    },
    {
      icon: <FiTrendingUp />,
      label: "High-Risk Patients",
      value: highRiskPatients.length.toString(),
      change: "Critical",
      color: "danger",
    },
  ];

  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome back, Dr. Kailash 👨‍⚕️
        </motion.h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Here's your clinical summary for today
        </p>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            className={`stat-card ${stat.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <p className={`stat-change ${stat.change.includes("+") ? "positive" : "negative"}`}>
                  {stat.change}
                </p>
              </div>
              <div style={{ fontSize: "40px", opacity: 0.2 }}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RECENT PATIENTS */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="card-header">
          <h3 className="card-title">Recent Patients</h3>
          <a href="/patients" style={{ color: "#2563eb", textDecoration: "none" }}>
            View All →
          </a>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Last Visit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr key={patient.id}>
                  <td style={{ fontWeight: 500 }}>{patient.name}</td>
                  <td>{patient.age} yrs</td>
                  <td>{patient.bloodGroup}</td>
                  <td>{patient.lastVisit}</td>
                  <td>
                    <span className={`badge badge-${patient.riskLevel.toLowerCase().replace(" ", "-")}`}>
                      {patient.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI ACTIVITY FEED */}
      <div className="grid-2">
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="card-title">AI Safety Activity</h3>
          <div style={{ marginTop: "20px" }}>
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={`alert alert-${alert.severity.toLowerCase()}`}
                style={{ margin: "10px 0" }}
              >
                <div>
                  <strong>{alert.type}</strong>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px" }}>
                    {alert.message}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "11px" }}>
                    {alert.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="card-title">Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <button className="btn btn-primary" style={{ justifyContent: "center" }}>
              ➕ Start Consultation
            </button>
            <button className="btn btn-primary" style={{ justifyContent: "center" }}>
              💊 Generate Prescription
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: "center" }}>
              📊 View Timeline
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: "center" }}>
              🚨 Emergency QR
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Dashboard;