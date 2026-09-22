// frontend/src/api/adminApi.js

import api from "./api";


// ============================================================
// ADMIN LOGIN
// ============================================================

export async function adminLogin(
  email,
  password
) {
  const response = await api.post(
    "/admin/login",
    {
      email: email.trim().toLowerCase(),
      password,
    }
  );

  // ----------------------------------------------------------
  // Save admin JWT token
  // ----------------------------------------------------------

  if (response.data?.access_token) {
    localStorage.setItem(
      "admin_token",
      response.data.access_token
    );
  }

  return response.data;
}


// ============================================================
// ADMIN LOGOUT
// ============================================================

export function adminLogout() {
  localStorage.removeItem("admin_token");

  localStorage.removeItem("student_token");

  window.location.href = "/admin/login";
}


// ============================================================
// CHECK ADMIN LOGIN
// ============================================================

export function isAdminLoggedIn() {
  const token =
    localStorage.getItem("admin_token");

  return Boolean(token);
}


// ============================================================
// GET ADMIN PROFILE
// ============================================================

export async function getAdminProfile() {
  const response = await api.get(
    "/admin/me"
  );

  return response.data;
}


// ============================================================
// GET ADMIN DASHBOARD
// ============================================================

export async function getAdminDashboard() {
  const response = await api.get(
    "/admin/dashboard"
  );

  return response.data;
}


// ============================================================
// GET ALL STUDENTS
// ============================================================

export async function getStudents() {
  const response = await api.get(
    "/admin/students"
  );

  return response.data;
}


// ============================================================
// GET SINGLE STUDENT
// ============================================================

export async function getStudent(
  studentId
) {
  const response = await api.get(
    `/admin/students/${studentId}`
  );

  return response.data;
}


// ============================================================
// APPROVE STUDENT
// ============================================================

export async function approveStudent(
  studentId
) {
  const response = await api.put(
    `/admin/students/${studentId}/approve`
  );

  return response.data;
}


// ============================================================
// REJECT STUDENT
// ============================================================

export async function rejectStudent(
  studentId,
  reason = ""
) {
  const response = await api.put(
    `/admin/students/${studentId}/reject`,
    {
      reason: reason.trim() || null,
    }
  );

  return response.data;
}


// ============================================================
// GET STUDENTS BY APPROVAL STATUS
// ============================================================

export async function getStudentsByStatus(
  approvalStatus
) {
  const response = await api.get(
    `/admin/students/status/${approvalStatus}`
  );

  return response.data;
}


// ============================================================
// GET PENDING STUDENTS
// ============================================================

export async function getPendingStudents() {
  return getStudentsByStatus(
    "PENDING"
  );
}


// ============================================================
// GET APPROVED STUDENTS
// ============================================================

export async function getApprovedStudents() {
  return getStudentsByStatus(
    "APPROVED"
  );
}


// ============================================================
// GET REJECTED STUDENTS
// ============================================================

export async function getRejectedStudents() {
  return getStudentsByStatus(
    "REJECTED"
  );
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

const adminApi = {
  adminLogin,
  adminLogout,
  isAdminLoggedIn,
  getAdminProfile,
  getAdminDashboard,
  getStudents,
  getStudent,
  approveStudent,
  rejectStudent,
  getStudentsByStatus,
  getPendingStudents,
  getApprovedStudents,
  getRejectedStudents,
};

export default adminApi;
