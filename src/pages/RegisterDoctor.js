import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../services/api";

const REGISTER_FIELDS = [
  {
    key: "username",
    label: "Username",
    type: "text",
    placeholder: "Choose a unique username (e.g., dr_kailash)",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "Minimum 8 chars with upper, lower, number, symbol",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter official email (e.g., doctor@hospital.com)",
  },
  {
    key: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter full name as per medical registration",
  },
  {
    key: "specialization",
    label: "Specialization",
    type: "text",
    placeholder: "Enter specialization (e.g., Cardiology)",
  },
  {
    key: "licenseNumber",
    label: "License Number",
    type: "text",
    placeholder: "Enter valid medical license number",
  },
  {
    key: "hospitalName",
    label: "Hospital Name",
    type: "text",
    placeholder: "Enter current hospital/clinic name",
  },
  {
    key: "contactInfo",
    label: "Contact Info",
    type: "text",
    placeholder: "Enter phone number or contact email",
  },
];

function validateField(fieldKey, fieldValue) {
  const value = String(fieldValue || "").trim();

  if (!value) {
    return "This field is required.";
  }

  if (fieldKey === "username") {
    if (!/^[a-zA-Z0-9_.]{4,30}$/.test(value)) {
      return "Use 4-30 chars: letters, numbers, underscore or dot.";
    }
  }

  if (fieldKey === "password") {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value)) {
      return "Password must include upper, lower, number and symbol (min 8).";
    }
  }

  if (fieldKey === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address.";
    }
  }

  if (fieldKey === "name") {
    if (!/^[a-zA-Z\s.'-]{2,60}$/.test(value)) {
      return "Enter a valid full name (2-60 characters).";
    }
  }

  if (fieldKey === "specialization") {
    if (value.length < 2 || value.length > 80) {
      return "Specialization should be between 2 and 80 characters.";
    }
  }

  if (fieldKey === "licenseNumber") {
    if (!/^[a-zA-Z0-9-]{5,30}$/.test(value)) {
      return "License number should be 5-30 chars (letters, numbers, hyphen).";
    }
  }

  if (fieldKey === "hospitalName") {
    if (value.length < 2 || value.length > 120) {
      return "Hospital name should be between 2 and 120 characters.";
    }
  }

  if (fieldKey === "contactInfo") {
    if (!/^(\+?[0-9\s-]{8,20}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(value)) {
      return "Enter a valid phone number or contact email.";
    }
  }

  return "";
}

function validateRegisterForm(registerForm) {
  const nextErrors = {};
  REGISTER_FIELDS.forEach((field) => {
    const fieldError = validateField(field.key, registerForm[field.key]);
    if (fieldError) {
      nextErrors[field.key] = fieldError;
    }
  });
  return nextErrors;
}

function getPasswordStrength(passwordValue) {
  const value = String(passwordValue || "");
  if (!value) {
    return { label: "", score: 0, levelClass: "" };
  }

  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z\d]/.test(value)) score += 1;

  if (score <= 1) {
    return { label: "Weak", score, levelClass: "weak" };
  }
  if (score <= 3) {
    return { label: "Medium", score, levelClass: "medium" };
  }
  return { label: "Strong", score, levelClass: "strong" };
}

function RegisterDoctorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

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

  const passwordStrength = getPasswordStrength(registerForm.password);

  const handleRegisterInput = (key, value) => {
    setRegisterForm((prev) => {
      const nextForm = { ...prev, [key]: value };
      if (touchedFields[key]) {
        setFieldErrors((previousErrors) => ({
          ...previousErrors,
          [key]: validateField(key, value),
        }));
      }
      return nextForm;
    });
  };

  const handleFieldBlur = (key) => {
    setTouchedFields((previousValue) => ({ ...previousValue, [key]: true }));
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [key]: validateField(key, registerForm[key]),
    }));
  };

  const handleDoctorRegister = async (event) => {
    event.preventDefault();
    setError("");

    const validationErrors = validateRegisterForm(registerForm);
    setFieldErrors(validationErrors);
    setTouchedFields(
      REGISTER_FIELDS.reduce((accumulator, field) => ({ ...accumulator, [field.key]: true }), {})
    );

    if (Object.values(validationErrors).some(Boolean)) {
      setError("Please correct the highlighted fields before submitting.");
      return;
    }

    setLoading(true);

    try {
      await api.auth.registerDoctor(registerForm);
      navigate("/login", {
        replace: true,
        state: { accountCreated: true, username: registerForm.username },
      });
    } catch (apiError) {
      setError(apiError?.message || "Unable to create doctor account.");
    } finally {
      setLoading(false);
    }
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
        style={{ width: "100%", maxWidth: "760px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px", color: "white" }}>
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
            Doctor Account Registration
          </motion.p>
        </div>

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
          <h2 style={{ color: "#e5e7eb", marginBottom: "8px" }}>Create Doctor Account</h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "24px" }}>
            Register once, then use login to access the portal.
          </p>

          <p style={{ marginBottom: "18px" }}>
            <Link
              to="/login"
              style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}
            >
              Already have an account? Sign In
            </Link>
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

          <form onSubmit={handleDoctorRegister}>
            <div className="grid-2 register-grid-compact">
              {REGISTER_FIELDS.map((field) => {
                const hasError = Boolean(touchedFields[field.key] && fieldErrors[field.key]);
                const isPasswordField = field.key === "password";
                return (
                  <div className="form-group" key={field.key} style={{ marginBottom: "14px" }}>
                    <label style={{ color: "#d1d5db" }}>{field.label}</label>
                    <input
                      type={field.type}
                      value={registerForm[field.key]}
                      onChange={(event) => handleRegisterInput(field.key, event.target.value)}
                      onBlur={() => handleFieldBlur(field.key)}
                      placeholder={field.placeholder}
                      required
                      aria-invalid={hasError}
                      style={hasError ? { borderColor: "#ef4444" } : undefined}
                    />
                    {hasError ? (
                      <small className="field-error-text">{fieldErrors[field.key]}</small>
                    ) : null}

                    {isPasswordField && passwordStrength.label ? (
                      <div className="password-strength-wrap">
                        <div className="password-strength-track">
                          <div
                            className={`password-strength-fill ${passwordStrength.levelClass}`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                        <small className={`password-strength-text ${passwordStrength.levelClass}`}>
                          Strength: {passwordStrength.label}
                        </small>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Doctor Account"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RegisterDoctorPage;
