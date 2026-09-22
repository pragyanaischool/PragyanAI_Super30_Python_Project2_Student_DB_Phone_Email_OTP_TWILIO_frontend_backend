import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { validateLoginForm } from "../utils/validators";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.registrationCompleted
      ? "Registration and verification completed. Please login."
      : ""
  );

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/student/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    const validationErrors =
      validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await login(
        formData.email.trim().toLowerCase(),
        formData.password
      );

      navigate("/student/dashboard", {
        replace: true,
      });
    } catch (errorObject) {
      const detail =
        errorObject?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setServerError(
          detail
            .map((item) => item?.msg)
            .join(", ")
        );
      } else {
        setServerError(
          detail ||
            errorObject?.message ||
            "Invalid email or password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-container">
        <div className="auth-header">
          <div className="login-icon">🎓</div>

          <span className="auth-badge">
            Student Portal
          </span>

          <h1>Student Login</h1>

          <p>
            Login using your registered email address
            and password.
          </p>
        </div>

        {successMessage && (
          <div className="success-message">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {serverError && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">
              📧 Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter registered email"
              autoComplete="email"
              className={
                errors.email ? "input-error" : ""
              }
            />

            {errors.email && (
              <small className="field-error">
                {errors.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              🔐 Password
            </label>

            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={
                  errors.password
                    ? "input-error"
                    : ""
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {errors.password && (
              <small className="field-error">
                {errors.password}
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <div className="login-security-note">
          <span>🔒</span>

          <p>
            Your account is protected using secure
            authentication.
          </p>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Register as Student
            </Link>
          </p>
        </div>

        <div className="admin-login-link">
          <Link to="/admin/login">
            Administrator Login →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
