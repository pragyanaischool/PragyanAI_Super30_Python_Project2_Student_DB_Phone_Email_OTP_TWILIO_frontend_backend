import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAdmin } from "../context/AdminContext";
import { validateAdminLoginForm } from "../utils/validators";

function AdminLogin() {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
  } = useAdmin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", {
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

    const validationErrors =
      validateAdminLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setServerError("");

      await login(
        formData.email.trim().toLowerCase(),
        formData.password
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (errorObject) {
      const detail =
        errorObject?.response?.data?.detail;

      setServerError(
        Array.isArray(detail)
          ? detail.map((item) => item.msg).join(", ")
          : detail ||
              errorObject?.message ||
              "Invalid administrator email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-brand">
          <div className="admin-logo">🛡️</div>

          <span>PRAGYANAI</span>
        </div>

        <div className="admin-login-header">
          <span className="admin-badge">
            Administrator Portal
          </span>

          <h1>Admin Login</h1>

          <p>
            Sign in to manage student registrations,
            verification and approvals.
          </p>
        </div>

        {serverError && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">
              Administrator Email
            </label>

            <div className="input-with-icon">
              <span>📧</span>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="username"
                className={
                  errors.email
                    ? "input-error"
                    : ""
                }
              />
            </div>

            {errors.email && (
              <small className="field-error">
                {errors.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="input-with-icon password-wrapper">
              <span>🔐</span>

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
                placeholder="Enter administrator password"
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
              ? "Signing in..."
              : "Sign In to Admin Portal"}
          </button>
        </form>

        <div className="admin-security-note">
          <span>🔒</span>

          <div>
            <strong>Secure Administrator Access</strong>

            <p>
              This area is restricted to authorized
              PragyanAI administrators.
            </p>
          </div>
        </div>

        <div className="admin-login-footer">
          <Link to="/">
            ← Back to Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
