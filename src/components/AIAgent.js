import React, { useState } from "react";

function AIAgent() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState(["Hello Doctor 👨‍⚕️"]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input) return;

        let response = "Reviewing patient data...";
        if (input.toLowerCase().includes("interaction")) {
            response = "⚠ Detected possible drug interaction in patient P1001: Aspirin + Warfarin (High Bleeding Risk).";
        }
        if (input.toLowerCase().includes("summary")) {
            response = "📋 Patient P1001 Summary: John Doe, 65y/o, O+, Hypertension on Warfarin. Critical Allergy: Penicillin.";
        }

        setMessages([...messages, "You: " + input, "AI: " + response]);
        setInput("");
    };

    return (
        <>
            {open && (
                <div className="ai-chat">
                    <div className="ai-header">
                        AI Clinical Assistant
                        <span style={{ float: "right", cursor: "pointer" }} onClick={() => setOpen(false)}>X</span>
                    </div>
                    <div className="ai-body">
                        {messages.map((msg, i) => (
                            <div key={i}>{msg}</div>
                        ))}
                    </div>
                    <div className="ai-input">
                        <input value={input} onChange={(e) => setInput(e.target.value)} />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}

            {!open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        background: "#0077b6",
                        color: "white",
                        padding: "15px",
                        borderRadius: "50%",
                        cursor: "pointer"
                    }}
                    onClick={() => setOpen(true)}
                >
                    🤖
                </div>
            )}
        </>
    );
}

export default AIAgent;
