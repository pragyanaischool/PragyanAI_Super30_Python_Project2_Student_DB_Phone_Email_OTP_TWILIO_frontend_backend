import api from "./api";


/**
 * ============================================================
 * STUDENT API
 * ============================================================
 *
 * Handles authenticated student operations.
 *
 * Backend:
 *
 * GET  /api/students/me
 * PUT  /api/students/me
 *
 * ============================================================
 */


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
    throw normalizeStudentError(error);
  }
}


/* ============================================================
   GET STUDENT PROFILE
   ============================================================ */

export async function getStudentProfile() {
  return getCurrentStudent();
}


/* ============================================================
   UPDATE CURRENT STUDENT
   ============================================================ */

export async function updateStudent(studentData) {
  try {
    const response = await api.put(
      "/students/me",
      studentData
    );

    return response.data;
  } catch (error) {
    throw normalizeStudentError(error);
  }
}


/* ============================================================
   UPDATE STUDENT PROFILE
   ============================================================ */

export async function updateStudentProfile(studentData) {
  return updateStudent(studentData);
}


/* ============================================================
   GET STUDENT VERIFICATION STATUS
   ============================================================ */

export async function getVerificationStatus() {
  try {
    const student = await getCurrentStudent();

    return {
      email_verified:
        Boolean(student?.email_verified),

      phone_verified:
        Boolean(student?.phone_verified),

      approval_status:
        student?.approval_status || "pending",

      emailVerified:
        Boolean(student?.email_verified),

      phoneVerified:
        Boolean(student?.phone_verified),

      approvalStatus:
        student?.approval_status || "pending",
    };
  } catch (error) {
    throw normalizeStudentError(error);
  }
}


/* ============================================================
   CHECK EMAIL VERIFICATION
   ============================================================ */

export async function isEmailVerified() {
  const student = await getCurrentStudent();

  return Boolean(student?.email_verified);
}


/* ============================================================
   CHECK PHONE VERIFICATION
   ============================================================ */

export async function isPhoneVerified() {
  const student = await getCurrentStudent();

  return Boolean(student?.phone_verified);
}


/* ============================================================
   GET APPROVAL STATUS
   ============================================================ */

export async function getApprovalStatus() {
  const student = await getCurrentStudent();

  return student?.approval_status || "pending";
}


/* ============================================================
   REFRESH STUDENT PROFILE
   ============================================================ */

export async function refreshStudentProfile() {
  return getCurrentStudent();
}


/* ============================================================
   NORMALIZE STUDENT ERROR
   ============================================================ */

function normalizeStudentError(error) {
  /*
   * Network error
   */

  if (!error?.response) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(
      "Unable to connect to the server. Please check your internet connection."
    );
  }

  const status = error.response.status;
  const data = error.response.data;

  /*
   * FastAPI validation errors.
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
   * Standard FastAPI error.
   */

  if (typeof data?.detail === "string") {
    return new Error(data.detail);
  }

  /*
   * Alternative API error.
   */

  if (typeof data?.message === "string") {
    return new Error(data.message);
  }

  /*
   * HTTP status handling.
   */

  if (status === 400) {
    return new Error(
      "Invalid student information."
    );
  }

  if (status === 401) {
    return new Error(
      "Your session has expired. Please login again."
    );
  }

  if (status === 403) {
    return new Error(
      "You are not authorized to access this student profile."
    );
  }

  if (status === 404) {
    return new Error(
      "Student profile was not found."
    );
  }

  if (status === 409) {
    return new Error(
      "The submitted student information conflicts with an existing record."
    );
  }

  if (status === 422) {
    return new Error(
      "Some student information is invalid. Please check the form."
    );
  }

  if (status >= 500) {
    return new Error(
      "Server error. Please try again later."
    );
  }

  return new Error(
    error?.message || "Student request failed."
  );
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const studentApi = {
  getCurrentStudent,
  getStudentProfile,
  updateStudent,
  updateStudentProfile,
  getVerificationStatus,
  isEmailVerified,
  isPhoneVerified,
  getApprovalStatus,
  refreshStudentProfile,
};

export default studentApi;
