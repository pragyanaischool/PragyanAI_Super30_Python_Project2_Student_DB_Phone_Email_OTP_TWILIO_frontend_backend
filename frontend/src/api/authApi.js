import api from "./api";

import {
  getStudentToken,
  setStudentToken,
  removeStudentToken,
  saveRegistrationData,
  getRegistrationData,
  clearRegistrationData,
} from "../utils/storage";


/**
 * ============================================================
 * AUTH API
 * ============================================================
 *
 * Student authentication and registration API.
 *
 * Backend:
 *
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/students/me
 *
 * ============================================================
 */


/* ============================================================
   REGISTER STUDENT
   ============================================================ */

export async function registerStudent(studentData) {
  try {
    const response = await api.post(
      "/auth/register",
      studentData
    );

    const data = response.data;

    /*
     * Some backend implementations may return:
     *
     * {
     *   access_token: "...",
     *   token_type: "bearer",
     *   student: {...}
     * }
     *
     * If registration returns a token, store it.
     */

    if (data?.access_token) {
      setStudentToken(data.access_token);
    }

    /*
     * Student information may be returned directly
     * or inside data.student.
     */

    const student =
      data?.student ||
      data?.user ||
      data;

    /*
     * Save registration information for the OTP pages.
     *
     * Register
     *    ↓
     * Email Verification
     *    ↓
     * Phone Verification
     */

    saveRegistrationData({
      email:
        student?.email ||
        studentData?.email ||
        "",

      phone:
        student?.phone ||
        studentData?.phone ||
        "",

      studentId:
        student?.id ||
        student?.student_id ||
        data?.student_id ||
        "",
    });

    return data;

  } catch (error) {
    throw normalizeAuthError(error);
  }
}


/* ============================================================
   LOGIN STUDENT
   ============================================================ */

export async function loginStudent(credentials) {
  try {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    const data = response.data;

    /*
     * Expected backend response:
     *
     * {
     *   access_token: "...",
     *   token_type: "bearer"
     * }
     */

    if (!data?.access_token) {
      throw new Error(
        "Login succeeded but the server did not return an access token."
      );
    }

    /*
     * Store JWT.
     */

    setStudentToken(
      data.access_token
    );

    return data;

  } catch (error) {

    /*
     * Never keep an invalid/expired token after
     * a failed login.
     */

    removeStudentToken();

    throw normalizeAuthError(error);
  }
}


/* ============================================================
   GET CURRENT STUDENT
   ============================================================ */

export async function getCurrentStudent() {
  try {
    const response = await api.get(
      "/students/me"
    );

    return response.data;

  } catch (error) {
    throw normalizeAuthError(error);
  }
}


/* ============================================================
   LOGOUT STUDENT
   ============================================================ */

export function logoutStudent() {
  removeStudentToken();
}


/* ============================================================
   CHECK STUDENT LOGIN
   ============================================================ */

export function isStudentLoggedIn() {
  return Boolean(
    getStudentToken()
  );
}


/* ============================================================
   CLEAR STUDENT TOKEN
   ============================================================ */

export function clearStudentToken() {
  removeStudentToken();
}


/* ============================================================
   STORE REGISTRATION INFORMATION
   ============================================================ */

export function storeRegistrationInfo(data) {
  saveRegistrationData(data);
}


/* ============================================================
   GET REGISTRATION EMAIL
   ============================================================ */

export function getRegistrationEmail() {
  const data = getRegistrationData();

  return data?.email || "";
}


/* ============================================================
   GET REGISTRATION PHONE
   ============================================================ */

export function getRegistrationPhone() {
  const data = getRegistrationData();

  return data?.phone || "";
}


/* ============================================================
   GET REGISTRATION STUDENT ID
   ============================================================ */

export function getRegistrationStudentId() {
  const data = getRegistrationData();

  return (
    data?.studentId ||
    data?.student_id ||
    ""
  );
}


/* ============================================================
   CLEAR REGISTRATION DATA
   ============================================================ */

export function clearStoredRegistrationData() {
  clearRegistrationData();
}


/* ============================================================
   NORMALIZE AUTH ERROR
   ============================================================ */

function normalizeAuthError(error) {

  /*
   * Network / CORS / server unavailable
   */

  if (!error?.response) {

    if (error instanceof Error) {
      return error;
    }

    return new Error(
      "Unable to connect to the server. Please check your internet connection and try again."
    );
  }

  const status =
    error.response.status;

  const data =
    error.response.data;


  /* ==========================================================
     FASTAPI VALIDATION ERROR
     ========================================================== */

  if (Array.isArray(data?.detail)) {

    const messages =
      data.detail
        .map((item) => {

          if (typeof item === "string") {
            return item;
          }

          return item?.msg || "";
        })
        .filter(Boolean);

    if (messages.length > 0) {
      return new Error(
        messages.join(" ")
      );
    }
  }


  /* ==========================================================
     FASTAPI NORMAL ERROR
     ========================================================== */

  if (
    typeof data?.detail === "string"
  ) {
    return new Error(
      data.detail
    );
  }


  /* ==========================================================
     ALTERNATIVE API ERROR
     ========================================================== */

  if (
    typeof data?.message === "string"
  ) {
    return new Error(
      data.message
    );
  }


  /* ==========================================================
     HTTP STATUS ERRORS
     ========================================================== */

  if (status === 400) {

    return new Error(
      "Invalid request. Please check the information entered."
    );
  }


  if (status === 401) {

    return new Error(
      "Invalid email or password."
    );
  }


  if (status === 403) {

    return new Error(
      "You are not authorized to perform this action."
    );
  }


  if (status === 404) {

    return new Error(
      "The requested resource was not found."
    );
  }


  if (status === 409) {

    return new Error(
      "An account with this email address or phone number already exists."
    );
  }


  if (status === 422) {

    return new Error(
      "Please check the information entered and try again."
    );
  }


  if (status >= 500) {

    return new Error(
      "Server error. Please try again later."
    );
  }


  return new Error(
    error?.message ||
    "Authentication request failed."
  );
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const authApi = {
  registerStudent,
  loginStudent,
  getCurrentStudent,
  logoutStudent,
  isStudentLoggedIn,
  clearStudentToken,
  storeRegistrationInfo,
  getRegistrationEmail,
  getRegistrationPhone,
  getRegistrationStudentId,
  clearStoredRegistrationData,
};

export default authApi;
