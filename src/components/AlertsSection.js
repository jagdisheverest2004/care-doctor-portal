import MedicationAdherenceAlert from "./MedicationAdherenceAlert";

function AlertsSection({ patient }) {
  return (
    <div className="section-card">
      <h3 style={{ marginBottom: "20px" }}>⚠️ AI Clinical Alerts</h3>

      {/* Medication Adherence Section */}
      <h4 style={{ marginBottom: "12px", color: "#1f2937", fontSize: "14px", fontWeight: "600" }}>
        💊 Medication Adherence
      </h4>

      {patient && patient.adherence && patient.adherence.length > 0 ? (
        patient.adherence.map((data, i) => (
          <MedicationAdherenceAlert key={i} data={data} />
        ))
      ) : (
        <p style={{ color: "#9ca3af" }}>No adherence data available</p>
      )}

      <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

      {/* Other Clinical Alerts */}
      <h4 style={{ marginBottom: "12px", color: "#1f2937", fontSize: "14px", fontWeight: "600" }}>
        ⚠️ Other Alerts
      </h4>

      <div className="insight-card red">
        🔴 Drug interaction detected.
      </div>

      <div className="insight-card yellow">
        🟡 High sugar trend detected.
      </div>

      <div className="insight-card green">
        🟢 BP stable last 3 visits.
      </div>
    </div>
  );
}

export default AlertsSection;
