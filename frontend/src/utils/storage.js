/**
 * ============================================================
 * STORAGE UTILITIES
 * ============================================================
 *
 * Centralized localStorage management for:
 *
 * 1. Student authentication
 * 2. Admin authentication
 * 3. Registration / OTP flow
 * 4. Generic application storage
 *
 * IMPORTANT:
 *
 * Never store passwords, OTPs, API keys, or other secrets
 * in localStorage.
 *
 * ============================================================
 */


/* ============================================================
   STORAGE KEYS
   ============================================================ */

export const STORAGE_KEYS = {
  STUDENT_TOKEN: "student_token",
  ADMIN_TOKEN: "admin_token",

  REGISTRATION_EMAIL: "registration_email",
  REGISTRATION_PHONE: "registration_phone",
  REGISTRATION_STUDENT_ID: "registration_student_id",

  REGISTRATION_DATA: "registration_data",

  STUDENT_DATA: "student_data",
  ADMIN_DATA: "admin_data",
};


/* ============================================================
   SAFE LOCAL STORAGE CHECK
   ============================================================ */

function isStorageAvailable() {
  try {
    if (typeof window === "undefined") {
      return false;
    }

    if (!window.localStorage) {
      return false;
    }

    const testKey =
      "__pragyanai_storage_test__";

    window.localStorage.setItem(
      testKey,
      "1"
    );

    window.localStorage.removeItem(
      testKey
    );

    return true;

  } catch {
    return false;
  }
}


/* ============================================================
   GENERIC STORAGE FUNCTIONS
   ============================================================ */

/**
 * Get a value from localStorage.
 */

export function getItem(key) {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    return window.localStorage.getItem(
      key
    );
  } catch {
    return null;
  }
}


/**
 * Set a value in localStorage.
 */

export function setItem(key, value) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(
      key,
      String(value)
    );

    return true;

  } catch {
    return false;
  }
}


/**
 * Remove a value from localStorage.
 */

export function removeItem(key) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(
      key
    );

    return true;

  } catch {
    return false;
  }
}


/**
 * Check whether a key exists.
 */

export function hasItem(key) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    return (
      window.localStorage.getItem(key) !== null
    );

  } catch {
    return false;
  }
}


/**
 * Parse JSON from localStorage.
 */

export function getJSON(key, fallback = null) {
  const value =
    getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);

  } catch {
    return fallback;
  }
}


/**
 * Store JSON in localStorage.
 */

export function setJSON(key, value) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;

  } catch {
    return false;
  }
}


/**
 * Remove multiple storage keys.
 */

export function removeItems(keys = []) {
  if (!Array.isArray(keys)) {
    return;
  }

  keys.forEach((key) => {
    removeItem(key);
  });
}


/* ============================================================
   STUDENT TOKEN
   ============================================================ */

/**
 * Get student JWT token.
 */

export function getStudentToken() {
  return getItem(
    STORAGE_KEYS.STUDENT_TOKEN
  );
}


/**
 * Store student JWT token.
 */

export function setStudentToken(token) {
  if (!token) {
    return false;
  }

  return setItem(
    STORAGE_KEYS.STUDENT_TOKEN,
    token
  );
}


/**
 * Remove student JWT token.
 *
 * IMPORTANT:
 * This function is intentionally named
 * removeStudentToken().
 *
 * authApi.js exposes clearStudentToken()
 * as a frontend API helper.
 */

export function removeStudentToken() {
  return removeItem(
    STORAGE_KEYS.STUDENT_TOKEN
  );
}


/**
 * Compatibility alias.
 *
 * Some parts of the application may use
 * clearStudentToken().
 */

export function clearStudentToken() {
  return removeStudentToken();
}


/**
 * Check student login status.
 */

export function hasStudentToken() {
  return Boolean(
    getStudentToken()
  );
}


/* ============================================================
   ADMIN TOKEN
   ============================================================ */

/**
 * Get admin JWT token.
 */

export function getAdminToken() {
  return getItem(
    STORAGE_KEYS.ADMIN_TOKEN
  );
}


/**
 * Store admin JWT token.
 */

export function setAdminToken(token) {
  if (!token) {
    return false;
  }

  return setItem(
    STORAGE_KEYS.ADMIN_TOKEN,
    token
  );
}


/**
 * Remove admin JWT token.
 */

export function removeAdminToken() {
  return removeItem(
    STORAGE_KEYS.ADMIN_TOKEN
  );
}


/**
 * Compatibility alias.
 */

export function clearAdminToken() {
  return removeAdminToken();
}


/**
 * Check admin login status.
 */

export function hasAdminToken() {
  return Boolean(
    getAdminToken()
  );
}


/* ============================================================
   REGISTRATION EMAIL
   ============================================================ */

/**
 * Store registration email.
 */

