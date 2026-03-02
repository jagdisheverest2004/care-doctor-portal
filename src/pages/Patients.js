import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiPhone, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import { patients } from "../data/mockData";

function PatientsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);

    const matchesRisk =
      filterRisk === "all" ||
      patient.riskLevel.toLowerCase() === filterRisk.toLowerCase();

    return matchesSearch && matchesRisk;
  });

  const riskColors = {
    "Very Low": "success",
    Low: "info",
    Medium: "warning",
    High: "warning",
    Critical: "danger",
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

        {filteredPatients.length === 0 ? (
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
                      {patient.chronic.length > 0
                        ? patient.chronic.slice(0, 2).join(", ")
                        : "None"}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <FiCalendar size={14} />
                        {patient.lastVisit}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-${riskColors[patient.riskLevel]}`}
                      >
                        {patient.riskLevel}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/patient-access/${patient.id}`)}
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