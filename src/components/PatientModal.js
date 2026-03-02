import Modal from "./Modal";

function PatientModal({ patient, onClose }) {

    const checkDrugSafety = (medicine) => {
        if (medicine === "Aspirin" && patient.currentMedicines.includes("Warfarin")) {
            return "⚠ High Risk: Aspirin increases bleeding risk with Warfarin.";
        }
        if (patient.allergies.includes("Penicillin") && medicine === "Amoxicillin") {
            return "⚠ Allergy Conflict: Patient allergic to Penicillin group.";
        }
        return "✅ No major interactions detected.";
    };

    return (
        <Modal onClose={onClose}>
            <h2>{patient.name} - Longitudinal Health Record</h2>

            {/* Emergency Break-Glass */}
            <div className="card" style={{ background: "#ffe5e5" }}>
                <h3>🚨 Emergency Vital Access</h3>
                <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                <p><strong>Critical Allergies:</strong> {patient.allergies.join(", ")}</p>
                <p><strong>Current Medicines:</strong> {patient.currentMedicines.join(", ")}</p>
            </div>

            {/* Patient Summary */}
            <div className="card">
                <h3>Patient Summary</h3>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                <p><strong>Allergies:</strong> {patient.allergies.join(", ")}</p>
                <p><strong>Chronic Conditions:</strong> {patient.chronicDiseases.join(", ")}</p>
            </div>

            {/* Timeline */}
            <div className="card">
                <h3>Medical Timeline</h3>
                <table>
                    <thead>
                        <tr><th>Date & Time</th><th>Event</th></tr>
                    </thead>
                    <tbody>
                        {patient.timeline.map((t, i) => (
                            <tr key={i}>
                                <td>{t.date}</td>
                                <td>{t.event}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vitals */}
            <div className="card">
                <h3>Vitals History</h3>
                <table>
                    <thead>
                        <tr><th>Date</th><th>Blood Pressure</th><th>Blood Sugar</th></tr>
                    </thead>
                    <tbody>
                        {patient.vitals.map((v, i) => (
                            <tr key={i}>
                                <td>{v.date}</td>
                                <td>{v.bp}</td>
                                <td>{v.sugar}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Current Prescriptions */}
            <div className="card">
                <h3>Current Prescriptions</h3>
                <table>
                    <thead>
                        <tr><th>Medicine</th><th>Dose</th><th>Duration</th></tr>
                    </thead>
                    <tbody>
                        {patient.prescriptions.map((rx, i) => (
                            <tr key={i}>
                                <td>{rx.medicine}</td>
                                <td>{rx.dose}</td>
                                <td>{rx.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Prescription Entry Simulation */}
            <div className="card">
                <h3>💊 Test Drug Safety Interactions</h3>
                <button className="primary" onClick={() => alert(checkDrugSafety("Aspirin"))}>
                    Test Aspirin
                </button>
                <button className="primary" style={{ marginLeft: "10px" }}
                    onClick={() => alert(checkDrugSafety("Amoxicillin"))}>
                    Test Amoxicillin
                </button>
            </div>

            {/* Reports */}
            <div className="card">
                <h3>Medical Reports</h3>
                <table>
                    <thead>
                        <tr><th>Report Name</th><th>Type</th></tr>
                    </thead>
                    <tbody>
                        {patient.reports.map((r, i) => (
                            <tr key={i}>
                                <td>📄 {r.name}</td>
                                <td>{r.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
}

export default PatientModal;
