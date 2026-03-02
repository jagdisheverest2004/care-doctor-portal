import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";

// Layout
import MainLayout from "./layouts/MainLayout";

// Pages
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/Patients";
import PatientAccessPage from "./pages/PatientAccess";
import PatientCommandCenter from "./pages/PatientCommandCenter";
import PrescriptionBuilder from "./pages/PrescriptionBuilder";
import AIAlertsPage from "./pages/AIAlerts";
import AnalyticsPage from "./pages/Analytics";
import AuditLogsPage from "./pages/AuditLogs";
import EmergencyPage from "./pages/Emergency";
import SettingsPage from "./pages/Settings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <MainLayout
        onLogout={handleLogout}
        onDarkModeToggle={handleDarkModeToggle}
        isDarkMode={isDarkMode}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patient-access/:id" element={<PatientAccessPage />} />
          <Route path="/patient-access" element={<PatientAccessPage />} />
          <Route path="/patient/:id" element={<PatientCommandCenter />} />
          <Route path="/prescription" element={<PrescriptionBuilder />} />
          <Route path="/alerts" element={<AIAlertsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/audit" element={<AuditLogsPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
