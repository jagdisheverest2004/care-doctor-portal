import React from "react";

const MedicationHistorySection = ({ patient }) => {
  if (!patient.medicationHistory || patient.medicationHistory.length === 0) {
    return (
      <div className="section-card">
        <h3>Medication History</h3>
        <p style={{ color: "#888" }}>No medication history recorded</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3>Medication Timeline</h3>
      <div style={{ display: "grid", gap: "12px" }}>
        {patient.medicationHistory.map((med, idx) => {
          const isActive = med.status === "Active";
          const statusColor = isActive ? "#16a34a" : "#9ca3af";
          const backgroundColor = isActive ? "#f0fdf4" : "#f3f4f6";

          return (
            <div
              key={idx}
              style={{
                padding: "15px",
                border: `1px solid ${statusColor}40`,
                borderRadius: "6px",
                backgroundColor: backgroundColor,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "15px",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <label style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>
                    DRUG NAME
                  </label>
                  <p
                    style={{
                      margin: "5px 0 0 0",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {med.drug}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>
                    START DATE
                  </label>
                  <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>{med.startDate}</p>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>
                    END DATE
                  </label>
                  <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                    {med.endDate === "Ongoing" ? (
                      <span style={{ color: "#2563eb" }}>Ongoing</span>
                    ) : (
                      med.endDate
                    )}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>
                    PRESCRIBED BY
                  </label>
                  <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>{med.prescribedBy}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: statusColor,
                    color: "white",
                  }}
                >
                  {med.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicationHistorySection;
