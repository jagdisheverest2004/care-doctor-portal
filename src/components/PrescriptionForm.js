import React, { useState } from "react";

function PrescriptionForm() {
    const [medicine, setMedicine] = useState("");
    const [aiMessage, setAiMessage] = useState("");

    const handleCheck = () => {
        if (medicine.toLowerCase() === "amoxicillin") {
            setAiMessage("⚠ Warning: Patient allergic to Penicillin group.");
        } else {
            setAiMessage("✅ No major issues detected.");
        }
    };

    return (
        <div className="card">
            <h3>New Prescription</h3>

            <input
                type="text"
                placeholder="Medicine Name"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
            />

            <button onClick={handleCheck}>Check Safety</button>

            {aiMessage && <p><strong>{aiMessage}</strong></p>}
        </div>
    );
}

export default PrescriptionForm;
