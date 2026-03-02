import React, { useState } from "react";

function AIAgent() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="ai-agent" onClick={() => setOpen(!open)}>🤖</div>
            {open && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>AI Clinical Assistant</h3>
                        <p>Hello Doctor 👨‍⚕️</p>
                        <p>How may I assist you?</p>
                        <button onClick={() => setOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AIAgent;
