import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

function StudentDashboard() {
  const {
    student,
    loading,
    refreshStudent,
  } = useAuth();

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {
    if (!student) {
      refreshStudent();
    }
  }, [student, refreshStudent]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshStudent();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="page-loading">
        <LoadingSpinner />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const fullyVerified =
    Boolean(student.email_verified) &&
    Boolean(student.phone_verified);

  const approved =
    student.approval_status === "APPROVED";

  const rejected =
    student.approval_status === "REJECTED";

  return (
    <div className="student-dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              🎓 Student Portal
            </span>

            <h1>
              Welcome,{" "}
              {student.full_name || "Student"}!
            </h1>

            <p>
              Manage your PragyanAI student profile
              and verification status.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>
        </section>

        {approved && fullyVerified && (
          <div className="dashboard-alert success">
            <span>🎉</span>

            <div>
              <strong>
                Your account is approved!
              </strong>

              <p>
                Your email and phone have been
                verified successfully.
              </p>
            </div>
          </div>
        )}

        {!approved &&
          !rejected &&
          fullyVerified && (
            <div className="dashboard-alert warning">
              <span>⏳</span>

              <div>
                <strong>
                  Verification completed
                </strong>

                <p>
                  Your profile is waiting for
                  administrator approval.
                </p>
              </div>
            </div>
          )}

        {rejected && (
          <div className="dashboard-alert danger">
            <span>⚠️</span>

            <div>
              <strong>
                Application requires attention
              </strong>

              <p>
                {student.rejection_reason ||
                  "Please contact the administration for more information."}
              </p>
            </div>
          </div>
        )}

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span className="stat-icon">📧</span>

            <div>
              <span>Email Verification</span>

              <strong>
                {student.email_verified
                  ? "Verified"
                  : "Pending"}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-icon">📱</span>

            <div>
              <span>Phone Verification</span>

              <strong>
                {student.phone_verified
                  ? "Verified"
                  : "Pending"}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span className="stat-icon">🛡️</span>

            <div>
              <span>Approval Status</span>

              <strong>
                <StatusBadge
                  status={
                    student.approval_status
                  }
                />
              </strong>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card profile-summary-card">
            <div className="dashboard-card-header">
              <div>
                <span className="card-eyebrow">
                  Profile
                </span>

                <h2>Student Information</h2>
              </div>

              <Link
                to="/student/profile"
                className="btn btn-outline btn-sm"
              >
                Edit Profile
              </Link>
            </div>

            <div className="profile-summary">
              <div className="profile-avatar">
                {student.full_name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}
              </div>

              <div>
                <h3>{student.full_name}</h3>

                <p>{student.email}</p>

                <span>
                  Student ID:{" "}
                  {student.id}
                </span>
              </div>
            </div>

            <div className="info-list">
              <div>
                <span>College</span>
                <strong>
                  {student.college_name || "-"}
                </strong>
              </div>

              <div>
                <span>Degree</span>
                <strong>
                  {student.degree || "-"}
                </strong>
              </div>

              <div>
                <span>Branch</span>
                <strong>
                  {student.branch || "-"}
                </strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {student.phone || "-"}
                </strong>
              </div>
            </div>
          </div>

          <div className="dashboard-card verification-card">
            <div className="dashboard-card-header">
              <div>
                <span className="card-eyebrow">
                  Security
                </span>

                <h2>Verification</h2>
              </div>
            </div>

            <div className="verification-status-list">
              <div className="verification-status-item">
                <div className="verification-status-icon">
                  📧
                </div>

                <div>
                  <strong>
                    Email Address
                  </strong>

                  <span>
                    {student.email}
                  </span>
                </div>

                <StatusBadge
                  status={
                    student.email_verified
                      ? "VERIFIED"
                      : "PENDING"
                  }
                />
              </div>

              <div className="verification-status-item">
                <div className="verification-status-icon">
                  📱
                </div>

                <div>
                  <strong>
                    Mobile Number
                  </strong>

                  <span>
                    {student.phone}
                  </span>
                </div>

                <StatusBadge
                  status={
                    student.phone_verified
                      ? "VERIFIED"
                      : "PENDING"
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card academic-card">
          <div className="dashboard-card-header">
            <div>
              <span className="card-eyebrow">
                Academics
              </span>

              <h2>Academic Performance</h2>
            </div>

            <Link
              to="/student/profile"
              className="btn btn-outline btn-sm"
            >
              View Profile
            </Link>
          </div>

          <div className="academic-grid">
            <div className="academic-item">
              <span>10th CGPA</span>
              <strong>
                {student.tenth_cgpa ?? "-"}
              </strong>
            </div>

            <div className="academic-item">
              <span>12th CGPA</span>
              <strong>
                {student.twelfth_cgpa ?? "-"}
              </strong>
            </div>

            <div className="academic-item">
              <span>BE / BTech CGPA</span>
              <strong>
                {student.be_cgpa ?? "-"}
              </strong>
            </div>
          </div>
        </section>

        <section className="dashboard-card next-steps-card">
          <div className="dashboard-card-header">
            <div>
              <span className="card-eyebrow">
                Next Steps
              </span>

              <h2>Your Journey</h2>
            </div>
          </div>

          <div className="journey-timeline">
            <div className="journey-item completed">
              <span className="journey-icon">
                ✓
              </span>

              <div>
                <strong>
                  Registration
                </strong>

                <p>
                  Student account created.
                </p>
              </div>
            </div>

            <div
              className={`journey-item ${
                student.email_verified
                  ? "completed"
                  : ""
              }`}
            >
              <span className="journey-icon">
                {student.email_verified
                  ? "✓"
                  : "2"}
              </span>

              <div>
                <strong>
                  Email Verification
                </strong>

                <p>
                  Verify your registered
                  email address.
                </p>
              </div>
            </div>

            <div
              className={`journey-item ${
                student.phone_verified
                  ? "completed"
                  : ""
              }`}
            >
              <span className="journey-icon">
                {student.phone_verified
                  ? "✓"
                  : "3"}
              </span>

              <div>
                <strong>
                  Phone Verification
                </strong>

                <p>
                  Verify your mobile number.
                </p>
              </div>
            </div>

            <div
              className={`journey-item ${
                approved ? "completed" : ""
              }`}
            >
              <span className="journey-icon">
                {approved ? "✓" : "4"}
              </span>

              <div>
                <strong>
                  Admin Approval
                </strong>

                <p>
                  Administrator reviews your
                  application.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;
