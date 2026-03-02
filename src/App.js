import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";

// Layout
import MainLayout from "./layouts/MainLayout";

// Pages
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import PatientsPage from "./pages/Patients";
import PatientAccessPage from "./pages/PatientAccess";
import PatientCommandCenter from "./pages/PatientCommandCenter";
import PrescriptionBuilder from "./pages/PrescriptionBuilder";
import AIAlertsPage from "./pages/AIAlerts";
import AnalyticsPage from "./pages/Analytics";
import AuditLogsPage from "./pages/AuditLogs";
import EmergencyPage from "./pages/Emergency";
import SettingsPage from "./pages/Settings";
import { api } from "./services/api";

const THEME_STORAGE_KEY = "care_doctor_portal_theme";

function ProtectedRoute({ isLoggedIn, authChecked, children }) {
  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card" style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <h3 className="card-title">Checking session...</h3>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>Validating authentication cookie</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark";
  });
  const [doctorProfile, setDoctorProfile] = useState(null);

  const doctorName = useMemo(() => {
    if (doctorProfile?.name) return doctorProfile.name;
    const authUser = api.authState.getUser();
    return authUser?.username || "Doctor";
  }, [doctorProfile]);

  useEffect(() => {
    const bootstrapAuthFromSession = async () => {
      try {
        const profile = await api.doctor.getProfile();
        setDoctorProfile(profile);
        api.authState.setUser({
          username: profile?.name || api.authState.getUser()?.username || "Doctor",
          role: "DOCTOR",
        });
        setIsLoggedIn(true);
      } catch {
        api.authState.clear();
        setDoctorProfile(null);
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    bootstrapAuthFromSession();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem(THEME_STORAGE_KEY, "light");
    }
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  const handleLogin = async (payload) => {
    await api.auth.login(payload);
    const profile = await api.doctor.getProfile();
    setDoctorProfile(profile);
    setIsLoggedIn(true);
    setAuthChecked(true);
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      api.authState.clear();
    }
    setDoctorProfile(null);
    setIsLoggedIn(false);
    setAuthChecked(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !authChecked ? (
              <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="card" style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
                  <h3 className="card-title">Checking session...</h3>
                  <p style={{ color: "#6b7280", marginTop: "8px" }}>Validating authentication cookie</p>
                </div>
              </div>
            ) : isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="*"
          element={(
            <ProtectedRoute isLoggedIn={isLoggedIn} authChecked={authChecked}>
              <MainLayout
                onLogout={handleLogout}
                onDarkModeToggle={handleDarkModeToggle}
                isDarkMode={isDarkMode}
                doctorName={doctorName}
              >
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/appointments" element={<Appointments />} />
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
            </ProtectedRoute>
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
