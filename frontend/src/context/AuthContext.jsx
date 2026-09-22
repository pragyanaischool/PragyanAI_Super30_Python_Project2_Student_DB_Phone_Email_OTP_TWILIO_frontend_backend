// ============================================================
// PragyanAI Student Verification Platform
// File: frontend/src/context/AuthContext.jsx
// ============================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginStudent,
  logoutStudent,
  registerStudent,
  getCurrentStudent,
  isStudentLoggedIn,
  clearStudentToken,
  storeRegistrationInfo,
  getRegistrationEmail,
  getRegistrationPhone,
  getRegistrationStudentId,
} from "../api/authApi";


// ============================================================
// CREATE CONTEXT
// ============================================================

const AuthContext = createContext(null);


// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }) {

  // ----------------------------------------------------------
  // STUDENT STATE
  // ----------------------------------------------------------

  const [student, setStudent] =
    useState(null);

  const [token, setToken] =
    useState(null);

  // ----------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------

  const [loading, setLoading] =
    useState(false);

  const [
    authenticationChecked,
    setAuthenticationChecked,
  ] = useState(false);

  // ----------------------------------------------------------
  // REGISTRATION INFORMATION
  // ----------------------------------------------------------

  const [
    registrationEmail,
    setRegistrationEmail,
  ] = useState(
    getRegistrationEmail()
  );

  const [
    registrationPhone,
    setRegistrationPhone,
  ] = useState(
    getRegistrationPhone()
  );

  const [
    registrationStudentId,
    setRegistrationStudentId,
  ] = useState(
    getRegistrationStudentId()
  );

  // ==========================================================
  // INITIAL AUTHENTICATION CHECK
  // ==========================================================

  useEffect(() => {

    let mounted = true;

    const checkAuthentication =
      async () => {

        try {

          const storedToken =
            localStorage.getItem(
              "student_token"
            );

          if (
            storedToken &&
            isStudentLoggedIn()
          ) {

            try {

              const currentStudent =
                await getCurrentStudent();

              if (mounted) {

                setStudent(
                  currentStudent
                );

                setToken(
                  storedToken
                );
              }

            } catch (error) {

              console.warn(
                "Stored student token is invalid or expired.",
                error
              );

              clearStudentToken();

              if (mounted) {
                setStudent(null);
                setToken(null);
              }
            }

          } else {

            if (mounted) {
              setStudent(null);
              setToken(null);
            }
          }

        } catch (error) {

          console.error(
            "Authentication check failed:",
            error
          );

          if (mounted) {
            setStudent(null);
            setToken(null);
          }

        } finally {

          if (mounted) {
            setAuthenticationChecked(
              true
            );
          }
        }
      };

    checkAuthentication();

    return () => {
      mounted = false;
    };

  }, []);


  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    email,
    password
  ) => {

    setLoading(true);

    try {

      // ------------------------------------------------------
      // CLEAN INPUT
      // ------------------------------------------------------

      const normalizedEmail =
        String(email || "")
          .trim()
          .toLowerCase();

      const normalizedPassword =
        String(password || "");

      // ------------------------------------------------------
      // BASIC VALIDATION
      // ------------------------------------------------------

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

      // ------------------------------------------------------
      // CALL BACKEND
      // ------------------------------------------------------

      const loginResponse =
        await loginStudent(
          normalizedEmail,
          normalizedPassword
        );

      console.log(
        "Login API response:",
        loginResponse
      );

      // ------------------------------------------------------
      // GET TOKEN
      // ------------------------------------------------------

      const accessToken =
        loginResponse?.access_token;

      if (!accessToken) {

        throw new Error(
          "Login succeeded but no access token was returned by the server."
        );
      }

      // ------------------------------------------------------
      // SAVE TOKEN
      // ------------------------------------------------------

      setToken(accessToken);

      // ------------------------------------------------------
      // GET CURRENT STUDENT
      // ------------------------------------------------------

      const currentStudent =
        await getCurrentStudent();

      console.log(
        "Current student:",
        currentStudent
      );

      // ------------------------------------------------------
      // UPDATE STATE
      // ------------------------------------------------------

      setStudent(
        currentStudent
      );

      setAuthenticationChecked(
        true
      );

      return {
        ...loginResponse,
        student: currentStudent,
      };

    } catch (error) {

      console.error(
        "AuthContext login failed:",
        error
      );

      throw error;

    } finally {

      setLoading(false);
    }
  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async () => {

    setLoading(true);

    try {

      try {
        await logoutStudent();
      } catch (error) {

        console.warn(
          "Backend logout request failed:",
          error
        );

        // Local logout should still continue.
      }

    } finally {

      clearStudentToken();

      setStudent(null);
      setToken(null);

      setAuthenticationChecked(
        true
      );

      setLoading(false);
    }
  };


  // ==========================================================
  // REGISTER
  // ==========================================================

  const register = async (
    registrationData
  ) => {

    setLoading(true);

    try {

      const response =
        await registerStudent(
          registrationData
        );

      // ------------------------------------------------------
      // SAVE REGISTRATION INFORMATION
      // ------------------------------------------------------

      try {

        storeRegistrationInfo(
          response,
          registrationData
        );

        setRegistrationEmail(
          getRegistrationEmail()
        );

        setRegistrationPhone(
          getRegistrationPhone()
        );

        setRegistrationStudentId(
          getRegistrationStudentId()
        );

      } catch (storageError) {

        console.warn(
          "Unable to save registration information:",
          storageError
        );
      }

      return response;

    } finally {

      setLoading(false);
    }
  };


  // ==========================================================
  // REFRESH STUDENT
  // ==========================================================

  const refreshStudent =
    async () => {

      try {

        if (
          !isStudentLoggedIn()
        ) {
          return null;
        }

        const currentStudent =
          await getCurrentStudent();

        setStudent(
          currentStudent
        );

        return currentStudent;

      } catch (error) {

        console.error(
          "Unable to refresh student:",
          error
        );

        throw error;
      }
    };


  // ==========================================================
  // UPDATE STUDENT
  // ==========================================================

  const updateStudent = (
    updatedStudent
  ) => {

    setStudent(
      updatedStudent
    );

    return updatedStudent;
  };


  // ==========================================================
  // AUTHENTICATION STATUS
  // ==========================================================

  const isAuthenticated =
    Boolean(student && token);

  const hasToken =
    Boolean(token);


  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const contextValue = {

    // Student
    student,
    setStudent,

    // Token
    token,
    setToken,

    // Loading
    loading,

    // Authentication
    isAuthenticated,
    authenticationChecked,
    hasToken,

    // Actions
    login,
    logout,
    register,
    refreshStudent,
    updateStudent,

    // Registration
    registrationEmail,
    registrationPhone,
    registrationStudentId,

    // Compatibility
    getCurrentStudent,
  };


  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ============================================================
// USE AUTH HOOK
// ============================================================

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AuthContext;
