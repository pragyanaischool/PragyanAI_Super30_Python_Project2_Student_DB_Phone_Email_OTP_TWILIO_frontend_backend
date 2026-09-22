import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAdmin } from "../context/AdminContext";

import {
  getAdminDashboard,
  getStudents,
} from "../api/adminApi";

import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

function AdminDashboard() {
  const {
    admin,
    loading: adminLoading,
  } = useAdmin();

  const [dashboard, setDashboard] =
    useState(null);

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, studentData] =
        await Promise.all([
          getAdminDashboard(),
          getStudents(),
        ]);

      setDashboard(dashboardData);

      setStudents(
        Array.isArray(studentData)
          ? studentData
          : studentData?.students || []
      );
    } catch (errorObject) {
      const detail =
        errorObject?.response?.data?.detail;

      setError(
        detail ||
          errorObject?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (adminLoading || loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner />
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  const recentStudents =
    [...students]
      .sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      )
      .slice(0, 8);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <section className="admin-dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              🛡️ Administration
            </span>

            <h1>
              Welcome, Administrator
            </h1>

            <p>
              Monitor and manage PragyanAI student
              registrations.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadDashboard}
          >
            ↻ Refresh
          </button>
        </section>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <section className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="kpi-icon">👨‍🎓</div>

            <div>
              <span>Total Students</span>

              <strong>
                {dashboard?.total_students ??
                  students.length}
              </strong>
            </div>
          </div>

          <div className="admin-kpi-card warning">
            <div className="kpi-icon">⏳</div>

            <div>
              <span>Pending Approval</span>

              <strong>
                {dashboard?.pending_students ??
                  0}
              </strong>
            </div>
          </div>

          <div className="admin-kpi-card success">
            <div className="kpi-icon">✓</div>

            <div>
              <span>Approved</span>

              <strong>
                {dashboard?.approved_students ??
                  0}
              </strong>
            </div>
          </div>

          <div className="admin-kpi-card danger">
            <div className="kpi-icon">✕</div>

            <div>
              <span>Rejected</span>

              <strong>
                {dashboard?.rejected_students ??
                  0}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-verification-kpis">
          <div>
            <span>📧 Email Verified</span>
            <strong>
              {dashboard?.email_verified ?? 0}
            </strong>
          </div>

          <div>
            <span>📱 Phone Verified</span>
            <strong>
              {dashboard?.phone_verified ?? 0}
            </strong>
          </div>

          <div>
            <span>🔐 Fully Verified</span>
            <strong>
              {dashboard?.fully_verified ?? 0}
            </strong>
          </div>
        </section>

        <section className="admin-dashboard-content">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <span className="card-eyebrow">
                  Student Management
                </span>

                <h2>Recent Registrations</h2>
              </div>

              <Link
                to="/admin/students"
                className="btn btn-primary btn-sm"
              >
                View All Students
              </Link>
            </div>

            {recentStudents.length === 0 ? (
              <div className="empty-state">
                <span>👨‍🎓</span>
                <h3>No Students Found</h3>
                <p>
                  Student registrations will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>College</th>
                      <th>Email</th>
                      <th>Verification</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentStudents.map(
                      (student) => (
                        <tr key={student.id}>
                          <td>
                            <strong>
                              {student.full_name}
                            </strong>

                            <small>
                              ID: {student.id}
                            </small>
                          </td>

                          <td>
                            {student.college_name}
                          </td>

                          <td>
                            {student.email}
                          </td>

                          <td>
                            <div className="table-verification">
                              <span
                                className={
                                  student.email_verified
                                    ? "verified"
                                    : "pending"
                                }
                              >
                                📧
                              </span>

                              <span
                                className={
                                  student.phone_verified
                                    ? "verified"
                                    : "pending"
                                }
                              >
                                📱
                              </span>
                            </div>
                          </td>

                          <td>
                            <StatusBadge
                              status={
                                student.approval_status
                              }
                            />
                          </td>

                          <td>
                            <Link
                              to={`/admin/students/${student.id}`}
                              className="btn btn-outline btn-sm"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="admin-quick-actions">
          <Link
            to="/admin/students"
            className="quick-action-card"
          >
            <span>👥</span>

            <div>
              <strong>
                Manage Students
              </strong>

              <p>
                View, filter and manage all
                registrations.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/admin/students?status=PENDING"
            className="quick-action-card"
          >
            <span>⏳</span>

            <div>
              <strong>
                Pending Approvals
              </strong>

              <p>
                Review students waiting for
                approval.
              </p>
            </div>

            <span>→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
