import React, { useState } from "react";
import PatientProfile from "./PatientProfile";
import AIAgent from "./AIAgent";

function DashboardHome() {
    const [patientId, setPatientId] = useState("");
    const [showPatient, setShowPatient] = useState(false);

    const handleSearch = () => {
        if (patientId === "P1001") {
            setShowPatient(true);
        } else {
            alert("Patient not found");
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h3>Enter Patient ID</h3>
                <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="e.g., P1001"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {showPatient && <PatientProfile />}

            <AIAgent />
        </div>
    );
}

export default DashboardHome;
