import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PatientCommandCenter from "./PatientCommandCenter";
import { api } from "../services/api";

function PatientAccess() {
  const [healthId, setHealthId] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [patient, setPatient] = useState(null);
  const { id } = useParams();

  const handleAccess = useCallback(async (searchId = healthId) => {
    if (!searchId) {
      setError("Please enter a patient ID");
      return;
    }

    setError("");
    setIsSearching(true);

    try {
      const found = await api.doctor.getPatientById(searchId);
      setPatient(found);
      console.log("✓ AUDIT LOG: Accessed patient", found.id, "at", new Date().toISOString());
    } catch (apiError) {
      setError(apiError?.message || "❌ Patient not found. Check Patient ID and try again.");
    } finally {
      setIsSearching(false);
    }
  }, [healthId]);

  useEffect(() => {
    if (id) {
      setHealthId(String(id));
      handleAccess(String(id));
    }
  }, [id, handleAccess]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAccess();
    }
  };

  // If patient found, show command center
  if (patient) {
    return <PatientCommandCenter patient={patient} />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 70px)",
        background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
        padding: "20px",
      }}
    >
      <div className="section-card" style={{ maxWidth: "450px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "#1e3a8a" }}>🔐 Secure Access</h1>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Enter patient Health ID to access medical records
          </p>
        </div>

        <div className="access-box">
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
            Health ID / Patient ID
          </label>
          <input
            type="text"
            placeholder="e.g., P001, P002, P003..."
            value={healthId}
            onChange={(e) => setHealthId(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSearching}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #2563eb",
              borderRadius: "6px",
              fontSize: "1rem",
              fontFamily: "monospace",
              marginBottom: "15px",
            }}
          />

          <div
            style={{
              fontSize: "0.85rem",
              color: "#6b7280",
              marginBottom: "20px",
            }}
          >
            <p>
              💡 Demo IDs:{" "}
              <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "3px" }}>
                1
              </code>
              ,{" "}
              <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "3px" }}>
                2
              </code>
              ,{" "}
              <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "3px" }}>
                3
              </code>
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "15px",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={() => handleAccess()}
            disabled={isSearching || !healthId}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              opacity: isSearching || !healthId ? 0.6 : 1,
              cursor: isSearching || !healthId ? "not-allowed" : "pointer",
            }}
          >
            {isSearching ? "🔍 Searching..." : "✓ Access Patient Record"}
          </button>

          <div
            style={{
              background: "#dbeafe",
              border: "1px solid #93c5fd",
              color: "#1e40af",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "0.85rem",
            }}
          >
            <p style={{ margin: "0 0 8px 0" }}>🔐 Access valid for 30 minutes</p>
            <p style={{ margin: "0" }}>📊 All actions logged for HIPAA audit trail</p>
          </div>
        </div>

        {/* Demo credential helper */}
        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#9ca3af",
          }}
        >
          <p>Testing? Try: <strong>2</strong> (patient ID)</p>
        </div>
      </div>
    </div>
  );
}

export default PatientAccess;
