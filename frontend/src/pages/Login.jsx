// ============================================================
// PragyanAI Student Verification Platform
// File: frontend/src/pages/Login.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


// ============================================================
// LOGIN PAGE
// ============================================================

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
    loading,
    authenticationChecked,
  } = useAuth();

  // ----------------------------------------------------------
  // FORM STATE
  // ----------------------------------------------------------

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ----------------------------------------------------------
  // UI STATE
  // ----------------------------------------------------------

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ----------------------------------------------------------
  // HANDLE ALREADY LOGGED-IN STUDENT
  // ----------------------------------------------------------

  useEffect(() => {
    if (
      authenticationChecked &&
      isAuthenticated
    ) {
      navigate("/student/dashboard", {
        replace: true,
      });
    }
  }, [
    authenticationChecked,
    isAuthenticated,
    navigate,
  ]);

  // ----------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------------------------------------

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear old messages when user starts typing
    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // ----------------------------------------------------------
  // VALIDATE FORM
  // ----------------------------------------------------------

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      return "Please enter your email address.";
    }

    if (!password) {
      return "Please enter your password.";
    }

    if (password.length < 1) {
      return "Please enter your password.";
    }

    return "";
  };

  // ----------------------------------------------------------
  // HANDLE LOGIN
  // ----------------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      // ------------------------------------------------------
      // LOGIN THROUGH AUTH CONTEXT
      // ------------------------------------------------------

      const result = await login(
        email,
        password
      );

      console.log(
        "Student login successful:",
        result
      );

      setSuccess(
        "Login successful. Redirecting..."
      );

      // ------------------------------------------------------
      // SUPPORT RETURN URL
      // ------------------------------------------------------

      const from =
        location.state?.from?.pathname ||
        "/student/dashboard";

      setTimeout(() => {
        navigate(from, {
          replace: true,
        });
      }, 300);

    } catch (err) {
      console.error(
        "Student login error:",
        err
      );

      let message =
        "Unable to login. Please try again.";

      // ------------------------------------------------------
      // AXIOS / BACKEND ERROR
      // ------------------------------------------------------

      if (err?.response) {
        const status =
          err.response.status;

        const detail =
          err.response.data?.detail;

        if (typeof detail === "string") {
          message = detail;
        } else if (
          Array.isArray(detail)
        ) {
          message = detail
            .map((item) => {
              if (
                typeof item === "string"
              ) {
                return item;
              }

              if (item?.msg) {
                return item.msg;
              }

              return "Invalid request.";
            })
            .join(", ");
        } else if (
          err.response.data?.message
        ) {
          message =
            err.response.data.message;
        }

        // ----------------------------------------------------
        // SPECIFIC HTTP STATUS MESSAGES
        // ----------------------------------------------------

        if (
          status === 401 &&
          !detail
        ) {
          message =
            "Invalid email or password.";
        }

        if (
          status === 403 &&
          !detail
        ) {
          message =
            "Your account is not allowed to login yet.";
        }

        if (status === 422) {
          message =
            "Please enter a valid email address and password.";
        }

        if (status >= 500) {
          message =
            "Server error. Please try again later.";
        }

      } else if (err?.request) {
        message =
          "Unable to connect to the server. Please check your internet connection and try again.";

      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    }
  };

  // ----------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------

  if (!authenticationChecked) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-loading">
              Checking authentication...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-card">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="auth-header">

            <div className="auth-logo">
              🎓
            </div>

            <h1>
              Student Login
            </h1>

            <p>
              Login using your registered
              email address and password.
            </p>

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              className="auth-message auth-error"
              role="alert"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ==================================================
              SUCCESS
          ================================================== */}

          {success && (
            <div
              className="auth-message auth-success"
              role="status"
            >
              <span>✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* ==================================================
              LOGIN FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
            noValidate
          >

            {/* =================================================
                EMAIL
            ================================================= */}

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
                placeholder="student@gmail.com"
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

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
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner">
                    ⏳
                  </span>

                  Signing in...
                </>
              ) : (
                <>
                  🔐 Sign In
                </>
              )}

            </button>

          </form>

          {/* ==================================================
              REGISTRATION LINK
          ================================================== */}

          <div className="auth-footer">

            <p>
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="auth-link"
            >
              Create Student Account
            </Link>

          </div>

          {/* ==================================================
              HOME LINK
          ================================================== */}

          <div className="auth-home-link">

            <Link to="/">
              ← Back to Home
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
