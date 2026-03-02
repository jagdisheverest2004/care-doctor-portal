import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Demo credentials
  const DEMO_EMAIL = "dr.kailash@careplus.com";
  const DEMO_PASSWORD = "Demo@2026";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate credentials
    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        onLogin();
      } else {
        setError("Invalid email or password. Use demo credentials below.");
      }
      setLoading(false);
    }, 800);
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
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
            Sign in to access patient records
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

          <form onSubmit={handleSubmit}>
            {/* EMAIL INPUT */}
            <div className="form-group">
              <label style={{ color: "#d1d5db" }}>Medical ID or Email</label>
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
                  type="email"
                  placeholder="dr.kailash@careplus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <a
                href="#"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  transition: "0.3s",
                }}
              >
                Forgot password?
              </a>
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
                Email: <span style={{ color: "#60a5fa", fontWeight: 600 }}>dr.kailash@careplus.com</span>
              </p>
              <p style={{ margin: "0 0 12px 0" }}>
                Password: <span style={{ color: "#60a5fa", fontWeight: 600 }}>Demo@2026</span>
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fillDemoCredentials}
              style={{ width: "100%", justifyContent: "center", fontSize: "12px" }}
            >
              Auto-Fill Demo Credentials
            </button>
          </div>
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
            Questions? <a href="#" style={{ color: "#60a5fa", textDecoration: "none" }}>Contact Support</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
