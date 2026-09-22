import api from "./api";

/*
|--------------------------------------------------------------------------
| Admin Authentication
|--------------------------------------------------------------------------
*/

/**
 * Login administrator
 *
 * Backend:
 * POST /api/admin/login
 *
 * Request:
 * {
 *   email: "admin@pragyanai.com",
 *   password: "********"
 * }
 *
 * Response:
 * {
 *   access_token: "...",
 *   token_type: "bearer"
 * }
 */
export async function adminLogin(email, password) {
  const response = await api.post("/admin/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  const token = response.data?.access_token;

  if (!token) {
    throw new Error(
      "Admin login succeeded but no access token was returned."
    );
  }

  localStorage.setItem("admin_token", token);

  /*
   * Important:
   * Remove student token when entering admin portal.
   */
  localStorage.removeItem("student_token");

  return response.data;
}

/**
 * Get currently stored admin JWT token.
 */
export function getAdminToken() {
  return localStorage.getItem("admin_token");
}

/**
 * Check whether an admin token exists.
 */
export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

/**
 * Remove admin authentication token.
 */
export function clearAdminToken() {
  localStorage.removeItem("admin_token");
}

/**
 * Logout administrator.
 */
export function adminLogout() {
  clearAdminToken();

  /*
   * Also remove student token to avoid
   * accidentally mixing authentication sessions.
   */
  localStorage.removeItem("student_token");

  /*
   * Redirect to admin login.
   */
  window.location.href = "/admin/login";
}


/*
|--------------------------------------------------------------------------
| Admin Profile
|--------------------------------------------------------------------------
*/

/**
 * Get currently authenticated administrator.
 *
 * Backend:
 * GET /api/admin/me
 *
 * Authorization:
 * Bearer <admin_token>
 */
export async function getAdminProfile() {
  const response = await api.get("/admin/me");

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

/**
 * Get admin dashboard statistics.
 *
 * Backend:
 * GET /api/admin/dashboard
 *
 * Expected response:
 * {
 *   total_students: 100,
 *   pending_students: 20,
 *   approved_students: 70,
 *   rejected_students: 10,
 *   email_verified: 90,
 *   phone_verified: 85,
 *   fully_verified: 80
 * }
 */
export async function getAdminDashboard() {
  const response = await api.get("/admin/dashboard");

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Student Management
|--------------------------------------------------------------------------
*/

/**
 * Get all students.
 *
 * Backend:
 * GET /api/admin/students
 */
export async function getStudents() {
  const response = await api.get("/admin/students");

  /*
   * Depending on backend response, this may be:
   *
   * [
   *   {...},
   *   {...}
   * ]
   *
   * OR
   *
   * {
   *   students: [...]
   * }
   *
   * We return the original backend response
   * so pages can handle either format.
   */
  return response.data;
}


/**
 * Get a single student by ID.
 *
 * Backend:
 * GET /api/admin/students/{student_id}
 */
export async function getStudent(studentId) {
  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const response = await api.get(
    `/admin/students/${studentId}`
  );

  return response.data;
}


/**
 * Get students by approval status.
 *
 * Backend:
 * GET /api/admin/students/status/{approval_status}
 *
 * Examples:
 * PENDING
 * APPROVED
 * REJECTED
 */
export async function getStudentsByStatus(
  approvalStatus
) {
  if (!approvalStatus) {
    throw new Error(
      "Approval status is required."
    );
  }

  const normalizedStatus =
    String(approvalStatus)
      .trim()
      .toUpperCase();

  const allowedStatuses = [
    "PENDING",
    "APPROVED",
    "REJECTED",
  ];

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw new Error(
      `Invalid approval status: ${approvalStatus}`
    );
  }

  const response = await api.get(
    `/admin/students/status/${normalizedStatus}`
  );

  return response.data;
}


/**
 * Get pending students.
 */
export async function getPendingStudents() {
  return getStudentsByStatus("PENDING");
}


/**
 * Get approved students.
 */
export async function getApprovedStudents() {
  return getStudentsByStatus("APPROVED");
}


/**
 * Get rejected students.
 */
export async function getRejectedStudents() {
  return getStudentsByStatus("REJECTED");
}


/*
|--------------------------------------------------------------------------
| Student Approval
|--------------------------------------------------------------------------
*/

/**
 * Approve a student.
 *
 * Backend:
 * PUT /api/admin/students/{student_id}/approve
 *
 * No request body is required.
 */
export async function approveStudent(studentId) {
  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const response = await api.put(
    `/admin/students/${studentId}/approve`
  );

  return response.data;
}


/**
 * Reject a student.
 *
 * Backend:
 * PUT /api/admin/students/{student_id}/reject
 *
 * Request:
 * {
 *   reason: "Reason for rejection"
 * }
 */
export async function rejectStudent(
  studentId,
  reason = ""
) {
  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const response = await api.put(
    `/admin/students/${studentId}/reject`,
    {
      reason:
        typeof reason === "string" &&
        reason.trim()
          ? reason.trim()
          : null,
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| Convenience Functions
|--------------------------------------------------------------------------
*/

/**
 * Approve a student and return refreshed student data.
 */
export async function approveAndGetStudent(
  studentId
) {
  await approveStudent(studentId);

  return getStudent(studentId);
}


/**
 * Reject a student and return refreshed student data.
 */
export async function rejectAndGetStudent(
  studentId,
  reason = ""
) {
  await rejectStudent(studentId, reason);

  return getStudent(studentId);
}


/**
 * Refresh dashboard statistics and students.
 */
export async function refreshAdminData() {
  const [
    dashboard,
    students,
  ] = await Promise.all([
    getAdminDashboard(),
    getStudents(),
  ]);

  return {
    dashboard,
    students,
  };
}


/*
|--------------------------------------------------------------------------
| Error Helper
|--------------------------------------------------------------------------
*/

/**
 * Convert FastAPI/Axios errors into a readable message.
 *
 * FastAPI validation errors commonly look like:
 *
 * {
 *   detail: [
 *     {
 *       loc: ["body", "email"],
 *       msg: "value is not a valid email address",
 *       type: "value_error"
 *     }
 *   ]
 * }
 */
export function getAdminApiErrorMessage(
  error,
  fallbackMessage = "Something went wrong."
) {
  if (!error) {
    return fallbackMessage;
  }

  const detail =
    error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return (
          item?.msg ||
          item?.message ||
          "Validation error"
        );
      })
      .join(", ");
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (
    typeof error?.response?.data?.message ===
    "string"
  ) {
    return error.response.data.message;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return fallbackMessage;
}


/*
|--------------------------------------------------------------------------
| Admin Session Utilities
|--------------------------------------------------------------------------
*/

/**
 * Completely clear admin session.
 */
export function clearAdminSession() {
  localStorage.removeItem("admin_token");
}


/**
 * Check admin authentication state.
 */
export function hasAdminSession() {
  const token = getAdminToken();

  return Boolean(
    token &&
    typeof token === "string" &&
    token.trim().length > 0
  );
}

