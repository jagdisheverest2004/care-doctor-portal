import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiTrendingUp } from "react-icons/fi";
import { api } from "../services/api";

function PrescriptionBuilder() {
  const doctorDisplayName = api.authState.getUser()?.username || "Doctor";
  const [drug, setDrug] = useState("");
  const [dose, setDose] = useState("");
  const [duration, setDuration] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [prescription, setPrescription] = useState(null);

  const commonDrugs = [
    "Metformin 500mg",
    "Aspirin 75mg",
    "Lisinopril 10mg",
    "Atorvastatin 20mg",
    "Ramipril 5mg",
    "Insulin",
    "Salbutamol",
    "Fluticasone",
  ];

  const drugInteractions = {
    "Aspirin 75mg": [
      { drug: "Warfarin", severity: "High", message: "Increased bleeding risk" },
      { drug: "Ibuprofen", severity: "Medium", message: "GI complications" },
    ],
    "Metformin 500mg": [
      { drug: "Contrast dye", severity: "High", message: "Risk of kidney damage" },
    ],
    "Lisinopril 10mg": [
      { drug: "Potassium supplements", severity: "High", message: "Hyperkalemia risk" },
    ],
  };

  const validateDrug = () => {
    setAlerts([]);
    if (!drug) {
      setAlerts([
        { type: "info", message: "Please select a drug first" },
      ]);
      return;
    }

    const interactions = drugInteractions[drug] || [];
    if (interactions.length === 0) {
      setAlerts([{ type: "success", message: "✓ Safe combination approved" }]);
    } else {
      setAlerts(
        interactions.map((inter) => ({
          type: inter.severity.toLowerCase(),
          message: `⚠ ${inter.drug}: ${inter.message}`,
        }))
      );
    }
  };

  const submitPrescription = () => {
    if (!drug || !dose || !duration) {
      alert("Please fill all fields");
      return;
    }
    setPrescription({
      drug,
      dose,
      duration,
      date: new Date().toLocaleDateString(),
    });
    setDrug("");
    setDose("");
    setDuration("");
    setAlerts([]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Prescription Builder</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Create prescriptions with AI safety validation
        </p>
      </motion.div>

      <div className="grid-2">
        {/* LEFT SIDE - FORM */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="card-title">Prescription Details</h3>

          <div className="form-group">
            <label>Drug Name</label>
            <select value={drug} onChange={(e) => setDrug(e.target.value)}>
              <option value="">Select Drug...</option>
              {commonDrugs.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Dosage</label>
            <input
              type="text"
              placeholder="e.g., 1 tablet twice daily"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              placeholder="e.g., 30 days"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" style={{ width: "100%" }} onClick={validateDrug}>
            <FiTrendingUp /> Validate with AI
          </button>
        </motion.div>

        {/* RIGHT SIDE - AI SAFETY PANEL */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="card-title">AI Safety Panel</h3>

          {alerts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
              <p>Click "Validate with AI" to check drug safety</p>
            </div>
          ) : (
            <div style={{ marginTop: "20px" }}>
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`alert alert-${alert.type}`}
                  style={{ marginBottom: "10px" }}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          {alerts.some((a) => a.type === "success") && (
            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "20px" }}
              onClick={submitPrescription}
            >
              <FiCheck /> Generate Prescription
            </button>
          )}

          {alerts.some((a) => a.type === "high" || a.type === "critical") && (
            <button
              className="btn btn-danger"
              style={{ width: "100%", marginTop: "20px" }}
              onClick={submitPrescription}
            >
              Override & Generate
            </button>
          )}
        </motion.div>
      </div>

      {/* PRESCRIPTION PREVIEW */}
      {prescription && (
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="card-title">Prescription Preview</h3>
          <div
            style={{
              background: "#f9fafb",
              padding: "30px",
              borderRadius: "8px",
              marginTop: "20px",
              border: "2px dashed #d1d5db",
              fontFamily: "monospace",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}>
              📋 PRESCRIPTION
            </p>
            <p>
              <strong>Drug:</strong> {prescription.drug}
            </p>
            <p>
              <strong>Dosage:</strong> {prescription.dose}
            </p>
            <p>
              <strong>Duration:</strong> {prescription.duration}
            </p>
            <p>
              <strong>Date Issued:</strong> {prescription.date}
            </p>
            <p style={{ marginTop: "20px", color: "#6b7280", fontSize: "12px" }}>
              Generated by AI Safety System | Dr. {doctorDisplayName} | Care++ Portal
            </p>
          </div>
          <button className="btn btn-secondary" style={{ marginTop: "20px", width: "100%" }}>
            Download PDF
          </button>
        </motion.div>
      )}
    </>
  );
}

export default PrescriptionBuilder;