export function setRegistrationEmail(email) {
  return setItem(
    STORAGE_KEYS.REGISTRATION_EMAIL,
    email || ""
  );
}


/**
 * Get registration email.
 */

export function getRegistrationEmail() {
  return (
    getItem(
      STORAGE_KEYS.REGISTRATION_EMAIL
    ) || ""
  );
}


/**
 * Remove registration email.
 */

export function clearRegistrationEmail() {
  return removeItem(
    STORAGE_KEYS.REGISTRATION_EMAIL
  );
}


/* ============================================================
   REGISTRATION PHONE
   ============================================================ */

/**
 * Store registration phone.
 */

export function setRegistrationPhone(phone) {
  return setItem(
    STORAGE_KEYS.REGISTRATION_PHONE,
    phone || ""
  );
}


/**
 * Get registration phone.
 */

export function getRegistrationPhone() {
  return (
    getItem(
      STORAGE_KEYS.REGISTRATION_PHONE
    ) || ""
  );
}


/**
 * Remove registration phone.
 */

export function clearRegistrationPhone() {
  return removeItem(
    STORAGE_KEYS.REGISTRATION_PHONE
  );
}


/* ============================================================
   REGISTRATION STUDENT ID
   ============================================================ */

/**
 * Store student ID generated during registration.
 */

export function setRegistrationStudentId(studentId) {
  return setItem(
    STORAGE_KEYS.REGISTRATION_STUDENT_ID,
    studentId || ""
  );
}


/**
 * Get registration student ID.
 */

export function getRegistrationStudentId() {
  return (
    getItem(
      STORAGE_KEYS.REGISTRATION_STUDENT_ID
    ) || ""
  );
}


/**
 * Remove registration student ID.
 */

export function clearRegistrationStudentId() {
  return removeItem(
    STORAGE_KEYS.REGISTRATION_STUDENT_ID
  );
}


/* ============================================================
   REGISTRATION DATA
   ============================================================ */

/**
 * Save all registration information.
 *
 * Expected object:
 *
 * {
 *   email: "student@gmail.com",
 *   phone: "9876543210",
 *   studentId: 123
 * }
 */

export function saveRegistrationData(data = {}) {

  if (
    !data ||
    typeof data !== "object"
  ) {
    return false;
  }


  const email =
    data.email ||
    "";

  const phone =
    data.phone ||
    "";

  const studentId =
    data.studentId ||
    data.student_id ||
    data.id ||
    "";


  /*
   * Store individual values.
   */

  setRegistrationEmail(
    email
  );

  setRegistrationPhone(
    phone
  );

  setRegistrationStudentId(
    studentId
  );


  /*
   * Also store the complete object.
   */

  return setJSON(
    STORAGE_KEYS.REGISTRATION_DATA,
    {
      email,
      phone,
      studentId,
    }
  );
}


/**
 * Get registration data.
 */

export function getRegistrationData() {

  const stored =
    getJSON(
      STORAGE_KEYS.REGISTRATION_DATA,
      null
    );


  /*
   * If complete registration data exists,
   * use it.
   */

  if (
    stored &&
    typeof stored === "object"
  ) {
    return {
      email:
        stored.email ||
        getRegistrationEmail(),

      phone:
        stored.phone ||
        getRegistrationPhone(),

      studentId:
        stored.studentId ||
        stored.student_id ||
        getRegistrationStudentId(),
    };
  }


  /*
   * Otherwise reconstruct the data from
   * individual storage values.
   */

  return {
    email:
      getRegistrationEmail(),

    phone:
      getRegistrationPhone(),

    studentId:
      getRegistrationStudentId(),
  };
}


/**
 * Clear all registration information.
 */

export function clearRegistrationData() {

  removeItems([
    STORAGE_KEYS.REGISTRATION_EMAIL,
    STORAGE_KEYS.REGISTRATION_PHONE,
    STORAGE_KEYS.REGISTRATION_STUDENT_ID,
    STORAGE_KEYS.REGISTRATION_DATA,
  ]);
}


/* ============================================================
   STUDENT DATA
   ============================================================ */

/**
 * Save student profile data locally.
 *
 * This is only a convenience cache.
 *
 * The backend remains the source of truth.
 */

export function setStudentData(student) {
  if (!student) {
    return false;
  }

  return setJSON(
    STORAGE_KEYS.STUDENT_DATA,
    student
  );
}


/**
 * Get cached student data.
 */

export function getStudentData() {
  return getJSON(
    STORAGE_KEYS.STUDENT_DATA,
    null
  );
}


/**
 * Remove cached student data.
 */

export function clearStudentData() {
  return removeItem(
    STORAGE_KEYS.STUDENT_DATA
  );
}


/* ============================================================
   ADMIN DATA
   ============================================================ */

