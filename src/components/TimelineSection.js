import { useState } from "react";
import AppointmentModal from "./AppointmentModal";

function TimelineSection({ patient }) {
  const [selected, setSelected] = useState(null);

  if (!patient.medicalHistory || patient.medicalHistory.length === 0) {
    return (
      <div className="section-card" style={{ padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "#9ca3af" }}>No medical history available</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3 style={{ marginBottom: "20px" }}>📋 Complete Medical Timeline (15-Year History)</h3>

      <div
        style={{
          borderLeft: "3px solid #2563eb",
          paddingLeft: "20px",
          paddingTop: "10px",
        }}
      >
        {patient.medicalHistory.map((visit, index) => (
          <div
            key={visit.id}
            style={{
              marginBottom: "25px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              paddingLeft: "15px",
              paddingRight: "15px",
              paddingTop: "12px",
              paddingBottom: "12px",
              borderRadius: "8px",
              border: "1px solid transparent",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f9ff";
              e.currentTarget.style.borderColor = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onClick={() => setSelected(visit)}
          >
            <div style={{ display: "flex", alignItems: "start", gap: "15px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  marginTop: "5px",
                  flexShrink: 0,
                  marginLeft: "-35px",
                }}
              ></div>
              <div>
                <strong style={{ color: "#1f2937", fontSize: "15px" }}>{visit.date}</strong>
                <p style={{ margin: "5px 0", color: "#6b7280" }}>{visit.reason}</p>
                <small style={{ color: "#9ca3af" }}>
                  🏥 {visit.hospital} | Dr. {visit.doctor?.split(" ").pop()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px", color: "#9ca3af", fontSize: "0.85rem" }}>
        📈 {patient.medicalHistory.length} records spanning {patient.age > 50 ? "15+" : "10+"} years
      </div>

      {selected && <AppointmentModal visit={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default TimelineSection;
