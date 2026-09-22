import React from "react";
import StatusBadge from "./StatusBadge";

function StudentCard({
  student,
  onView,
  onApprove,
  onReject,
  showActions = false,
}) {
  if (!student) {
    return null;
  }

  const {
    id,
    full_name,
    email,
    phone,
    college_name,
    degree,
    branch,
    tenth_cgpa,
    twelfth_cgpa,
    be_cgpa,
    email_verified,
    phone_verified,
    approval_status,
    created_at,
  } = student;

  return (
    <article className="student-card">

      {/* Header */}
      <div className="student-card-header">
        <div className="student-avatar">
          {full_name
            ?.charAt(0)
            ?.toUpperCase() || "S"}
        </div>

        <div className="student-card-title">
          <h3>
            {full_name || "Student"}
          </h3>

          <p>
            Student ID:{" "}
            <strong>
              {id ?? "-"}
            </strong>
          </p>
        </div>

        <StatusBadge
          status={
            approval_status ||
            "PENDING"
          }
        />
      </div>

      {/* Information */}
      <div className="student-card-body">

        <div className="student-info-row">
          <span className="student-info-label">
            Email
          </span>

          <span className="student-info-value">
            {email || "-"}
          </span>
        </div>

        <div className="student-info-row">
          <span className="student-info-label">
            Phone
          </span>

          <span className="student-info-value">
            {phone || "-"}
          </span>
        </div>

        <div className="student-info-row">
          <span className="student-info-label">
            College
          </span>

          <span className="student-info-value">
            {college_name || "-"}
          </span>
        </div>

        <div className="student-info-row">
          <span className="student-info-label">
            Degree
          </span>

          <span className="student-info-value">
            {degree || "-"}
          </span>
        </div>

        <div className="student-info-row">
          <span className="student-info-label">
            Branch
          </span>

          <span className="student-info-value">
            {branch || "-"}
          </span>
        </div>

        {/* Academic Details */}
        <div className="student-academic-grid">

          <div>
            <span>
              10th CGPA
            </span>

            <strong>
              {tenth_cgpa ?? "-"}
            </strong>
          </div>

          <div>
            <span>
              12th CGPA
            </span>

            <strong>
              {twelfth_cgpa ?? "-"}
            </strong>
          </div>

          <div>
            <span>
              BE CGPA
            </span>

            <strong>
              {be_cgpa ?? "-"}
            </strong>
          </div>

        </div>

        {/* Verification */}
        <div className="student-verification">

          <div
            className={
              email_verified
                ? "verification-item verified"
                : "verification-item pending"
            }
          >
            <span>
              {email_verified
                ? "✓"
                : "!"}
            </span>

            Email
          </div>

          <div
            className={
              phone_verified
                ? "verification-item verified"
                : "verification-item pending"
            }
          >
            <span>
              {phone_verified
                ? "✓"
                : "!"}
            </span>

            Phone
          </div>

        </div>

        {/* Created date */}
        {created_at && (
          <div className="student-created-date">
            Registered:{" "}
            {new Date(
              created_at
            ).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="student-card-actions">

          {onView && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                onView(student)
              }
            >
              View
            </button>
          )}

          {onApprove &&
            approval_status !==
              "APPROVED" && (
              <button
                type="button"
                className="button button-success"
                onClick={() =>
                  onApprove(student)
                }
              >
                Approve
              </button>
            )}

          {onReject &&
            approval_status !==
              "REJECTED" && (
              <button
                type="button"
                className="button button-danger"
                onClick={() =>
                  onReject(student)
                }
              >
                Reject
              </button>
            )}

        </div>
      )}
    </article>
  );
}

export default StudentCard;
