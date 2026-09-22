import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

function StudentProfile() {
  const {
    student,
    loading,
    updateStudent,
    refreshStudent,
  } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    college_name: "",
    degree: "",
    branch: "",
    tenth_cgpa: "",
    twelfth_cgpa: "",
    be_cgpa: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.full_name || "",
        college_name: student.college_name || "",
        degree: student.degree || "",
        branch: student.branch || "",
        tenth_cgpa:
          student.tenth_cgpa ?? "",
        twelfth_cgpa:
          student.twelfth_cgpa ?? "",
        be_cgpa:
          student.be_cgpa ?? "",
        phone: student.phone || "",
      });
    }
  }, [student]);

  if (loading || !student) {
    return (
      <div className="page-loading">
        <LoadingSpinner />
        <p>Loading your profile...</p>
      </div>
    );
  }

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

    setError("");
    setMessage("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.full_name.trim()) {
      nextErrors.full_name =
        "Full name is required.";
    }

    if (!formData.college_name.trim()) {
      nextErrors.college_name =
        "College name is required.";
    }

    if (!formData.degree.trim()) {
      nextErrors.degree =
        "Degree is required.";
    }

    if (!formData.branch.trim()) {
      nextErrors.branch =
        "Branch is required.";
    }

    const cgpaFields = [
      "tenth_cgpa",
      "twelfth_cgpa",
      "be_cgpa",
    ];

    cgpaFields.forEach((field) => {
      if (
        formData[field] !== "" &&
        (
          Number(formData[field]) < 0 ||
          Number(formData[field]) > 10
        )
      ) {
        nextErrors[field] =
          "CGPA must be between 0 and 10.";
      }
    });

    if (!formData.phone.trim()) {
      nextErrors.phone =
        "Phone number is required.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);

      await updateStudent({
        full_name:
          formData.full_name.trim(),
        college_name:
          formData.college_name.trim(),
        degree:
          formData.degree.trim(),
        branch:
          formData.branch.trim(),
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
        phone:
          formData.phone.trim(),
      });

      await refreshStudent();

      setMessage(
        "Profile updated successfully."
      );
    } catch (errorObject) {
      const detail =
        errorObject?.response?.data?.detail;

      setError(
        Array.isArray(detail)
          ? detail.map((item) => item.msg).join(", ")
          : detail ||
              errorObject?.message ||
              "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="student-profile-page">
      <div className="dashboard-container">
        <div className="profile-page-header">
          <div>
            <span className="dashboard-eyebrow">
              👤 Student Profile
            </span>

            <h1>My Profile</h1>

            <p>
              View and manage your student information.
            </p>
          </div>

          <StatusBadge
            status={student.approval_status}
          />
        </div>

        {message && (
          <div className="success-message">
            <span>✓</span>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="profile-page-grid">
          <aside className="profile-sidebar dashboard-card">
            <div className="large-profile-avatar">
              {student.full_name
                ?.charAt(0)
                ?.toUpperCase() || "S"}
            </div>

            <h2>{student.full_name}</h2>

            <p>{student.email}</p>

            <div className="profile-id">
              Student ID: {student.id}
            </div>

            <div className="profile-verification-list">
              <div>
                <span>📧 Email</span>

                <StatusBadge
                  status={
                    student.email_verified
                      ? "VERIFIED"
                      : "PENDING"
                  }
                />
              </div>

              <div>
                <span>📱 Phone</span>

                <StatusBadge
                  status={
                    student.phone_verified
                      ? "VERIFIED"
                      : "PENDING"
                  }
                />
              </div>
            </div>
          </aside>

          <main className="dashboard-card profile-form-card">
            <div className="dashboard-card-header">
              <div>
                <span className="card-eyebrow">
                  Account Information
                </span>

                <h2>Edit Profile</h2>
              </div>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="full_name">
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={
                      errors.full_name
                        ? "input-error"
                        : ""
                    }
                  />

                  {errors.full_name && (
                    <small className="field-error">
                      {errors.full_name}
                    </small>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="college_name">
                    College Name
                  </label>

                  <input
                    id="college_name"
                    name="college_name"
                    value={
                      formData.college_name
                    }
                    onChange={handleChange}
                    className={
                      errors.college_name
                        ? "input-error"
                        : ""
                    }
                  />

                  {errors.college_name && (
                    <small className="field-error">
                      {errors.college_name}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="degree">
                    Degree
                  </label>

                  <input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className={
                      errors.degree
                        ? "input-error"
                        : ""
                    }
                  />

                  {errors.degree && (
                    <small className="field-error">
                      {errors.degree}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="branch">
                    Branch
                  </label>

                  <input
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={
                      errors.branch
                        ? "input-error"
                        : ""
                    }
                  />

                  {errors.branch && (
                    <small className="field-error">
                      {errors.branch}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Mobile Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={
                      errors.phone
                        ? "input-error"
                        : ""
                    }
                  />

                  {errors.phone && (
                    <small className="field-error">
                      {errors.phone}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    value={student.email || ""}
                    disabled
                  />

                  <small className="field-help">
                    Email cannot be changed from
                    this screen.
                  </small>
                </div>
              </div>

              <div className="form-section-divider">
                <h3>Academic Information</h3>
              </div>

              <div className="form-grid three-columns">
                <div className="form-group">
                  <label htmlFor="tenth_cgpa">
                    10th CGPA
                  </label>

                  <input
                    id="tenth_cgpa"
                    name="tenth_cgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={formData.tenth_cgpa}
                    onChange={handleChange}
                    className={
                      errors.tenth_cgpa
                        ? "input-error"
                        : ""
                    }
                  />

                  {errors.tenth_cgpa && (
                    <small className="field-error">
                      {errors.tenth_cgpa}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="twelfth_cgpa">
                    12th CGPA
                  </label>

                  <input
                    id="twelfth_cgpa"
                    name="twelfth_cgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={
                      formData.twelfth_cgpa
                    }
                    onChange={handleChange}
                    className={
                      errors.twelfth_cgpa
                        ? "input-error"
                        : ""
                    }
                  />

                  {errors.twelfth_cgpa && (
                    <small className="field-error">
                      {errors.twelfth_cgpa}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="be_cgpa">
                    BE / BTech CGPA
                  </label>

                  <input
                    id="be_cgpa"
                    name="be_cgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={formData.be_cgpa}
                    onChange={handleChange}
                    className={
                      errors.be_cgpa
                        ? "input-error"
                        : ""
                    }
                  />

                  {errors.be_cgpa && (
                    <small className="field-error">
                      {errors.be_cgpa}
                    </small>
                  )}
                </div>
              </div>

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
