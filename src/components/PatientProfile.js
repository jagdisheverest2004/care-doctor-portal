import React from "react";
import samplePatient from "../data/samplePatient";
import Timeline from "./Timeline";
import Reports from "./Reports";

function PatientProfile() {
    return (
        <>
            <div className="card">
                <h3>Patient Details</h3>
                <p>Name: {samplePatient.name}</p>
                <p>Age: {samplePatient.age}</p>
                <p>Blood Group: {samplePatient.bloodGroup}</p>
                <p>Allergies: {samplePatient.allergies}</p>
            </div>

            <div className="card">
                <h3>BP History</h3>
                {samplePatient.bpHistory.map((bp, index) => (
                    <p key={index}>{bp.date} - {bp.value}</p>
                ))}
            </div>

            <div className="card">
                <h3>Blood Sugar History</h3>
                {samplePatient.sugarHistory.map((sugar, index) => (
                    <p key={index}>{sugar.date} - {sugar.value}</p>
                ))}
            </div>

            <Timeline />
            <Reports />
        </>
    );
}

export default PatientProfile;
