import api from "./api";
import {
  getStudentToken,
  setStudentToken,
  clearStudentToken,
  saveRegistrationData,
  getRegistrationData,
  clearRegistrationData,
} from "../utils/storage";

/**
 * ============================================================
 * AUTH API
 * ============================================================
 *
 * Handles:
 * - Student registration
 * - Student login
 * - Current student session
 * - Student logout
 * - Registration data used during OTP verification
 *
 * Backend endpoints:
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/students/me
 * ============================================================
 */


/* ============================================================
   REGISTER STUDENT
   ============================================================ */

export async function registerStudent(studentData) {
  try {
    const response = await api.post("/auth/register", studentData);

    const data = response.data;

    /*
     * Some backend versions may return:
     *
     * {
     *   access_token: "...",
     *   token_type: "bearer",
     *   student: {...}
     * }
     *
     * If a token is returned, store it.
     */

    if (data?.access_token) {
      setStudentToken(data.access_token);
    }

    /*
     * Store registration information locally.
     *
     * This information is needed by:
     * EmailVerification.jsx
     * PhoneVerification.jsx
     */

    const student = data?.student || data;

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
    const response = await api.post("/auth/login", credentials);

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
      throw new Error("Login succeeded but no access token was returned.");
    }

    setStudentToken(data.access_token);

    return data;
  } catch (error) {
    clearStudentToken();

    throw normalizeAuthError(error);
  }
}


/* ============================================================
   GET CURRENT STUDENT
   ============================================================ */

export async function getCurrentStudent() {
  try {
    const response = await api.get("/students/me");

    return response.data;
  } catch (error) {
    throw normalizeAuthError(error);
  }
}


/* ============================================================
   LOGOUT STUDENT
   ============================================================ */

export function logoutStudent() {
  clearStudentToken();
}


/* ============================================================
   CHECK STUDENT LOGIN
   ============================================================ */

export function isStudentLoggedIn() {
  const token = getStudentToken();

  return Boolean(token);
}


/* ============================================================
   CLEAR STUDENT TOKEN
   ============================================================ */

export function clearStudentTokenStorage() {
  clearStudentToken();
}


/*
 * AuthContext expects the name clearStudentToken.
 *
 * Exporting the storage helper directly keeps compatibility
 * with the existing AuthContext.jsx.
 */
export { clearStudentToken };


/* ============================================================
   REGISTRATION INFORMATION
   ============================================================ */

/**
 * Store registration information.
 *
 * Used between:
 *
 * Register
 *    ↓
 * Email Verification
 *    ↓
 * Phone Verification
 */

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

  return data?.studentId || data?.student_id || "";
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
   * Network error
   */

  if (!error?.response) {
    return new Error(
      "Unable to connect to the server. Please check your internet connection and try again."
    );
  }

  const status = error.response.status;

  const data = error.response.data;

  /*
   * FastAPI validation errors
   *
   * Example:
   *
   * {
   *   "detail": [
   *     {
   *       "loc": ["body", "email"],
   *       "msg": "value is not a valid email address",
   *       "type": "value_error"
   *     }
   *   ]
   * }
   */

  if (Array.isArray(data?.detail)) {
    const messages = data.detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item?.msg || "";
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return new Error(messages.join(" "));
    }
  }

  /*
   * Normal FastAPI:
   *
   * {
   *   "detail": "Invalid email or password"
   * }
   */

  if (typeof data?.detail === "string") {
    return new Error(data.detail);
  }

  /*
   * Alternative backend response
   */

  if (typeof data?.message === "string") {
    return new Error(data.message);
  }

  /*
   * HTTP status based messages
   */

  if (status === 400) {
    return new Error("Invalid request. Please check the information entered.");
  }

  if (status === 401) {
    return new Error("Invalid email or password.");
  }

  if (status === 403) {
    return new Error(
      "Your account is not authorized to perform this action."
    );
  }

  if (status === 404) {
    return new Error("Requested resource was not found.");
  }

  if (status === 409) {
    return new Error(
      "An account with this email address or phone number already exists."
    );
  }

  if (status >= 500) {
    return new Error(
      "Server error. Please try again later."
    );
  }

  return new Error(
    error?.message || "Authentication request failed."
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
