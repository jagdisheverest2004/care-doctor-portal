function AppointmentModal({ visit, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          width: "90%",
          maxWidth: "900px",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Close
        </button>

        <h2 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>
          {visit.date} – {visit.reason}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <p style={{ margin: "8px 0" }}>
              <strong>Hospital:</strong> {visit.hospital}
            </p>
            <p style={{ margin: "8px 0" }}>
              <strong>Doctor:</strong> {visit.doctor}
            </p>
          </div>
          <div>
            <p style={{ margin: "8px 0" }}>
              <strong>Diagnosis:</strong> {visit.diagnosis}
            </p>
          </div>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <h3 style={{ color: "#1f2937", marginBottom: "10px" }}>📝 Doctor Notes</h3>
        <p style={{ color: "#6b7280", lineHeight: "1.6" }}>{visit.notes}</p>

        <hr style={{ margin: "20px 0" }} />

        <h3 style={{ color: "#1f2937", marginBottom: "10px" }}>💊 Prescriptions</h3>
        {visit.prescriptions && visit.prescriptions.length > 0 ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {visit.prescriptions.map((p, i) => (
              <div
                key={i}
                style={{
                  background: "#f8f9fa",
                  padding: "12px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #2563eb",
                }}
              >
                <strong>{p.drug}</strong> – {p.dose} – {p.duration}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#9ca3af" }}>No prescriptions</p>
        )}

        <hr style={{ margin: "20px 0" }} />

        <h3 style={{ color: "#1f2937", marginBottom: "10px" }}>🧪 Lab Reports</h3>
        {visit.labs && visit.labs.length > 0 ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {visit.labs.map((l, i) => (
              <div
                key={i}
                style={{
                  background: "#f8f9fa",
                  padding: "12px",
                  borderRadius: "8px",
                  borderLeft:
                    l.status === "Normal"
                      ? "4px solid #16a34a"
                      : l.status === "High"
                      ? "4px solid #ef4444"
                      : "4px solid #f59e0b",
                }}
              >
                <strong>{l.test}</strong> – {l.result} <span style={{ color: "#6b7280" }}>({l.status})</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#9ca3af" }}>No lab tests</p>
        )}

        <hr style={{ margin: "20px 0" }} />

        <h3 style={{ color: "#1f2937", marginBottom: "10px" }}>📅 Follow Up</h3>
        <p style={{ color: "#6b7280" }}>{visit.followUp}</p>
      </div>
    </div>
  );
}

export default AppointmentModal;
