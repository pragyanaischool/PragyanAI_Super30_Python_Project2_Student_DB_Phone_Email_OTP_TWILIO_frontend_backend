import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  getStudents,
  getStudentsByStatus,
} from "../api/adminApi";

import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

function AdminStudents() {
  const [searchParams] =
    useSearchParams();

  const initialStatus =
    searchParams.get("status") || "ALL";

  const [students, setStudents] =
    useState([]);

  const [statusFilter, setStatusFilter] =
    useState(initialStatus);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadStudents = async (
    selectedStatus = statusFilter
  ) => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (
        selectedStatus &&
        selectedStatus !== "ALL"
      ) {
        response =
          await getStudentsByStatus(
            selectedStatus
          );
      } else {
        response = await getStudents();
      }

      setStudents(
        Array.isArray(response)
          ? response
          : response?.students || []
      );
    } catch (errorObject) {
      const detail =
        errorObject?.response?.data?.detail;

      setError(
        detail ||
          errorObject?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents(initialStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStatus]);

  const handleStatusChange = (event) => {
    const status = event.target.value;

    setStatusFilter(status);
    loadStudents(status);
  };

  const filteredStudents = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      return [
        student.full_name,
        student.email,
        student.phone,
        student.college_name,
        student.degree,
        student.branch,
        String(student.id),
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [students, search]);

  return (
    <div className="admin-students-page">
      <div className="admin-dashboard-container">
        <section className="admin-page-header">
          <div>
            <span className="dashboard-eyebrow">
              👥 Student Management
            </span>

            <h1>Students</h1>

            <p>
              Search, filter and manage student
              registrations.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              loadStudents(statusFilter)
            }
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

        <section className="dashboard-card student-management-card">
          <div className="student-filters">
            <div className="search-box">
              <span>🔍</span>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, email, college or ID..."
              />
            </div>

            <div className="filter-group">
              <label htmlFor="status-filter">
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="ALL">
                  All Students
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="REJECTED">
                  Rejected
                </option>
              </select>
            </div>
          </div>

          <div className="student-list-summary">
            <span>
              Showing{" "}
              <strong>
                {filteredStudents.length}
              </strong>{" "}
              student
              {filteredStudents.length !== 1
                ? "s"
                : ""}
            </span>

            {search && (
              <button
                type="button"
                className="link-button"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )}
          </div>

          {loading ? (
            <div className="table-loading">
              <LoadingSpinner />
              <p>Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <span>🔎</span>

              <h3>
                No Students Found
              </h3>

              <p>
                Try changing your search or
                status filter.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table student-management-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>College</th>
                    <th>Academic</th>
                    <th>Contact</th>
                    <th>Verification</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
                    (student) => (
                      <tr key={student.id}>
                        <td>
                          <strong>
                            #{student.id}
                          </strong>
                        </td>

                        <td>
                          <div className="table-student">
                            <div className="table-avatar">
                              {student.full_name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "S"}
                            </div>

                            <div>
                              <strong>
                                {student.full_name}
                              </strong>

                              <small>
                                {student.email}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <strong>
                            {student.college_name}
                          </strong>
                        </td>

                        <td>
                          <span>
                            {student.degree}
                          </span>

                          <small>
                            {student.branch}
                          </small>
                        </td>

                        <td>
                          <span>
                            {student.phone}
                          </span>
                        </td>

                        <td>
                          <div className="verification-icons">
                            <span
                              title={
                                student.email_verified
                                  ? "Email verified"
                                  : "Email not verified"
                              }
                              className={
                                student.email_verified
                                  ? "verified"
                                  : "not-verified"
                              }
                            >
                              📧
                            </span>

                            <span
                              title={
                                student.phone_verified
                                  ? "Phone verified"
                                  : "Phone not verified"
                              }
                              className={
                                student.phone_verified
                                  ? "verified"
                                  : "not-verified"
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
                            className="btn btn-primary btn-sm"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminStudents;
