function PatientHeader({ patient }) {
  const riskColors = {
    "Very Low": "#16a34a",
    Low: "#0ea5e9",
    Medium: "#f59e0b",
    High: "#ef4444",
    Critical: "#7f1d1d",
  };

  return (
    <div className="patient-header">
      <h1>{patient.name}</h1>

      <div className="patient-header-info">
        <div className="patient-info-item">
          <span className="patient-info-label">Age</span>
          <span className="patient-info-value">{patient.age} yrs</span>
        </div>

        <div className="patient-info-item">
          <span className="patient-info-label">Gender</span>
          <span className="patient-info-value">{patient.gender}</span>
        </div>

        <div className="patient-info-item">
          <span className="patient-info-label">Blood Group</span>
          <span className="patient-info-value">{patient.bloodGroup}</span>
        </div>

        <div className="patient-info-item">
          <span className="patient-info-label">Risk Status</span>
          <span
            className="patient-info-value"
            style={{
              color: riskColors[patient.riskLevel],
              fontSize: "16px",
            }}
          >
            {patient.riskLevel}
          </span>
        </div>

        <div className="patient-info-item">
          <span className="patient-info-label">Last Visit</span>
          <span className="patient-info-value">{patient.lastVisit}</span>
        </div>

        <div className="patient-info-item">
          <span className="patient-info-label">Phone</span>
          <span className="patient-info-value" style={{ fontSize: "14px" }}>
            {patient.phone}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PatientHeader;
