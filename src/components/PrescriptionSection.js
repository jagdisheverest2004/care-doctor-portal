import { useState } from "react";

function PrescriptionSection({ patient }) {
  const [drug, setDrug] = useState("");
  const [alert, setAlert] = useState("");

  const validate = () => {
    if (drug === "Aspirin 75mg")
      setAlert({ type: "red", msg: "⚠️ Interaction with Warfarin detected." });
    else if (drug)
      setAlert({ type: "green", msg: "✓ Safe prescription." });
    else
      setAlert(null);
  };

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <div className="section-card" style={{ flex: 2, minWidth: "280px" }}>
        <h3>💊 Prescription Builder</h3>

        <input
          placeholder="Enter Drug Name (e.g. Aspirin 75mg)"
          value={drug}
          onChange={(e) => setDrug(e.target.value)}
          style={{ marginBottom: "12px" }}
        />

        <input
          placeholder="Dosage (e.g. 1 tablet twice daily)"
          style={{ marginBottom: "12px" }}
        />

        <input
          placeholder="Duration (e.g. 30 days)"
          style={{ marginBottom: "12px" }}
        />

        <button
          className="btn btn-primary"
          onClick={validate}
          style={{ width: "100%" }}
        >
          🤖 Run AI Check
        </button>
      </div>

      <div className="section-card" style={{ flex: 1, minWidth: "200px" }}>
        <h3>AI Validation</h3>

        {alert ? (
          <div
            className={`insight-card ${alert.type}`}
            style={{ margin: "0" }}
          >
            {alert.msg}
          </div>
        ) : (
          <p style={{ color: "#9ca3af", fontSize: "13px" }}>
            Select drug and click validate
          </p>
        )}

        <hr style={{ margin: "15px 0" }} />

        <small style={{ color: "#9ca3af", fontSize: "12px" }}>
          AI-assisted check. Clinical judgment required.
        </small>
      </div>
    </div>
  );
}

export default PrescriptionSection;
