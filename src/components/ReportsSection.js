function ReportsSection({ patient }) {
  if (!patient.reports || patient.reports.length === 0) {
    return (
      <div className="section-card" style={{ padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "#9ca3af" }}>No reports available</p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h3>📋 Reports</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        {patient.reports.map((r, i) => (
          <div key={i} className="section-card" style={{ marginBottom: "0" }}>
            <h4>{r.name}</h4>
            <p style={{ color: "#64748b", fontSize: "13px" }}>{r.type}</p>

            <div
              style={{
                marginTop: "10px",
                padding: "8px",
                background: r.status === "normal" ? "#e6f9f0" : r.status === "warning" ? "#fef3c7" : "#fee2e2",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {r.status === "normal" && "🟢 All values normal"}
              {r.status === "warning" && "🟡 Needs review"}
              {r.status === "critical" && "🔴 Critical"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsSection;
