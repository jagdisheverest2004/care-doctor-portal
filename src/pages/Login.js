import React, { useState } from "react";

function Login({ onLogin }) {
    const [doctorId, setDoctorId] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if (!doctorId || !password) {
            alert("Please fill all fields");
            return;
        }

        // Temporary static login
        if (doctorId === "doctor1" && password === "1234") {
            onLogin();
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Doctor Portal Login</h2>

                <input
                    type="text"
                    placeholder="Doctor ID"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
}

export default Login;
