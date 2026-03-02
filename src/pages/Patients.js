import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import { api } from "../services/api";

function PatientsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};
        if (searchTerm.trim()) {
          params.patientName = searchTerm.trim();
        }
        if (filterRisk !== "all") {
          params.riskLevel = filterRisk.toUpperCase();
        }

        const data = await api.doctor.getPatients(params);
        setPatients(data?.patients || []);
      } catch (apiError) {
        setError(apiError?.message || "Unable to fetch patients.");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      loadPatients();
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, filterRisk]);

  const filteredPatients = useMemo(() => {
    return patients.map((patient) => {
      const latestVisit = patient?.doctorVisits?.[patient.doctorVisits.length - 1];
      return {
        ...patient,
        latestRisk: latestVisit?.riskLevel || "LOW",
        lastVisit: latestVisit?.visitedAt || null,
      };
    });
  }, [patients]);

  const riskColors = {
    LOW: "info",
    MEDIUM: "warning",
    HIGH: "warning",
    CRITICAL: "danger",
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ marginBottom: "30px" }}>
          <h1>Patient Management</h1>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            Search and filter patient records
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div style={{ position: "relative" }}>
              <FiSearch
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "#9ca3af",
                }}
              />
              <input
                type="text"
                placeholder="Search by name, ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "40px" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiFilter />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="very low">Very Low</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PATIENT LIST TABLE */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card-header">
          <h3 className="card-title">
            Patients ({filteredPatients.length})
          </h3>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
            <p>Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
            <p>No patients found matching your search criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age / Gender</th>
                  <th>Blood Group</th>
                  <th>Chronic Conditions</th>
                  <th>Last Visit</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <motion.tr
                    key={patient.id}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                  >
                    <td style={{ fontWeight: 500 }}>{patient.name}</td>
                    <td>
                      {patient.age} yrs / {patient.gender}
                    </td>
                    <td>
                      <span
                        style={{
                          background: "#f3f4f6",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontWeight: 600,
                        }}
                      >
                        {patient.bloodGroup}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {patient.chronicConditions
                        ? patient.chronicConditions.split(",").slice(0, 2).join(", ")
                        : "None"}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <FiCalendar size={14} />
                        {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : "--"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-${riskColors[patient.latestRisk] || "info"}`}
                      >
                        {patient.latestRisk}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/patient/${patient.id}`)}
                      >
                        View Profile
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default PatientsPage;