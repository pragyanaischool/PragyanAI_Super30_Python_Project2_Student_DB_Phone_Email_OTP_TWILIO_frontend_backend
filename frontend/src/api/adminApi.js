import api from "./api";

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

export async function adminLogin(email, password) {
  try {
    const response = await api.post("/admin/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    /*
     * Store JWT token.
     */
    if (response.data?.access_token) {
      localStorage.setItem(
        "admin_token",
        response.data.access_token
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| ADMIN LOGOUT
|--------------------------------------------------------------------------
*/

export function adminLogout() {
  localStorage.removeItem("admin_token");

  /*
   * Also remove student token to prevent
   * accidental cross-session usage.
   */
  localStorage.removeItem("student_token");

  window.location.href = "/admin/login";
}

/*
|--------------------------------------------------------------------------
| CHECK ADMIN LOGIN
|--------------------------------------------------------------------------
*/

export function isAdminLoggedIn() {
  return Boolean(
    localStorage.getItem("admin_token")
  );
}

/*
|--------------------------------------------------------------------------
| GET ADMIN PROFILE
|--------------------------------------------------------------------------
|
| GET /api/admin/me
|
*/

export async function getAdminProfile() {
  try {
    const response = await api.get("/admin/me");

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
|
| GET /api/admin/dashboard
|
*/

export async function getAdminDashboard() {
  try {
    const response = await api.get(
      "/admin/dashboard"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| GET ALL STUDENTS
|--------------------------------------------------------------------------
|
| GET /api/admin/students
|
*/

export async function getStudents() {
  try {
    const response = await api.get(
      "/admin/students"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| GET SINGLE STUDENT
|--------------------------------------------------------------------------
|
| GET /api/admin/students/{student_id}
|
*/

export async function getStudent(studentId) {
  try {
    if (!studentId) {
      throw new Error(
        "Student ID is required."
      );
    }

    const response = await api.get(
      `/admin/students/${studentId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| APPROVE STUDENT
|--------------------------------------------------------------------------
|
| PUT /api/admin/students/{student_id}/approve
|
*/

export async function approveStudent(studentId) {
  try {
    if (!studentId) {
      throw new Error(
        "Student ID is required."
      );
    }

    const response = await api.put(
      `/admin/students/${studentId}/approve`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| REJECT STUDENT
|--------------------------------------------------------------------------
|
| PUT /api/admin/students/{student_id}/reject
|
*/

export async function rejectStudent(
  studentId,
  reason = ""
) {
  try {
    if (!studentId) {
      throw new Error(
        "Student ID is required."
      );
    }

    const response = await api.put(
      `/admin/students/${studentId}/reject`,
      {
        reason:
          reason?.trim() || null,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| GET STUDENTS BY STATUS
|--------------------------------------------------------------------------
|
| Examples:
|
| PENDING
| APPROVED
| REJECTED
|
| GET /api/admin/students/status/PENDING
|
*/

export async function getStudentsByStatus(
  approvalStatus
) {
  try {
    if (!approvalStatus) {
      throw new Error(
        "Approval status is required."
      );
    }

    const status =
      approvalStatus
        .trim()
        .toUpperCase();

    const response = await api.get(
      `/admin/students/status/${status}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| GET PENDING STUDENTS
|--------------------------------------------------------------------------
*/

export async function getPendingStudents() {
  return getStudentsByStatus("PENDING");
}

/*
|--------------------------------------------------------------------------
| GET APPROVED STUDENTS
|--------------------------------------------------------------------------
*/

export async function getApprovedStudents() {
  return getStudentsByStatus("APPROVED");
}

/*
|--------------------------------------------------------------------------
| GET REJECTED STUDENTS
|--------------------------------------------------------------------------
*/

export async function getRejectedStudents() {
  return getStudentsByStatus("REJECTED");
}

/*
|--------------------------------------------------------------------------
| GET TOKEN
|--------------------------------------------------------------------------
*/

export function getAdminToken() {
  return localStorage.getItem(
    "admin_token"
  );
}

/*
|--------------------------------------------------------------------------
| CLEAR ADMIN TOKEN
|--------------------------------------------------------------------------
*/

export function clearAdminToken() {
  localStorage.removeItem(
    "admin_token"
  );
}

