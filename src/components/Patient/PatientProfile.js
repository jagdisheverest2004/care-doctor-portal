import samplePatient from "../../data/samplePatient";
import Timeline from "./Timeline";
import Reports from "./Reports";

function PatientProfile() {
    return (
        <>
            <div className="card">
                <h2>Patient Details</h2>
                <p>Name: {samplePatient.name}</p>
                <p>Age: {samplePatient.age}</p>
                <p>Blood Group: {samplePatient.bloodGroup}</p>
                <p>Allergies: {samplePatient.allergies}</p>
            </div>

            <div className="card">
                <h2>Vital History</h2>
                {samplePatient.bpHistory.map((bp, i) => (
                    <p key={i}>{bp.date} - BP: {bp.value}</p>
                ))}
            </div>

            <Timeline />
            <Reports />
        </>
    );
}

export default PatientProfile;