/**
 * Save admin data locally.
 *
 * This is only a convenience cache.
 */

export function setAdminData(admin) {
  if (!admin) {
    return false;
  }

  return setJSON(
    STORAGE_KEYS.ADMIN_DATA,
    admin
  );
}


/**
 * Get cached admin data.
 */

export function getAdminData() {
  return getJSON(
    STORAGE_KEYS.ADMIN_DATA,
    null
  );
}


/**
 * Remove cached admin data.
 */

export function clearAdminData() {
  return removeItem(
    STORAGE_KEYS.ADMIN_DATA
  );
}


/* ============================================================
   STUDENT SESSION
   ============================================================ */

/**
 * Clear student session.
 *
 * Removes:
 *
 * - Student JWT
 * - Cached student data
 */

export function clearStudentSession() {
  removeStudentToken();
  clearStudentData();
}


/* ============================================================
   ADMIN SESSION
   ============================================================ */

/**
 * Clear admin session.
 *
 * Removes:
 *
 * - Admin JWT
 * - Cached admin data
 */

export function clearAdminSession() {
  removeAdminToken();
  clearAdminData();
}


/* ============================================================
   ALL AUTHENTICATION SESSIONS
   ============================================================ */

/**
 * Clear both student and admin authentication.
 */

export function clearAllSessions() {
  clearStudentSession();
  clearAdminSession();
}


/* ============================================================
   CURRENT LOGGED-IN USER TYPE
   ============================================================ */

/**
 * Returns:
 *
 * "admin"
 * "student"
 * null
 *
 * Admin is checked first because the admin
 * dashboard should take priority when an
 * admin session exists.
 */

export function getLoggedInUserType() {

  if (hasAdminToken()) {
    return "admin";
  }

  if (hasStudentToken()) {
    return "student";
  }

  return null;
}


/* ============================================================
   GENERIC AUTH STATUS
   ============================================================ */

export function isAuthenticated() {
  return (
    hasStudentToken() ||
    hasAdminToken()
  );
}


/* ============================================================
   STORAGE DEBUG INFORMATION
   ============================================================ */

/**
 * Returns safe storage status.
 *
 * IMPORTANT:
 * Tokens themselves are NOT returned.
 */

export function getStorageStatus() {
  return {
    storageAvailable:
      isStorageAvailable(),

    studentLoggedIn:
      hasStudentToken(),

    adminLoggedIn:
      hasAdminToken(),

    registrationEmail:
      Boolean(
        getRegistrationEmail()
      ),

    registrationPhone:
      Boolean(
        getRegistrationPhone()
      ),

    registrationStudentId:
      Boolean(
        getRegistrationStudentId()
      ),
  };
}


/* ============================================================
   CLEAR EVERYTHING
   ============================================================ */

/**
 * Clear all PragyanAI application storage.
 *
 * This should generally be used only when
 * explicitly resetting the application.
 */

export function clearAllStorage() {

  removeItems([
    STORAGE_KEYS.STUDENT_TOKEN,
    STORAGE_KEYS.ADMIN_TOKEN,

    STORAGE_KEYS.REGISTRATION_EMAIL,
    STORAGE_KEYS.REGISTRATION_PHONE,
    STORAGE_KEYS.REGISTRATION_STUDENT_ID,
    STORAGE_KEYS.REGISTRATION_DATA,

    STORAGE_KEYS.STUDENT_DATA,
    STORAGE_KEYS.ADMIN_DATA,
  ]);
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const storage = {

  /* Generic */
  getItem,
  setItem,
  removeItem,
  hasItem,

  getJSON,
  setJSON,

  removeItems,

  /* Student authentication */
  getStudentToken,
  setStudentToken,
  removeStudentToken,
  clearStudentToken,
  hasStudentToken,

  /* Admin authentication */
  getAdminToken,
  setAdminToken,
  removeAdminToken,
  clearAdminToken,
  hasAdminToken,

  /* Registration */
  setRegistrationEmail,
  getRegistrationEmail,
  clearRegistrationEmail,

  setRegistrationPhone,
  getRegistrationPhone,
  clearRegistrationPhone,

  setRegistrationStudentId,
  getRegistrationStudentId,
  clearRegistrationStudentId,

  saveRegistrationData,
  getRegistrationData,
  clearRegistrationData,

  /* Student data */
  setStudentData,
  getStudentData,
  clearStudentData,

  /* Admin data */
  setAdminData,
  getAdminData,
  clearAdminData,

  /* Sessions */
  clearStudentSession,
  clearAdminSession,
  clearAllSessions,

  /* Authentication */
  getLoggedInUserType,
  isAuthenticated,

  /* Diagnostics */
  getStorageStatus,

  /* Reset */
  clearAllStorage,
};

export default storage;
