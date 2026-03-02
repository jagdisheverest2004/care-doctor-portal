import React from "react";

function PatientDetails({ patientId }) {
    return (
        <div className="card">
            <h3>Patient Information</h3>
            <p><strong>ID:</strong> {patientId}</p>
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Age:</strong> 65</p>
            <p><strong>Allergies:</strong> Penicillin</p>
            <p><strong>Chronic Diseases:</strong> Diabetes</p>
        </div>
    );
}

export default PatientDetails;
