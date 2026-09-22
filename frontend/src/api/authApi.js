// ============================================================
// PragyanAI Student Verification Platform
// File: frontend/src/api/authApi.js
// ============================================================

import api from "./api";

import {
  getStudentToken,
  setStudentToken,
  removeStudentToken,
  saveRegistrationData,
  getRegistrationData,
  clearRegistrationData,
} from "../utils/storage";


// ============================================================
// REGISTER STUDENT
// ============================================================

export const registerStudent = async (
  registrationData
) => {

  if (
    !registrationData ||
    typeof registrationData !== "object"
  ) {
    throw new Error(
      "Registration data must be an object."
    );
  }

  const payload = {
    full_name:
      String(
        registrationData.full_name || ""
      ).trim(),

    college_name:
      String(
        registrationData.college_name || ""
      ).trim(),

    degree:
      String(
        registrationData.degree || ""
      ).trim(),

    branch:
      String(
        registrationData.branch || ""
      ).trim(),

    tenth_cgpa:
      registrationData.tenth_cgpa === "" ||
      registrationData.tenth_cgpa === undefined
        ? null
        : registrationData.tenth_cgpa,

    twelfth_cgpa:
      registrationData.twelfth_cgpa === "" ||
      registrationData.twelfth_cgpa === undefined
        ? null
        : registrationData.twelfth_cgpa,

    be_cgpa:
      registrationData.be_cgpa === "" ||
      registrationData.be_cgpa === undefined
        ? null
        : registrationData.be_cgpa,

    phone:
      String(
        registrationData.phone || ""
      ).trim(),

    email:
      String(
        registrationData.email || ""
      ).trim()
      .toLowerCase(),

    password:
      String(
        registrationData.password || ""
      ),
  };

  console.log(
    "Register payload:",
    {
      ...payload,
      password: "***",
    }
  );

  try {

    const response =
      await api.post(
        "/auth/register",
        payload,
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

    // --------------------------------------------------------
    // Save registration information
    // --------------------------------------------------------

    try {

      saveRegistrationData(
        response.data,
        payload
      );

    } catch (storageError) {

      console.warn(
        "Unable to save registration data:",
        storageError
      );
    }

    return response.data;

  } catch (error) {

    console.error(
      "Student registration API error:",
      error
    );

    throw error;
  }
};


// ============================================================
// LOGIN STUDENT
// ============================================================

export const loginStudent = async (
  email,
  password
) => {

  // ----------------------------------------------------------
  // Normalize input
  // ----------------------------------------------------------

  const normalizedEmail =
    String(email || "")
      .trim()
      .toLowerCase();

  const normalizedPassword =
    String(password || "");

  // ----------------------------------------------------------
  // Validate input
  // ----------------------------------------------------------

  if (!normalizedEmail) {
    throw new Error(
      "Email address is required."
    );
  }

  if (!normalizedPassword) {
    throw new Error(
      "Password is required."
    );
  }

  // ----------------------------------------------------------
  // IMPORTANT:
  // FastAPI LoginRequest expects a JSON OBJECT:
  //
  // {
  //   "email": "...",
  //   "password": "..."
  // }
  // ----------------------------------------------------------

  const payload = {
    email: normalizedEmail,
    password: normalizedPassword,
  };

  console.log(
    "Student login payload:",
    {
      email: normalizedEmail,
      password: "***",
    }
  );

  try {

    const response =
      await api.post(
        "/auth/login",
        payload,
        {
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          timeout: 30000,
        }
      );

    console.log(
      "Student login response:",
      response.data
    );

    // --------------------------------------------------------
    // Validate response
    // --------------------------------------------------------

    if (
      !response.data ||
      typeof response.data !== "object"
    ) {

      throw new Error(
        "Invalid login response from server."
      );
    }

    const accessToken =
      response.data.access_token;

    if (!accessToken) {

      throw new Error(
        "Server did not return an access token."
      );
    }

    // --------------------------------------------------------
    // Store token
    // --------------------------------------------------------

    setStudentToken(
      accessToken
    );

    return response.data;

  } catch (error) {

    console.error(
      "Student login API error:",
      error
    );

    // --------------------------------------------------------
    // Preserve Axios error so Login.jsx can read:
    //
    // error.response.status
    // error.response.data.detail
    // --------------------------------------------------------

    throw error;
  }
};


// ============================================================
// GET CURRENT STUDENT
// ============================================================

export const getCurrentStudent =
  async () => {

    try {

      const response =
        await api.get(
          "/auth/me"
        );

      return response.data;

    } catch (error) {

      console.error(
        "Get current student failed:",
        error
      );

      throw error;
    }
  };


// ============================================================
// LOGOUT STUDENT
// ============================================================

export const logoutStudent =
  async () => {

    try {

      const token =
        getStudentToken();

      if (token) {

        try {

          await api.post(
            "/auth/logout"
          );

        } catch (error) {

          console.warn(
            "Backend logout failed:",
            error
          );
        }
      }

    } finally {

      removeStudentToken();
    }

    return true;
  };


// ============================================================
// CHECK LOGIN STATUS
// ============================================================

export const isStudentLoggedIn =
  () => {

    const token =
      getStudentToken();

    return Boolean(token);
  };


// ============================================================
// CLEAR STUDENT TOKEN
// ============================================================

export const clearStudentToken =
  () => {

    removeStudentToken();
  };


// ============================================================
// STORE REGISTRATION INFORMATION
// ============================================================

export const storeRegistrationInfo =
  (
    response,
    registrationData = {}
  ) => {

    try {

      saveRegistrationData(
        response,
        registrationData
      );

      return getRegistrationData();

    } catch (error) {

      console.error(
        "Unable to store registration information:",
        error
      );

      return null;
    }
  };


// ============================================================
// GET REGISTRATION EMAIL
// ============================================================

export const getRegistrationEmail =
  () => {

    const data =
      getRegistrationData();

    return (
      data?.email ||
      ""
    );
  };


// ============================================================
// GET REGISTRATION PHONE
// ============================================================

export const getRegistrationPhone =
  () => {

    const data =
      getRegistrationData();

    return (
      data?.phone ||
      ""
    );
  };


// ============================================================
// GET REGISTRATION STUDENT ID
// ============================================================

export const getRegistrationStudentId =
  () => {

    const data =
      getRegistrationData();

    return (
      data?.student_id ||
      data?.id ||
      null
    );
  };


// ============================================================
// CLEAR REGISTRATION DATA
// ============================================================

export const clearStoredRegistrationData =
  () => {

    clearRegistrationData();
  };


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
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
