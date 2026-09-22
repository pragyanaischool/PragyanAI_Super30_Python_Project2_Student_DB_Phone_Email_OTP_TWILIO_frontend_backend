import api from "./api";

/**
 * ============================================================
 * STUDENT API
 * ============================================================
 *
 * Handles authenticated student operations.
 *
 * Backend endpoints:
 *
 * GET  /api/students/me
 * PUT  /api/students/me
 *
 * ============================================================
 */


/* ============================================================
   GET CURRENT STUDENT
   ============================================================ */

/**
 * Fetch the currently authenticated student's profile.
 *
 * Backend:
 * GET /api/students/me
 *
 * Expected response:
 *
 * {
 *   "id": 1,
 *   "full_name": "Rahul Sharma",
 *   "college_name": "ABC College",
 *   "degree": "BE",
 *   "branch": "CSE",
 *   "tenth_cgpa": 8.5,
 *   "twelfth_cgpa": 8.7,
 *   "be_cgpa": 8.4,
 *   "phone": "9876543210",
 *   "email": "rahul@gmail.com",
 *   "email_verified": true,
 *   "phone_verified": true,
 *   "approval_status": "pending",
 *   "rejection_reason": null,
 *   "created_at": "...",
 *   "updated_at": "..."
 * }
 */

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

/**
 * Alias for getCurrentStudent().
 *
 * Useful when a page specifically wants the student's
 * profile information.
 */

export async function getStudentProfile() {
  return getCurrentStudent();
}


/* ============================================================
   UPDATE CURRENT STUDENT
   ============================================================ */

/**
 * Update the authenticated student's profile.
 *
 * Backend:
 * PUT /api/students/me
 *
 * Example:
 *
 * {
 *   "full_name": "Rahul Sharma",
 *   "college_name": "ABC College",
 *   "degree": "BE",
 *   "branch": "CSE",
 *   "tenth_cgpa": 8.5,
 *   "twelfth_cgpa": 8.7,
 *   "be_cgpa": 8.4,
 *   "phone": "9876543210"
 * }
 *
 * IMPORTANT:
 *
 * The backend should control which fields are actually
 * editable. Authentication, email verification,
 * phone verification and approval status should not
 * be trusted from the browser.
 */

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

/**
 * Alias used by profile-related UI.
 */

export async function updateStudentProfile(studentData) {
  return updateStudent(studentData);
}


/* ============================================================
   REFRESH STUDENT PROFILE
   ============================================================ */

/**
 * Re-fetch the latest student information from the backend.
 */

export async function refreshStudentProfile() {
  return getCurrentStudent();
}


/* ============================================================
   GET VERIFICATION STATUS
   ============================================================ */

/**
 * Returns email, phone and approval status.
 */

export async function getVerificationStatus() {
  try {
    const student =
      await getCurrentStudent();

    return {
      email_verified:
        Boolean(
          student?.email_verified
        ),

      phone_verified:
        Boolean(
          student?.phone_verified
        ),

      approval_status:
        student?.approval_status ||
        "pending",

      /*
       * Camel-case aliases are provided for
       * frontend convenience.
       */

      emailVerified:
        Boolean(
          student?.email_verified
        ),

      phoneVerified:
        Boolean(
          student?.phone_verified
        ),

      approvalStatus:
        student?.approval_status ||
        "pending",
    };

  } catch (error) {
    throw normalizeStudentError(error);
  }
}


/* ============================================================
   CHECK EMAIL VERIFICATION
   ============================================================ */

/**
 * Returns true when the student's email is verified.
 */

export async function isEmailVerified() {
  const student =
    await getCurrentStudent();

  return Boolean(
    student?.email_verified
  );
}


/* ============================================================
   CHECK PHONE VERIFICATION
   ============================================================ */

/**
 * Returns true when the student's phone is verified.
 */

export async function isPhoneVerified() {
  const student =
    await getCurrentStudent();

  return Boolean(
    student?.phone_verified
  );
}


/* ============================================================
   GET APPROVAL STATUS
   ============================================================ */

/**
 * Possible values:
 *
 * pending
 * approved
 * rejected
 */

export async function getApprovalStatus() {
  const student =
    await getCurrentStudent();

  return (
    student?.approval_status ||
    "pending"
  );
}


/* ============================================================
   GET STUDENT ID
   ============================================================ */

