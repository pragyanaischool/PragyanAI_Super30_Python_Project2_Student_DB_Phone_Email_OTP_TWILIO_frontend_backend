import React from "react";
import StatusBadge from "./StatusBadge";

function StudentTable({
  students = [],
  onView,
  onApprove,
  onReject,
  showActions = true,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="table-loading">
        Loading students...
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          👨‍🎓
        </div>

        <h3>
          No students found
        </h3>

        <p>
          There are no students matching
          the current criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="student-table-wrapper">
      <table className="student-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>College</th>
            <th>Degree / Branch</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Verification</th>
            <th>Status</th>

            {showActions && (
              <th>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {students.map(
            (student) => (
              <tr
                key={
                  student.id
                }
              >
                {/* ID */}
                <td>
                  <strong>
                    #{student.id}
                  </strong>
                </td>

                {/* Student */}
                <td>
                  <div className="table-student">

                    <div className="table-student-avatar">
                      {student.full_name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "S"}
                    </div>

                    <div>
                      <strong>
                        {student.full_name ||
                          "-"}
                      </strong>

                      <small>
                        {student.email ||
                          "-"}
                      </small>
                    </div>

                  </div>
                </td>

                {/* College */}
                <td>
                  {student.college_name ||
                    "-"}
                </td>

                {/* Degree / Branch */}
                <td>
                  <div>
                    <strong>
                      {student.degree ||
                        "-"}
                    </strong>

                    <small>
                      {student.branch ||
                        "-"}
                    </small>
                  </div>
                </td>

                {/* Email */}
                <td>
                  <div className="verification-cell">
                    <span>
                      {student.email ||
                        "-"}
                    </span>

                    {student.email_verified && (
                      <span
                        className="verified-icon"
                        title="Email verified"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </td>

                {/* Phone */}
                <td>
                  <div className="verification-cell">
                    <span>
                      {student.phone ||
                        "-"}
                    </span>

                    {student.phone_verified && (
                      <span
                        className="verified-icon"
                        title="Phone verified"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </td>

                {/* Verification */}
                <td>
                  <div className="table-verification">

                    <span
                      className={
                        student.email_verified
                          ? "verified"
                          : "not-verified"
                      }
                    >
                      Email
                    </span>

                    <span
                      className={
                        student.phone_verified
                          ? "verified"
                          : "not-verified"
                      }
                    >
                      Phone
                    </span>

                  </div>
                </td>

                {/* Status */}
                <td>
                  <StatusBadge
                    status={
                      student.approval_status ||
                      "PENDING"
                    }
                  />
                </td>

                {/* Actions */}
                {showActions && (
                  <td>
                    <div className="table-actions">

                      {onView && (
                        <button
                          type="button"
                          className="table-action view"
                          onClick={() =>
                            onView(
                              student
                            )
                          }
                        >
                          View
                        </button>
                      )}

                      {onApprove &&
                        student.approval_status !==
                          "APPROVED" && (
                          <button
                            type="button"
                            className="table-action approve"
                            onClick={() =>
                              onApprove(
                                student
                              )
                            }
                          >
                            Approve
                          </button>
                        )}

                      {onReject &&
                        student.approval_status !==
                          "REJECTED" && (
                          <button
                            type="button"
                            className="table-action reject"
                            onClick={() =>
                              onReject(
                                student
                              )
                            }
                          >
                            Reject
                          </button>
                        )}

                    </div>
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>

      </table>
    </div>
  );
}

export default StudentTable;
