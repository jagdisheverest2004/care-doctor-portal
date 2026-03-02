import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { patients } from "../data/mockData";
import PatientHeader from "../components/PatientHeader";
import AISummaryPanel from "../components/AISummaryPanel";
import TabsNav from "../components/TabsNav";
import ReportsSection from "../components/ReportsSection";
import AlertsSection from "../components/AlertsSection";
import PrescriptionSection from "../components/PrescriptionSection";
import TimelineSection from "../components/TimelineSection";
import SurgerySection from "../components/SurgerySection";
import MedicationHistorySection from "../components/MedicationHistorySection";
import LabTrendSection from "../components/LabTrendSection";

function PatientCommandCenter({ patient: propPatient }) {
  const { id } = useParams();
  const [tab, setTab] = useState("overview");
  const [patient, setPatient] = useState(propPatient || null);

  useEffect(() => {
    // If patient passed as prop (from PatientAccess), use it
    if (propPatient) {
      setPatient(propPatient);
      return;
    }

    // Otherwise, fetch from URL params (from Patients page)
    if (id) {
      const foundPatient = patients.find((p) => p.id === id);
      setPatient(foundPatient);
    }
  }, [id, propPatient]);

  if (!patient) {
    return (
      <div className="command-container">
        <div className="section-card" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: "1.1rem" }}>⏳ Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="command-container">
      {/* HEADER */}
      <PatientHeader patient={patient} />

      {/* GRID LAYOUT */}
      <div className="command-grid">

        {/* LEFT SIDE - Main Content */}
        <div>
          <TabsNav tab={tab} setTab={setTab} />

          {tab === "overview" && <TimelineSection patient={patient} />}
          {tab === "reports" && <ReportsSection patient={patient} />}
          {tab === "alerts" && <AlertsSection patient={patient} />}
          {tab === "prescription" && <PrescriptionSection patient={patient} />}
          {tab === "surgery" && <SurgerySection patient={patient} />}
          {tab === "medications" && <MedicationHistorySection patient={patient} />}
          {tab === "labs" && <LabTrendSection patient={patient} />}
        </div>

        {/* RIGHT SIDE - AI Summary */}
        <AISummaryPanel patient={patient} />

      </div>
    </div>
  );
}

export default PatientCommandCenter;
