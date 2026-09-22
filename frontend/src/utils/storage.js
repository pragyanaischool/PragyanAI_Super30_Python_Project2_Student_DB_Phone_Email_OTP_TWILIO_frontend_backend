/* =========================================================
   PRAGYANAI STUDENT VERIFICATION PLATFORM
   LOCAL STORAGE UTILITIES
   ========================================================= */

import {
  STORAGE_KEYS,
} from "./constants";

/*
|--------------------------------------------------------------------------
| GENERIC STORAGE
|--------------------------------------------------------------------------
*/

export function setStorageItem(
  key,
  value
) {
  try {
    if (
      value === undefined ||
      value === null
    ) {
      localStorage.removeItem(
        key
      );

      return;
    }

    const serialized =
      typeof value === "string"
        ? value
        : JSON.stringify(value);

    localStorage.setItem(
      key,
      serialized
    );
  } catch (error) {
    console.error(
      "Unable to save localStorage item:",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET STORAGE ITEM
|--------------------------------------------------------------------------
*/

export function getStorageItem(
  key,
  defaultValue = null
) {
  try {
    const value =
      localStorage.getItem(
        key
      );

    if (value === null) {
      return defaultValue;
    }

    return value;
  } catch (error) {
    console.error(
      "Unable to read localStorage item:",
      error
    );

    return defaultValue;
  }
}

/*
|--------------------------------------------------------------------------
| GET JSON STORAGE ITEM
|--------------------------------------------------------------------------
*/

export function getJSONStorageItem(
  key,
  defaultValue = null
) {
  try {
    const value =
      localStorage.getItem(
        key
      );

    if (!value) {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      "Unable to parse localStorage item:",
      error
    );

    return defaultValue;
  }
}

/*
|--------------------------------------------------------------------------
| REMOVE STORAGE ITEM
|--------------------------------------------------------------------------
*/

export function removeStorageItem(
  key
) {
  try {
    localStorage.removeItem(
      key
    );
  } catch (error) {
    console.error(
      "Unable to remove localStorage item:",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| CLEAR ALL STORAGE
|--------------------------------------------------------------------------
*/

export function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(
      "Unable to clear localStorage:",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| STUDENT TOKEN
|--------------------------------------------------------------------------
*/

export function setStudentToken(
  token
) {
  setStorageItem(
    STORAGE_KEYS.STUDENT_TOKEN,
    token
  );
}

export function getStudentToken() {
  return getStorageItem(
    STORAGE_KEYS.STUDENT_TOKEN
  );
}

export function removeStudentToken() {
  removeStorageItem(
    STORAGE_KEYS.STUDENT_TOKEN
  );
}

export function hasStudentToken() {
  return Boolean(
    getStudentToken()
  );
}

/*
|--------------------------------------------------------------------------
| ADMIN TOKEN
|--------------------------------------------------------------------------
*/

export function setAdminToken(
  token
) {
  setStorageItem(
    STORAGE_KEYS.ADMIN_TOKEN,
    token
  );
}

export function getAdminToken() {
  return getStorageItem(
    STORAGE_KEYS.ADMIN_TOKEN
  );
}

export function removeAdminToken() {
  removeStorageItem(
    STORAGE_KEYS.ADMIN_TOKEN
  );
}

export function hasAdminToken() {
  return Boolean(
    getAdminToken()
  );
}

/*
|--------------------------------------------------------------------------
| REGISTRATION EMAIL
|--------------------------------------------------------------------------
*/

export function setRegistrationEmail(
  email
) {
  setStorageItem(
    STORAGE_KEYS.REGISTRATION_EMAIL,
    email
  );
}

export function getRegistrationEmail() {
  return getStorageItem(
    STORAGE_KEYS.REGISTRATION_EMAIL
  );
}

export function removeRegistrationEmail() {
  removeStorageItem(
    STORAGE_KEYS.REGISTRATION_EMAIL
  );
}

/*
|--------------------------------------------------------------------------
| REGISTRATION PHONE
|--------------------------------------------------------------------------
*/

export function setRegistrationPhone(
  phone
) {
  setStorageItem(
    STORAGE_KEYS.REGISTRATION_PHONE,
    phone
  );
}

export function getRegistrationPhone() {
  return getStorageItem(
    STORAGE_KEYS.REGISTRATION_PHONE
  );
}

export function removeRegistrationPhone() {
  removeStorageItem(
    STORAGE_KEYS.REGISTRATION_PHONE
  );
}

/*
|--------------------------------------------------------------------------
| REGISTRATION STUDENT ID
|--------------------------------------------------------------------------
*/

export function setRegistrationStudentId(
  studentId
) {
  setStorageItem(
    STORAGE_KEYS.REGISTRATION_STUDENT_ID,
    String(studentId)
  );
}

export function getRegistrationStudentId() {
  return getStorageItem(
    STORAGE_KEYS.REGISTRATION_STUDENT_ID
  );
}

export function removeRegistrationStudentId() {
  removeStorageItem(
    STORAGE_KEYS.REGISTRATION_STUDENT_ID
  );
}

/*
|--------------------------------------------------------------------------
| REGISTRATION DATA
|--------------------------------------------------------------------------
*/

export function saveRegistrationData(
  data
) {
  if (!data) {
    return;
  }

  if (data.email) {
    setRegistrationEmail(
      data.email
    );
  }

  if (data.phone) {
    setRegistrationPhone(
      data.phone
    );
  }

  if (data.student_id) {
    setRegistrationStudentId(
      data.student_id
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET REGISTRATION DATA
|--------------------------------------------------------------------------
*/

export function getRegistrationData() {
  return {
    email:
      getRegistrationEmail(),

    phone:
      getRegistrationPhone(),

    student_id:
      getRegistrationStudentId(),
  };
}

/*
|--------------------------------------------------------------------------
| CLEAR REGISTRATION DATA
|--------------------------------------------------------------------------
*/

export function clearRegistrationData() {
  removeRegistrationEmail();

  removeRegistrationPhone();

  removeRegistrationStudentId();
}

/*
|--------------------------------------------------------------------------
| CLEAR STUDENT SESSION
|--------------------------------------------------------------------------
*/

export function clearStudentSession() {
  removeStudentToken();

  clearRegistrationData();
}

/*
|--------------------------------------------------------------------------
| CLEAR ADMIN SESSION
|--------------------------------------------------------------------------
*/

export function clearAdminSession() {
  removeAdminToken();
}

/*
|--------------------------------------------------------------------------
| CLEAR ALL APPLICATION SESSION
|--------------------------------------------------------------------------
*/

export function clearApplicationSession() {
  clearStudentSession();

  clearAdminSession();
}

/*
|--------------------------------------------------------------------------
| CHECK LOGIN TYPE
|--------------------------------------------------------------------------
*/

export function getLoggedInUserType() {
  const studentLoggedIn =
    hasStudentToken();

  const adminLoggedIn =
    hasAdminToken();

  if (
    studentLoggedIn &&
    adminLoggedIn
  ) {
    return "both";
  }

  if (studentLoggedIn) {
    return "student";
  }

  if (adminLoggedIn) {
    return "admin";
  }

  return null;
}
