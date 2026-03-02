import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "../services/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    specialization: "",
    licenseNumber: "",
    hospitalName: "",
    contactInfo: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await onLogin({ username, password });
    } catch (apiError) {
      setError(apiError?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterInput = (key, value) => {
    setRegisterForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDoctorRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setRegisterLoading(true);

    try {
      await api.auth.registerDoctor(registerForm);
      setSuccess("Doctor account created successfully. You can now sign in.");
      setRegistering(false);
      setUsername(registerForm.username);
      setPassword("");
      setRegisterForm({
        username: "",
        password: "",
        email: "",
        name: "",
        specialization: "",
        licenseNumber: "",
        hospitalName: "",
        contactInfo: "",
      });
    } catch (apiError) {
      setError(apiError?.message || "Unable to create doctor account.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername("jaggie");
    setPassword("var@0923");
    setError("");
    setSuccess("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "40px", color: "white" }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}
          >
            🏥 Care++
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: "#cbd5e1", fontSize: "14px", margin: 0 }}
          >
            AI-Powered Clinical Decision System
          </motion.p>
        </div>

        {/* LOGIN CARD */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#e5e7eb", marginBottom: "8px" }}>Doctor Login</h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "30px" }}>
            Sign in to access patient records and consultations
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-danger"
              style={{ marginBottom: "20px" }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-success"
              style={{ marginBottom: "20px" }}
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL INPUT */}
            <div className="form-group">
              <label style={{ color: "#d1d5db" }}>Username</label>
              <div style={{ position: "relative" }}>
                <FiMail
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "12px",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: "40px" }}
                  required
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="form-group">
              <label style={{ color: "#d1d5db" }}>Password</label>
              <div style={{ position: "relative" }}>
                <FiLock
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "12px",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "12px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                fontSize: "12px",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1", cursor: "pointer" }}>
                <input type="checkbox" style={{ cursor: "pointer" }} />
                Remember me
              </label>
              <button
                type="button"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  transition: "0.3s",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "20px 0",
              color: "#9ca3af",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#334155" }}></div>
            <span style={{ fontSize: "12px" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#334155" }}></div>
          </div>

          {/* 2FA OPTION */}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => alert("Scan QR Code for 2FA")}
          >
            📱 Biometric Login
          </button>

          {/* DEMO CREDENTIALS SECTION */}
          <div
            style={{
              marginTop: "25px",
              padding: "16px",
              background: "rgba(96, 165, 250, 0.1)",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                fontSize: "12px",
                margin: "0 0 10px 0",
                color: "#60a5fa",
                textTransform: "uppercase",
              }}
            >
              📋 Demo Credentials
            </p>
            <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6", fontFamily: "monospace" }}>
              <p style={{ margin: "0 0 6px 0" }}>
                Username: <span style={{ color: "#60a5fa", fontWeight: 600 }}>jaggie</span>
              </p>
              <p style={{ margin: "0 0 12px 0" }}>
                Password: <span style={{ color: "#60a5fa", fontWeight: 600 }}>var@0923</span>
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fillDemoCredentials}
              style={{ width: "100%", justifyContent: "center", fontSize: "12px" }}
            >
              Auto-Fill Quick Login
            </button>
          </div>

          <div style={{ marginTop: "16px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => {
                setRegistering((prev) => !prev);
                setError("");
                setSuccess("");
              }}
            >
              {registering ? "Cancel Account Creation" : "Create Doctor Account"}
            </button>
          </div>

          {registering && (
            <form onSubmit={handleDoctorRegister} style={{ marginTop: "16px" }}>
              <div className="form-group">
                <label style={{ color: "#d1d5db" }}>Username</label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => handleRegisterInput("username", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: "#d1d5db" }}>Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => handleRegisterInput("password", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: "#d1d5db" }}>Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => handleRegisterInput("email", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: "#d1d5db" }}>Name</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => handleRegisterInput("name", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: "#d1d5db" }}>Specialization</label>
                <input
                  type="text"
                  value={registerForm.specialization}
                  onChange={(e) => handleRegisterInput("specialization", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: "#d1d5db" }}>License Number</label>
                <input
                  type="text"
                  value={registerForm.licenseNumber}
                  onChange={(e) => handleRegisterInput("licenseNumber", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: "#d1d5db" }}>Hospital Name</label>
                <input
                  type="text"
                  value={registerForm.hospitalName}
                  onChange={(e) => handleRegisterInput("hospitalName", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: "#d1d5db" }}>Contact Info</label>
                <input
                  type="text"
                  value={registerForm.contactInfo}
                  onChange={(e) => handleRegisterInput("contactInfo", e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={registerLoading}
              >
                {registerLoading ? "Creating Account..." : "Create Doctor Account"}
              </button>
            </form>
          )}
        </motion.div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#9ca3af",
            fontSize: "12px",
          }}
        >
          <p style={{ margin: "0 0 10px 0" }}>🔐 Healthcare-grade security with HIPAA compliance</p>
          <p style={{ margin: 0 }}>
            Questions? <button type="button" style={{ color: "#60a5fa", textDecoration: "none", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>Contact Support</button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
