/* =========================================================
   PRAGYANAI STUDENT VERIFICATION PLATFORM
   APPLICATION CONSTANTS
   ========================================================= */

/*
|--------------------------------------------------------------------------
| APPLICATION
|--------------------------------------------------------------------------
*/

export const APP_NAME =
  "PragyanAI Student Verification Platform";

export const APP_SHORT_NAME =
  "PragyanAI";

export const APP_VERSION =
  "2.0.0";

/*
|--------------------------------------------------------------------------
| STORAGE KEYS
|--------------------------------------------------------------------------
*/

export const STORAGE_KEYS = {
  STUDENT_TOKEN:
    "student_token",

  ADMIN_TOKEN:
    "admin_token",

  REGISTRATION_EMAIL:
    "registration_email",

  REGISTRATION_PHONE:
    "registration_phone",

  REGISTRATION_STUDENT_ID:
    "registration_student_id",
};

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

export const API_TIMEOUT =
  30000;

/*
|--------------------------------------------------------------------------
| API ENDPOINTS
|--------------------------------------------------------------------------
*/

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER:
      "/auth/register",

    LOGIN:
      "/auth/login",

    ME:
      "/auth/me",
  },

  OTP: {
    EMAIL_SEND:
      "/otp/email/send",

    EMAIL_VERIFY:
      "/otp/email/verify",

    PHONE_SEND:
      "/otp/phone/send",

    PHONE_VERIFY:
      "/otp/phone/verify",
  },

  STUDENT: {
    ME:
      "/students/me",

    UPDATE_ME:
      "/students/me",
  },

  ADMIN: {
    LOGIN:
      "/admin/login",

    ME:
      "/admin/me",

    DASHBOARD:
      "/admin/dashboard",

    STUDENTS:
      "/admin/students",

    STUDENT:
      "/admin/students",

    APPROVE:
      "/admin/students",

    REJECT:
      "/admin/students",

    STATUS:
      "/admin/students/status",
  },
};

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

export const ROUTES = {
  HOME:
    "/",

  REGISTER:
    "/register",

  EMAIL_VERIFICATION:
    "/verify-email",

  PHONE_VERIFICATION:
    "/verify-phone",

  LOGIN:
    "/login",

  STUDENT:
    "/student",

  STUDENT_DASHBOARD:
    "/student/dashboard",

  STUDENT_PROFILE:
    "/student/profile",

  ADMIN:
    "/admin",

  ADMIN_LOGIN:
    "/admin/login",

  ADMIN_DASHBOARD:
    "/admin/dashboard",

  ADMIN_STUDENTS:
    "/admin/students",

  ADMIN_PENDING:
    "/admin/students/pending",

  ADMIN_APPROVED:
    "/admin/students/approved",

  ADMIN_REJECTED:
    "/admin/students/rejected",
};

/*
|--------------------------------------------------------------------------
| APPROVAL STATUS
|--------------------------------------------------------------------------
*/

export const APPROVAL_STATUS = {
  PENDING:
    "PENDING",

  APPROVED:
    "APPROVED",

  REJECTED:
    "REJECTED",
};

/*
|--------------------------------------------------------------------------
| APPROVAL STATUS LIST
|--------------------------------------------------------------------------
*/

export const APPROVAL_STATUS_OPTIONS = [
  {
    value:
      APPROVAL_STATUS.PENDING,

    label:
      "Pending",
  },

  {
    value:
      APPROVAL_STATUS.APPROVED,

    label:
      "Approved",
  },

  {
    value:
      APPROVAL_STATUS.REJECTED,

    label:
      "Rejected",
  },
];

/*
|--------------------------------------------------------------------------
| VERIFICATION STATUS
|--------------------------------------------------------------------------
*/

export const VERIFICATION_STATUS = {
  VERIFIED:
    "VERIFIED",

  UNVERIFIED:
    "UNVERIFIED",
};

/*
|--------------------------------------------------------------------------
| OTP
|--------------------------------------------------------------------------
*/

export const OTP_LENGTH =
  6;

export const OTP_EXPIRE_MINUTES =
  10;

export const OTP_RESEND_SECONDS =
  60;

/*
|--------------------------------------------------------------------------
| PASSWORD
|--------------------------------------------------------------------------
*/

