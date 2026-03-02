import React from "react";

const SurgerySection = ({ patient }) => {
  if (!patient.surgeries || patient.surgeries.length === 0) {
    return (
      <div className="section-card">
        <h3>Surgery History</h3>
        <p style={{ color: "#888" }}>No surgeries recorded</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3>Surgery History</h3>
      <div style={{ display: "grid", gap: "15px" }}>
        {patient.surgeries.map((surgery, idx) => (
          <div
            key={idx}
            style={{
              padding: "15px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              backgroundColor: "#f9fafb",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>
                  Date
                </label>
                <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>{surgery.date}</p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>
                  Procedure
                </label>
                <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>{surgery.procedure}</p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>
                  Hospital
                </label>
                <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>{surgery.hospital}</p>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>
                  Surgeon
                </label>
                <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>{surgery.doctor}</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>
                  Outcome
                </label>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "14px",
                    color: surgery.outcome.includes("Successful") ? "#16a34a" : "#ef4444",
                  }}
                >
                  {surgery.outcome}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurgerySection;
