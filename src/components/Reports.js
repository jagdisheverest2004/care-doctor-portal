import React from "react";
import samplePatient from "../data/samplePatient";

function Reports() {
    return (
        <div className="card">
            <h3>Previous Reports</h3>
            {samplePatient.reports.map((report, index) => (
                <p key={index}>
                    📄 {report.name}
                </p>
            ))}
        </div>
    );
}

export default Reports;
