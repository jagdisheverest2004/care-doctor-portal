import samplePatient from "../../data/samplePatient";

function Timeline() {
    return (
        <div className="card">
            <h2>Medical Timeline</h2>
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
