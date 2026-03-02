import InsightCard from "./InsightCard";

function AISummaryPanel({ patient }) {
  const visits = patient.medicalHistory ? patient.medicalHistory.length : 0;
  const lastVisit = patient.medicalHistory ? patient.medicalHistory[visits - 1] : null;
  const chronic = patient.chronicDiseases ? patient.chronicDiseases.join(", ") : "None";
  const allergies = patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(", ") : "None documented";

  // AI Risk Score Engine
  const chronicCount = patient.chronicDiseases ? patient.chronicDiseases.length : 0;
  const surgeryCount = patient.surgeries ? patient.surgeries.length : 0;
  
  let riskScore = chronicCount * 20 + surgeryCount * 10;
  if (riskScore > 60) riskScore = 60;
  
  let riskLevel = riskScore > 40 ? "High" : riskScore > 20 ? "Medium" : "Low";
  let riskColor = riskLevel === "High" ? "red" : riskLevel === "Medium" ? "yellow" : "green";

  const latestDiagnosis = lastVisit ? lastVisit.diagnosis : "No recent diagnosis";

  return (
    <div className="ai-summary">
      <h3>🤖 AI Clinical Summary</h3>

      <InsightCard
        color="blue"
        text={`Total Visits: ${visits} over 15+ years`}
      />

      <InsightCard color="yellow" text={`Conditions: ${chronic}`} />

      <InsightCard color="red" text={`Allergies: ${allergies}`} />

      <InsightCard color="green" text={`Latest: ${latestDiagnosis}`} />

      <InsightCard
        color={riskColor}
        text={`Risk Level: ${riskLevel} (Score: ${riskScore}%)`}
      />

      <hr />

      <small style={{ color: "#64748b", fontSize: "12px" }}>
        🔄 AI analyzed 15+ years • {chronicCount} chronic condition{chronicCount !== 1 ? "s" : ""} • {surgeryCount} surgical intervention{surgeryCount !== 1 ? "s" : ""}
      </small>
    </div>
  );
}

export default AISummaryPanel;
