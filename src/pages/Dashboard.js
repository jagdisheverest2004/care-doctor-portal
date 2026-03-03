import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiAlertCircle, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { getAlerts } from "../data/mockData";
import { api } from "../services/api";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const alerts = getAlerts();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const [profileData, patientsData] = await Promise.all([
          api.doctor.getProfile(),
          api.doctor.getPatients(),
        ]);

        setProfile(profileData);
        setPatients(patientsData?.patients || []);
      } catch (apiError) {
        setError(apiError?.message || "Failed to load dashboard data.");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const appointments = useMemo(() => profile?.appointments || [], [profile]);
  const consultations = useMemo(() => profile?.consultations || [], [profile]);

  const criticalPatientsCount = useMemo(() => {
    const highRiskConsultations = consultations.filter((consultation) => {
      const level = consultation?.riskLevel?.toUpperCase();
      return level === "HIGH" || level === "CRITICAL";
    });
    const uniquePatientIds = new Set(highRiskConsultations.map((item) => item.patientId));
    return uniquePatientIds.size;
  }, [consultations]);

  const doctorId = useMemo(() => {
    return profile?.doctorId || profile?.id || null;
  }, [profile]);

  const recentPatients = useMemo(() => {
    const mergedPatients = new Map();

    patients.forEach((patientItem) => {
      const key = patientItem.id;
      if (!mergedPatients.has(key)) {
        mergedPatients.set(key, {
          ...patientItem,
          doctorVisits: [...(patientItem.doctorVisits || [])],
        });
        return;
      }

      const existing = mergedPatients.get(key);
      const existingVisitIds = new Set((existing.doctorVisits || []).map((visit) => visit.id));
      const mergedVisits = [...(existing.doctorVisits || [])];

      (patientItem.doctorVisits || []).forEach((visit) => {
        if (!existingVisitIds.has(visit.id)) {
          mergedVisits.push(visit);
        }
      });

      mergedPatients.set(key, {
        ...existing,
        doctorVisits: mergedVisits,
      });
    });

    return Array.from(mergedPatients.values())
      .map((patientItem) => {
        const allVisits = patientItem.doctorVisits || [];
        const doctorVisits = doctorId
          ? allVisits.filter((visit) => Number(visit.prescribedDoctorId) === Number(doctorId))
          : allVisits;

        const consultationCount = new Set(doctorVisits.map((visit) => visit.id)).size;
        const lastVisitedAt = doctorVisits
          .map((visit) => visit.visitedAt)
          .filter(Boolean)
          .sort((first, second) => new Date(second).getTime() - new Date(first).getTime())[0] || null;

        return {
          id: patientItem.id,
          name: patientItem.name,
          age: patientItem.age,
          gender: patientItem.gender,
          bloodGroup: patientItem.bloodGroup,
          consultationCount,
          lastVisitedAt,
        };
      })
      .sort((first, second) => {
        if (second.consultationCount !== first.consultationCount) {
          return second.consultationCount - first.consultationCount;
        }

        const firstTime = first.lastVisitedAt ? new Date(first.lastVisitedAt).getTime() : 0;
        const secondTime = second.lastVisitedAt ? new Date(second.lastVisitedAt).getTime() : 0;
        return secondTime - firstTime;
      })
      .slice(0, 8);
  }, [patients, doctorId]);

  const statsData = [
    {
      icon: <FiUsers />,
      label: "Critical Patients",
      value: String(criticalPatientsCount),
      change: "Live",
      color: "info",
    },
    {
      icon: <FiAlertCircle />,
      label: "Consultations",
      value: String(consultations.length),
      change: "Updated",
      color: "warning",
    },
    {
      icon: <FiCalendar />,
      label: "Appointments",
      value: String(appointments.length),
      change: "Live",
      color: "success",
    },
    {
      icon: <FiTrendingUp />,
      label: "Doctor Specialization",
      value: profile?.specialization || "--",
      change: profile?.hospitalName || "Hospital",
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
          Welcome back, Dr. {profile?.name || "Doctor"} 👨‍⚕️
        </motion.h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Here's your clinical summary for today
        </p>
        {error && (
          <div className="alert alert-danger" style={{ marginTop: "14px" }}>
            {error}
          </div>
        )}
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
          <a href="/consultations" style={{ color: "#2563eb", textDecoration: "none" }}>
            View All →
          </a>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Consultations</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                    Loading recent patients...
                  </td>
                </tr>
              )}

              {!loading && recentPatients.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                    No patient activity found.
                  </td>
                </tr>
              )}

              {!loading && recentPatients.map((patient) => (
                <tr key={patient.id}>
                  <td style={{ fontWeight: 500 }}>{patient.name}</td>
                  <td>{patient.age ? `${patient.age} yrs` : "--"}</td>
                  <td>{patient.gender || "--"}</td>
                  <td>{patient.bloodGroup}</td>
                  <td>{patient.consultationCount}</td>
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