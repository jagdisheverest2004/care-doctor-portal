import { useState } from "react";

function MedicationAdherenceAlert({ data }) {
  const [open, setOpen] = useState(false);

  let severity = "green";
  if (data.adherenceRate < 80) severity = "red";
  else if (data.adherenceRate < 90) severity = "yellow";

  return (
    <div
      className={`insight-card ${severity}`}
      style={{ cursor: "pointer", marginBottom: "10px" }}
      onClick={() => setOpen(!open)}
    >
      <strong>{data.medicine}</strong> — {data.adherenceRate}% adherence

      {data.adherenceRate < 80 && (
        <div style={{ marginTop: "5px", fontSize: "13px" }}>
          🔴 Missed {data.missedDoses} dose{data.missedDoses !== 1 ? "s" : ""}
        </div>
      )}

      {open && (
        <div
          style={{
            marginTop: "10px",
            background: "#ffffff",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#1f2937",
          }}
        >
          <p style={{ margin: "0 0 8px 0" }}>
            <strong>Last Missed:</strong> {data.lastMissed || "None"}
          </p>

          <div
            style={{
              height: "8px",
              background: "#e2e8f0",
              borderRadius: "5px",
              overflow: "hidden",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                width: `${data.adherenceRate}%`,
                height: "100%",
                background:
                  severity === "red"
                    ? "#ef4444"
                    : severity === "yellow"
                    ? "#facc15"
                    : "#22c55e",
              }}
            ></div>
          </div>

          <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "12px" }}>
            {data.adherenceRate}% of prescribed doses taken
          </p>
        </div>
      )}
    </div>
  );
}

export default MedicationAdherenceAlert;
