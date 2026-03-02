function TabsNav({ tab, setTab }) {
  return (
    <div className="command-tabs">
      <button
        className={tab === "overview" ? "active" : ""}
        onClick={() => setTab("overview")}
      >
        📊 Overview
      </button>

      <button
        className={tab === "reports" ? "active" : ""}
        onClick={() => setTab("reports")}
      >
        📋 Reports
      </button>

      <button
        className={tab === "alerts" ? "active" : ""}
        onClick={() => setTab("alerts")}
      >
        ⚠️ AI Alerts
      </button>

      <button
        className={tab === "prescription" ? "active" : ""}
        onClick={() => setTab("prescription")}
      >
        💊 Prescription
      </button>

      <button
        className={tab === "surgery" ? "active" : ""}
        onClick={() => setTab("surgery")}
      >
        🔪 Surgery
      </button>

      <button
        className={tab === "medications" ? "active" : ""}
        onClick={() => setTab("medications")}
      >
        💉 Medications
      </button>

      <button
        className={tab === "labs" ? "active" : ""}
        onClick={() => setTab("labs")}
      >
        📈 Lab Trends
      </button>
    </div>
  );
}

export default TabsNav;