export const PASSWORD_MIN_LENGTH =
  6;

export const PASSWORD_MAX_LENGTH =
  128;

/*
|--------------------------------------------------------------------------
| FIELD LIMITS
|--------------------------------------------------------------------------
*/

export const FIELD_LIMITS = {
  FULL_NAME: {
    MIN: 2,
    MAX: 150,
  },

  COLLEGE_NAME: {
    MIN: 2,
    MAX: 200,
  },

  DEGREE: {
    MIN: 2,
    MAX: 100,
  },

  BRANCH: {
    MIN: 2,
    MAX: 120,
  },

  PHONE: {
    MIN: 10,
    MAX: 30,
  },

  EMAIL: {
    MAX: 254,
  },
};

/*
|--------------------------------------------------------------------------
| CGPA
|--------------------------------------------------------------------------
*/

export const CGPA = {
  MIN:
    0,

  MAX:
    10,

  DECIMAL_PLACES:
    2,
};

/*
|--------------------------------------------------------------------------
| DEGREE OPTIONS
|--------------------------------------------------------------------------
*/

export const DEGREE_OPTIONS = [
  "B.E.",
  "B.Tech",
  "M.E.",
  "M.Tech",
  "BCA",
  "MCA",
  "B.Sc",
  "M.Sc",
  "Other",
];

/*
|--------------------------------------------------------------------------
| ENGINEERING BRANCH OPTIONS
|--------------------------------------------------------------------------
*/

export const BRANCH_OPTIONS = [
  "Computer Science and Engineering",
  "Artificial Intelligence and Machine Learning",
  "Artificial Intelligence and Data Science",
  "Information Science and Engineering",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Electronics and Telecommunication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other",
];

/*
|--------------------------------------------------------------------------
| APPLICATION MESSAGES
|--------------------------------------------------------------------------
*/

export const MESSAGES = {
  LOGIN_SUCCESS:
    "Login successful.",

  LOGOUT_SUCCESS:
    "You have been logged out.",

  REGISTRATION_SUCCESS:
    "Registration completed successfully.",

  EMAIL_OTP_SENT:
    "Email OTP has been sent successfully.",

  EMAIL_VERIFIED:
    "Email verified successfully.",

  PHONE_OTP_SENT:
    "Phone OTP has been sent successfully.",

  PHONE_VERIFIED:
    "Phone number verified successfully.",

  PROFILE_UPDATED:
    "Profile updated successfully.",

  STUDENT_APPROVED:
    "Student approved successfully.",

  STUDENT_REJECTED:
    "Student rejected successfully.",
};

/*
|--------------------------------------------------------------------------
| ERROR MESSAGES
|--------------------------------------------------------------------------
*/

export const ERROR_MESSAGES = {
  NETWORK:
    "Unable to connect to the server. Please check your internet connection.",

  GENERIC:
    "Something went wrong. Please try again.",

  SESSION_EXPIRED:
    "Your session has expired. Please login again.",

  INVALID_LOGIN:
    "Invalid email or password.",

  EMAIL_REQUIRED:
    "Email address is required.",

  PHONE_REQUIRED:
    "Phone number is required.",

  OTP_REQUIRED:
    "OTP is required.",

  INVALID_OTP:
    "Please enter a valid OTP.",

  REGISTRATION_FAILED:
    "Registration failed. Please try again.",

  PROFILE_LOAD_FAILED:
    "Unable to load student profile.",
};

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

export const PAGINATION = {
  DEFAULT_PAGE:
    1,

  DEFAULT_PAGE_SIZE:
    20,

  MAX_PAGE_SIZE:
    100,
};

/*
|--------------------------------------------------------------------------
| DATE FORMAT
|--------------------------------------------------------------------------
*/

export const DATE_FORMAT_OPTIONS = {
  day:
    "2-digit",

  month:
    "short",

  year:
    "numeric",
};

/*
|--------------------------------------------------------------------------
| APPLICATION FEATURES
|--------------------------------------------------------------------------
*/

export const FEATURES = {
  EMAIL_VERIFICATION:
    true,

  PHONE_VERIFICATION:
    true,

  ADMIN_APPROVAL:
    true,

  STUDENT_PROFILE:
    true,

  ADMIN_DASHBOARD:
    true,
};
