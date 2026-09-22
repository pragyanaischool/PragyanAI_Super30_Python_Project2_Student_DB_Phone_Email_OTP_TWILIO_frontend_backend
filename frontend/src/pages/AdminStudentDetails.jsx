import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  approveStudent,
  getStudent,
  rejectStudent,
} from "../api/adminApi";

import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";

function AdminStudentDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [dialog, setDialog] =
    useState(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const loadStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getStudent(studentId);

      setStudent(data);
    } catch (errorObject) {
      const detail =
        errorObject?.response?.data?.detail;

      setError(
        detail ||
          errorObject?.message ||
          "Unable to load student details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [studentId]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response =
        await approveStudent(studentId);

      setSuccess(
        response?.message ||
          "Student approved successfully."
      );

      setDialog(null);

      await loadStudent();
    } catch (errorObject) {
      const detail =
        errorObject?.response?.data?.detail;

      setError(
        detail ||
          errorObject?.message ||
          "Unable to approve student."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response =
        await rejectStudent(
          studentId,
          rejectionReason
        );

      setSuccess(
        response?.message ||
          "Student rejected successfully."
      );

      setDialog(null);
      setRejectionReason("");

      await loadStudent();
    } catch (errorObject) {
      const detail =
        errorObject?.response?.data?.detail;

      setError(
        detail ||
          errorObject?.message ||
          "Unable to reject student."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner />
        <p>Loading student details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="admin-dashboard-container">
        <div className="error-message">
          <span>⚠️</span>
          <span>
            {error || "Student not found."}
          </span>
        </div>

        <Link
          to="/admin/students"
          className="btn btn-primary"
        >
          ← Back to Students
        </Link>
      </div>
    );
  }

  const canApprove =
    student.approval_status !== "APPROVED";

  const canReject =
    student.approval_status !== "REJECTED";

  const fullyVerified =
    Boolean(student.email_verified) &&
    Boolean(student.phone_verified);

  return (
    <div className="admin-student-details-page">
      <div className="admin-dashboard-container">
        <div className="details-breadcrumb">
          <Link to="/admin/dashboard">
            Dashboard
          </Link>

          <span>/</span>

          <Link to="/admin/students">
            Students
          </Link>

          <span>/</span>

          <strong>
            Student #{student.id}
          </strong>
        </div>

        <section className="admin-page-header">
          <div>
            <span className="dashboard-eyebrow">
              👤 Student Details
            </span>

            <h1>{student.full_name}</h1>

            <p>
              Student ID:{" "}
              <strong>#{student.id}</strong>
            </p>
          </div>

          <StatusBadge
            status={student.approval_status}
          />
        </section>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        <section className="student-details-layout">
          <div className="student-details-main">
            <div className="dashboard-card">
              <div className="student-detail-profile">
                <div className="large-profile-avatar">
                  {student.full_name
                    ?.charAt(0)
                    ?.toUpperCase() || "S"}
                </div>

                <div>
                  <h2>
                    {student.full_name}
                  </h2>

                  <p>
                    {student.email}
                  </p>

                  <span>
                    Student ID:{" "}
                    {student.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div>
                  <span className="card-eyebrow">
                    Academic
                  </span>

                  <h2>
                    Academic Information
                  </h2>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <span>College Name</span>

                  <strong>
                    {student.college_name ||
                      "-"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Degree</span>

                  <strong>
                    {student.degree || "-"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Branch</span>

                  <strong>
                    {student.branch || "-"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>10th CGPA</span>

                  <strong>
                    {student.tenth_cgpa ??
                      "-"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>12th CGPA</span>

                  <strong>
                    {student.twelfth_cgpa ??
                      "-"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>BE / BTech CGPA</span>

                  <strong>
                    {student.be_cgpa ??
                      "-"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div>
                  <span className="card-eyebrow">
                    Contact
                  </span>

                  <h2>
                    Contact Information
                  </h2>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <span>
                    📧 Email Address
                  </span>

                  <strong>
                    {student.email}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    📱 Phone Number
                  </span>

                  <strong>
                    {student.phone}
                  </strong>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div>
                  <span className="card-eyebrow">
                    Verification
                  </span>

                  <h2>
                    Verification Status
                  </h2>
                </div>
              </div>

              <div className="verification-detail-grid">
                <div
                  className={`verification-detail ${
                    student.email_verified
                      ? "verified"
                      : "pending"
                  }`}
                >
                  <span className="verification-large-icon">
                    📧
                  </span>

                  <div>
                    <strong>
                      Email Verification
                    </strong>

                    <p>
                      {student.email}
                    </p>
                  </div>

                  <StatusBadge
                    status={
                      student.email_verified
                        ? "VERIFIED"
                        : "PENDING"
                    }
                  />
                </div>

                <div
                  className={`verification-detail ${
                    student.phone_verified
                      ? "verified"
                      : "pending"
                  }`}
                >
                  <span className="verification-large-icon">
                    📱
                  </span>

                  <div>
                    <strong>
                      Phone Verification
                    </strong>

                    <p>
                      {student.phone}
                    </p>
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

            {student.rejection_reason && (
              <div className="dashboard-card rejection-reason-card">
                <div className="dashboard-card-header">
                  <div>
                    <span className="card-eyebrow">
                      Review
                    </span>

                    <h2>
                      Rejection Reason
                    </h2>
                  </div>
                </div>

                <p>
                  {student.rejection_reason}
                </p>
              </div>
            )}
          </div>

          <aside className="student-details-sidebar">
            <div className="dashboard-card approval-card">
              <div className="dashboard-card-header">
                <div>
                  <span className="card-eyebrow">
                    Administration
                  </span>

                  <h2>
                    Application Decision
                  </h2>
                </div>
              </div>

              <div className="current-status">
                <span>
                  Current Status
                </span>

                <StatusBadge
                  status={
                    student.approval_status
                  }
                />
              </div>

              {!fullyVerified && (
                <div className="approval-warning">
                  <span>⚠️</span>

                  <p>
                    Both email and phone must be
                    verified before this student
                    can be approved.
                  </p>
                </div>
              )}

              {fullyVerified && (
                <div className="approval-ready">
                  <span>✓</span>

                  <p>
                    Email and phone verification
                    are complete.
                  </p>
                </div>
              )}

              {canApprove && (
                <button
                  type="button"
                  className="btn btn-success btn-block"
                  disabled={
                    actionLoading ||
                    !fullyVerified
                  }
                  onClick={() =>
                    setDialog({
                      type: "approve",
                    })
                  }
                >
                  ✓ Approve Student
                </button>
              )}

              {canReject && (
                <button
                  type="button"
                  className="btn btn-danger btn-block"
                  disabled={actionLoading}
                  onClick={() =>
                    setDialog({
                      type: "reject",
                    })
                  }
                >
                  ✕ Reject Student
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() =>
                  navigate("/admin/students")
                }
              >
                ← Back to Students
              </button>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div>
                  <span className="card-eyebrow">
                    Record
                  </span>

                  <h2>
                    Registration Details
                  </h2>
                </div>
              </div>

              <div className="record-details">
                <div>
                  <span>Student ID</span>
                  <strong>
                    #{student.id}
                  </strong>
                </div>

                <div>
                  <span>Registered</span>
                  <strong>
                    {student.created_at
                      ? new Date(
                          student.created_at
                        ).toLocaleString()
                      : "-"}
                  </strong>
                </div>

                <div>
                  <span>Last Updated</span>
                  <strong>
                    {student.updated_at
                      ? new Date(
                          student.updated_at
                        ).toLocaleString()
                      : "-"}
                  </strong>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {dialog?.type === "approve" && (
          <ConfirmDialog
            title="Approve Student?"
            message={`Are you sure you want to approve ${student.full_name}?`}
            confirmText="Approve Student"
            cancelText="Cancel"
            onConfirm={handleApprove}
            onCancel={() => setDialog(null)}
            loading={actionLoading}
          />
        )}

        {dialog?.type === "reject" && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h2>
                  Reject Student
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setDialog(null)
                  }
                  disabled={actionLoading}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <p>
                  Please provide a reason for
                  rejecting{" "}
                  <strong>
                    {student.full_name}
                  </strong>
                  .
                </p>

                <div className="form-group">
                  <label htmlFor="rejection_reason">
                    Rejection Reason
                  </label>

                  <textarea
                    id="rejection_reason"
                    value={rejectionReason}
                    onChange={(event) =>
                      setRejectionReason(
                        event.target.value
                      )
                    }
                    placeholder="Enter rejection reason..."
                    rows="5"
                    maxLength={1000}
                  />

                  <small>
                    {rejectionReason.length}/1000
                  </small>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setDialog(null)
                  }
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Rejecting..."
                    : "Reject Student"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStudentDetails;
