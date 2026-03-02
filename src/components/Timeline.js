import React from "react";
import samplePatient from "../data/samplePatient";

function Timeline() {
    return (
        <div className="card">
            <h3>Medical Timeline</h3>
            {samplePatient.timeline.map((item, index) => (
                <div key={index} className="timeline-item">
                    <strong>{item.date}</strong>
                    <p>{item.event}</p>
                </div>
            ))}
        </div>
    );
}

export default Timeline;
