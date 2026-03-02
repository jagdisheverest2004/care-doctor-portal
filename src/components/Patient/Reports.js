import samplePatient from "../../data/samplePatient";

function Reports() {
    return (
        <div className="card">
            <h2>Previous Reports</h2>
            {samplePatient.reports.map((report, index) => (
                <p key={index}>📄 {report.name}</p>
            ))}
        </div>
    );
}

export default Reports;
