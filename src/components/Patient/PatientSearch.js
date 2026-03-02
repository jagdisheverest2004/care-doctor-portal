import React, { useState } from "react";
import PatientProfile from "./PatientProfile";

function PatientSearch() {
    const [id, setId] = useState("");
    const [show, setShow] = useState(false);

    const search = () => {
        if (id === "P1001") setShow(true);
        else alert("Patient Not Found");
    };

    return (
        <>
            <div className="card">
                <input
                    placeholder="Enter Patient ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <button className="primary" onClick={search}>
                    Search
                </button>
            </div>

            {show && <PatientProfile />}
        </>
    );
}

export default PatientSearch;