export async function getStudentId() {
  const student =
    await getCurrentStudent();

  return (
    student?.id ||
    student?.student_id ||
    null
  );
}


/* ============================================================
   GET STUDENT BASIC INFORMATION
   ============================================================ */

export async function getStudentBasicInfo() {
  const student =
    await getCurrentStudent();

  return {
    id:
      student?.id ||
      student?.student_id ||
      null,

    full_name:
      student?.full_name ||
      "",

    email:
      student?.email ||
      "",

    phone:
      student?.phone ||
      "",

    college_name:
      student?.college_name ||
      "",

    degree:
      student?.degree ||
      "",

    branch:
      student?.branch ||
      "",
  };
}


/* ============================================================
   GET ACADEMIC INFORMATION
   ============================================================ */

export async function getAcademicInformation() {
  const student =
    await getCurrentStudent();

  return {
    tenth_cgpa:
      student?.tenth_cgpa ?? null,

    twelfth_cgpa:
      student?.twelfth_cgpa ?? null,

    be_cgpa:
      student?.be_cgpa ?? null,
  };
}


/* ============================================================
   GET ACCOUNT STATUS
   ============================================================ */

export async function getAccountStatus() {
  const student =
    await getCurrentStudent();

  return {
    emailVerified:
      Boolean(
        student?.email_verified
      ),

    phoneVerified:
      Boolean(
        student?.phone_verified
      ),

    approvalStatus:
      student?.approval_status ||
      "pending",

    rejectionReason:
      student?.rejection_reason ||
      null,
  };
}


/* ============================================================
   NORMALIZE STUDENT ERROR
   ============================================================ */

function normalizeStudentError(error) {

  /* ----------------------------------------------------------
     Client-side Error
     ---------------------------------------------------------- */

  if (
    error instanceof Error &&
    !error.response
  ) {
    return error;
  }


  /* ----------------------------------------------------------
     Network / CORS / Server unavailable
     ---------------------------------------------------------- */

  if (!error?.response) {
    return new Error(
      "Unable to connect to the server. Please check your internet connection and try again."
    );
  }


  const status =
    error.response.status;

  const data =
    error.response.data;


  /* ----------------------------------------------------------
     FastAPI validation errors
     ---------------------------------------------------------- */

  if (Array.isArray(data?.detail)) {

    const messages =
      data.detail
        .map((item) => {

          if (
            typeof item === "string"
          ) {
            return item;
          }

          return (
            item?.msg ||
            ""
          );
        })
        .filter(Boolean);

    if (messages.length > 0) {
      return new Error(
        messages.join(" ")
      );
    }
  }


  /* ----------------------------------------------------------
     Standard FastAPI error
     ---------------------------------------------------------- */

  if (
    typeof data?.detail === "string"
  ) {
    return new Error(
      data.detail
    );
  }


  /* ----------------------------------------------------------
     Alternative API error
     ---------------------------------------------------------- */

  if (
    typeof data?.message === "string"
  ) {
    return new Error(
      data.message
    );
  }


  /* ----------------------------------------------------------
     HTTP status errors
     ---------------------------------------------------------- */

  switch (status) {

    case 400:
      return new Error(
        "Invalid student information. Please check your details."
      );

    case 401:
      return new Error(
        "Your student session has expired. Please login again."
      );

    case 403:
      return new Error(
        "You are not authorized to access or modify this student profile."
      );

    case 404:
      return new Error(
        "Student profile was not found."
      );

    case 409:
      return new Error(
        "The submitted student information conflicts with an existing record."
      );

    case 422:
      return new Error(
        "Some student information is invalid. Please check the form."
      );

    case 429:
      return new Error(
        "Too many requests. Please wait and try again."
      );

    default:

      if (status >= 500) {
        return new Error(
          "Server error. Please try again later."
        );
      }

      return new Error(
        error?.message ||
        "Student request failed."
      );
  }
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const studentApi = {
  getCurrentStudent,
  getStudentProfile,

  updateStudent,
  updateStudentProfile,

  refreshStudentProfile,

  getVerificationStatus,

  isEmailVerified,
  isPhoneVerified,

  getApprovalStatus,
  getStudentId,

  getStudentBasicInfo,
  getAcademicInformation,
  getAccountStatus,
};

export default studentApi;

