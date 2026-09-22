import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { validateRegistrationForm } from "../utils/validators";

function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    college_name: "",
    degree: "",
    branch: "",
    tenth_cgpa: "",
    twelfth_cgpa: "",
    be_cgpa: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/student/dashboard", { replace: true });
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

    const validationErrors = validateRegistrationForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        full_name: formData.full_name.trim(),
        college_name: formData.college_name.trim(),
        degree: formData.degree.trim(),
        branch: formData.branch.trim(),
        tenth_cgpa:
          formData.tenth_cgpa === ""
            ? null
            : Number(formData.tenth_cgpa),
        twelfth_cgpa:
          formData.twelfth_cgpa === ""
            ? null
            : Number(formData.twelfth_cgpa),
        be_cgpa:
          formData.be_cgpa === ""
            ? null
            : Number(formData.be_cgpa),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await register(payload);

      if (response) {
        navigate("/verify-email", {
          state: {
            email:
              response.email ||
              payload.email,
            phone:
              response.phone ||
              payload.phone,
            studentId: response.student_id,
          },
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Registration failed. Please try again.";

      setServerError(
        Array.isArray(message)
          ? message.map((item) => item.msg).join(", ")
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-header">
          <span className="auth-badge">🎓 Student Registration</span>

          <h1>Create Your Student Account</h1>

          <p>
            Register with your academic details and verify your email and
            mobile number.
          </p>
        </div>

        {serverError && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-title">
              <span>👤</span>
              <div>
                <h3>Personal Information</h3>
                <p>Enter your basic details.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="full_name">
                  Full Name <span>*</span>
                </label>

                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className={errors.full_name ? "input-error" : ""}
                />

                {errors.full_name && (
                  <small className="field-error">
                    {errors.full_name}
                  </small>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="college_name">
                  College Name <span>*</span>
                </label>

                <input
                  id="college_name"
                  name="college_name"
                  type="text"
                  value={formData.college_name}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                  className={errors.college_name ? "input-error" : ""}
                />

                {errors.college_name && (
                  <small className="field-error">
                    {errors.college_name}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="degree">
                  Degree <span>*</span>
                </label>

                <input
                  id="degree"
                  name="degree"
                  type="text"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. BE / BTech"
                  className={errors.degree ? "input-error" : ""}
                />

                {errors.degree && (
                  <small className="field-error">
                    {errors.degree}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="branch">
                  Branch <span>*</span>
                </label>

                <input
                  id="branch"
                  name="branch"
                  type="text"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g. CSE / ISE / AIML"
                  className={errors.branch ? "input-error" : ""}
                />

                {errors.branch && (
                  <small className="field-error">
                    {errors.branch}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <span>📊</span>
              <div>
                <h3>Academic Information</h3>
                <p>Enter your academic performance.</p>
              </div>
            </div>

            <div className="form-grid three-columns">
              <div className="form-group">
                <label htmlFor="tenth_cgpa">10th CGPA</label>

                <input
                  id="tenth_cgpa"
                  name="tenth_cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={formData.tenth_cgpa}
                  onChange={handleChange}
                  placeholder="0.00 - 10.00"
                  className={errors.tenth_cgpa ? "input-error" : ""}
                />

                {errors.tenth_cgpa && (
                  <small className="field-error">
                    {errors.tenth_cgpa}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="twelfth_cgpa">12th CGPA</label>

                <input
                  id="twelfth_cgpa"
                  name="twelfth_cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={formData.twelfth_cgpa}
                  onChange={handleChange}
                  placeholder="0.00 - 10.00"
                  className={errors.twelfth_cgpa ? "input-error" : ""}
                />

                {errors.twelfth_cgpa && (
                  <small className="field-error">
                    {errors.twelfth_cgpa}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="be_cgpa">BE / BTech CGPA</label>

                <input
                  id="be_cgpa"
                  name="be_cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={formData.be_cgpa}
                  onChange={handleChange}
                  placeholder="0.00 - 10.00"
                  className={errors.be_cgpa ? "input-error" : ""}
                />

                {errors.be_cgpa && (
                  <small className="field-error">
                    {errors.be_cgpa}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <span>📱</span>
              <div>
                <h3>Contact &amp; Login</h3>
                <p>These details will be used for verification and login.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="phone">
                  Mobile Number <span>*</span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91XXXXXXXXXX"
                  autoComplete="tel"
                  className={errors.phone ? "input-error" : ""}
                />

                {errors.phone && (
                  <small className="field-error">
                    {errors.phone}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  autoComplete="email"
                  className={errors.email ? "input-error" : ""}
                />

                {errors.email && (
                  <small className="field-error">
                    {errors.email}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password <span>*</span>
                </label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    className={errors.password ? "input-error" : ""}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
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

              <div className="form-group">
                <label htmlFor="confirm_password">
                  Confirm Password <span>*</span>
                </label>

                <div className="password-wrapper">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={
                      errors.confirm_password
                        ? "input-error"
                        : ""
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.confirm_password && (
                  <small className="field-error">
                    {errors.confirm_password}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="verification-notice">
            <span>🔐</span>

            <div>
              <strong>Verification Required</strong>

              <p>
                After registration, you will receive an OTP on your email
                and mobile number.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Student Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Student Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
