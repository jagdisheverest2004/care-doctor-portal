import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiAlertTriangle, FiPhone, FiCalendar } from "react-icons/fi";
import { getPatientById } from "../data/mockData";

function PatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = getPatientById(id);
  const [activeTab, setActiveTab] = useState("timeline");

  if (!patient) {
    return (
      <div className="card">
        <h2>Patient Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/patients")}>
          Back to Patients
        </button>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate("/patients")}
          style={{ marginBottom: "20px" }}
        >
          <FiArrowLeft /> Back to Patients
        </button>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <h1>{patient.name}</h1>
              <div
                style={{
                  display: "flex",
                  gap: "30px",
                  marginTop: "15px",
                  color: "#6b7280",
                }}
              >
                <div>
                  <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
                    Age
                  </p>
                  <p style={{ fontWeight: 600, color: "#1f2937" }}>
                    {patient.age} yrs
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
                    Gender
                  </p>
                  <p style={{ fontWeight: 600, color: "#1f2937" }}>
                    {patient.gender}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", textTransform: "uppercase" }}>
                    Blood Group
                  </p>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#1f2937",
                      background: "#f3f4f6",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {patient.bloodGroup}
                  </p>
                </div>
              </div>
            </div>
            <span className={`badge badge-${patient.riskLevel.toLowerCase()}`}>
              {patient.riskLevel}
            </span>
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="tabs">
          {["timeline", "allergies", "conditions", "prescriptions", "vitals"].map(
            (tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "timeline" && "📊 Timeline"}
                {tab === "allergies" && "⚠️ Allergies"}
                {tab === "conditions" && "🏥 Chronic Conditions"}
                {tab === "prescriptions" && "💊 Prescriptions"}
                {tab === "vitals" && "❤️ Vitals"}
              </button>
            )
          )}
        </div>

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <div className="timeline">
            {patient.vitals.map((vital, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-content">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <strong>Medical Check-up</strong>
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>
                      {vital.date}
                    </span>
                  </div>
                  <p>
                    BP: {vital.bp} | Sugar: {vital.sugar}mg/dL | Temp:{" "}
                    {vital.temp}°F | Pulse: {vital.pulse}bpm
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ALLERGIES TAB */}
        {activeTab === "allergies" && (
          <div style={{ marginTop: "20px" }}>
            {patient.allergies.length > 0 ? (
              patient.allergies.map((allergy, i) => (
                <div
                  key={i}
                  className="alert alert-danger"
                  style={{ marginBottom: "10px" }}
                >
                  <FiAlertTriangle />
                  <strong>{allergy}</strong>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7280" }}>No allergies recorded.</p>
            )}
          </div>
        )}

        {/* CHRONIC CONDITIONS TAB */}
        {activeTab === "conditions" && (
          <div style={{ marginTop: "20px" }}>
            {patient.chronic.length > 0 ? (
              patient.chronic.map((condition, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f3f4f6",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    borderLeft: "3px solid #2563eb",
                  }}
                >
                  <strong>{condition}</strong>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7280" }}>No chronic conditions recorded.</p>
            )}
          </div>
        )}

        {/* PRESCRIPTIONS TAB */}
        {activeTab === "prescriptions" && (
          <div style={{ marginTop: "20px" }}>
            {patient.currentMedicines.length > 0 ? (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 0" }}>
                      Medicine Name
                    </th>
                    <th style={{ textAlign: "left", padding: "10px 0" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patient.currentMedicines.map((med, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "10px 0" }}>{med}</td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#6b7280" }}>No prescriptions found.</p>
            )}
          </div>
        )}

        {/* VITALS TAB */}
        {activeTab === "vitals" && (
          <div style={{ marginTop: "20px" }}>
            {patient.vitals.length > 0 ? (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 0" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "10px 0" }}>BP</th>
                    <th style={{ textAlign: "left", padding: "10px 0" }}>
                      Blood Sugar
                    </th>
                    <th style={{ textAlign: "left", padding: "10px 0" }}>Temp</th>
                    <th style={{ textAlign: "left", padding: "10px 0" }}>Pulse</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.vitals.map((vital, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "10px 0" }}>{vital.date}</td>
                      <td>{vital.bp}</td>
                      <td>{vital.sugar} mg/dL</td>
                      <td>{vital.temp}°F</td>
                      <td>{vital.pulse} bpm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#6b7280" }}>No vitals recorded.</p>
            )}
          </div>
        )}
      </motion.div>

      {/* EMERGENCY INFO */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="card-title">Quick Contact</h3>
        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase" }}>
              Phone
            </p>
            <p style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <FiPhone /> {patient.phone}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase" }}>
              Last Visit
            </p>
            <p style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <FiCalendar /> {patient.lastVisit}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default PatientProfilePage;
