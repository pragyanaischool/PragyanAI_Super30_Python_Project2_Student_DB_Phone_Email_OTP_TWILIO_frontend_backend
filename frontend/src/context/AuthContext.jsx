import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
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

/*
|--------------------------------------------------------------------------
| AUTH CONTEXT
|--------------------------------------------------------------------------
*/

const AuthContext = createContext(null);

/*
|--------------------------------------------------------------------------
| AUTH PROVIDER
|--------------------------------------------------------------------------
*/

export function AuthProvider({ children }) {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [student, setStudent] =
    useState(null);

  const [token, setToken] =
    useState(() =>
      localStorage.getItem(
        "student_token"
      )
    );

  const [loading, setLoading] =
    useState(true);

  const [
    authenticationChecked,
    setAuthenticationChecked,
  ] = useState(false);

  const [
    registrationEmail,
    setRegistrationEmail,
  ] = useState(() =>
    getRegistrationEmail()
  );

  const [
    registrationPhone,
    setRegistrationPhone,
  ] = useState(() =>
    getRegistrationPhone()
  );

  const [
    registrationStudentId,
    setRegistrationStudentId,
  ] = useState(() =>
    getRegistrationStudentId()
  );

  /*
  |--------------------------------------------------------------------------
  | CHECK CURRENT STUDENT
  |--------------------------------------------------------------------------
  |
  | When the page is refreshed:
  |
  | Browser
  |    ↓
  | student_token
  |    ↓
  | /auth/me
  |    ↓
  | Student information
  |
  */

  const checkAuthentication =
    async () => {
      const storedToken =
        localStorage.getItem(
          "student_token"
        );

      /*
       * No token means the student
       * is not logged in.
       */
      if (!storedToken) {
        setStudent(null);
        setToken(null);
        setLoading(false);
        setAuthenticationChecked(true);

        return;
      }

      try {
        setLoading(true);

        const currentStudent =
          await getCurrentStudent();

        /*
         * Backend successfully
         * validated the token.
         */
        setStudent(
          currentStudent
        );

        setToken(
          storedToken
        );
      } catch (error) {
        /*
         * Token is invalid,
         * expired, or backend
         * rejected it.
         */
        console.warn(
          "Student authentication check failed:",
          error
        );

        clearStudentToken();

        setStudent(null);
        setToken(null);
      } finally {
        setLoading(false);
        setAuthenticationChecked(
          true
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | INITIAL AUTHENTICATION CHECK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    checkAuthentication();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const login = async (
    email,
    password
  ) => {
    setLoading(true);

    try {
      const response =
        await loginStudent(
          email,
          password
        );

      /*
       * authApi.js stores the token.
       */
      const storedToken =
        localStorage.getItem(
          "student_token"
        );

      if (storedToken) {
        setToken(
          storedToken
        );
      }

      /*
       * Some backend implementations
       * may return student information
       * directly.
       */
      if (response?.student) {
        setStudent(
          response.student
        );
      } else {
        /*
         * Otherwise retrieve the
         * authenticated student.
         */
        try {
          const currentStudent =
            await getCurrentStudent();

          setStudent(
            currentStudent
          );
        } catch (profileError) {
          console.warn(
            "Unable to retrieve student profile after login:",
            profileError
          );
        }
      }

      return response;
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    /*
     * Clear local authentication state.
     */
    clearStudentToken();

    setStudent(null);
    setToken(null);

    /*
     * Clear registration data.
     */
    localStorage.removeItem(
      "registration_email"
    );

    localStorage.removeItem(
      "registration_phone"
    );

    localStorage.removeItem(
      "registration_student_id"
    );

    setRegistrationEmail(null);
    setRegistrationPhone(null);
    setRegistrationStudentId(null);
  };

  /*
  |--------------------------------------------------------------------------
  | REGISTER STUDENT
  |--------------------------------------------------------------------------
  |
  | Registration itself does not necessarily
  | authenticate the student.
  |
  | Registration response is stored so that
  | EmailVerification and PhoneVerification
  | can continue the process.
  |
  */

  const register = async (
    studentData
  ) => {
    setLoading(true);

    try {
      const response =
        await registerStudent(
          studentData
        );

      /*
       * Store registration information.
       */
      storeRegistrationInfo(
        response
      );

      /*
       * If backend returns values that
       * were not included in response,
       * use the original registration
       * data as fallback.
       */

      const email =
        response?.email ||
        studentData?.email ||
        null;

      const phone =
        response?.phone ||
        studentData?.phone ||
        null;

      const studentId =
        response?.student_id ||
        null;

      if (email) {
        localStorage.setItem(
          "registration_email",
          email
        );

        setRegistrationEmail(
          email
        );
      }

      if (phone) {
        localStorage.setItem(
          "registration_phone",
          phone
        );

        setRegistrationPhone(
          phone
        );
      }

      if (studentId) {
        localStorage.setItem(
          "registration_student_id",
          String(studentId)
        );

        setRegistrationStudentId(
          String(studentId)
        );
      }

      /*
       * If registration endpoint
       * also returns an access token,
       * maintain authentication.
       */
      const storedToken =
        localStorage.getItem(
          "student_token"
        );

      if (storedToken) {
        setToken(
          storedToken
        );
      }

      return response;
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REFRESH STUDENT
  |--------------------------------------------------------------------------
  |
  | Useful after profile update,
  | OTP verification, or approval.
  |
  */

  const refreshStudent =
    async () => {
      try {
        const currentStudent =
          await getCurrentStudent();

        setStudent(
          currentStudent
        );

        return currentStudent;
      } catch (error) {
        /*
         * If authentication has
         * become invalid, clear it.
         */
        if (
          error?.response?.status ===
          401
        ) {
          clearStudentToken();

          setStudent(null);
          setToken(null);
        }

        throw error;
      }
    };

  /*
  |--------------------------------------------------------------------------
  | UPDATE STUDENT IN CONTEXT
  |--------------------------------------------------------------------------
  |
  | Allows pages to immediately update
  | the local student state.
  |
  */

  const updateStudent = (
    updatedStudent
  ) => {
    setStudent(
      updatedStudent
    );
  };

  /*
  |--------------------------------------------------------------------------
  | AUTHENTICATION FLAGS
  |--------------------------------------------------------------------------
  */

  const isAuthenticated =
    Boolean(
      token && student
    );

  const hasToken =
    Boolean(token);

  /*
  |--------------------------------------------------------------------------
  | CONTEXT VALUE
  |--------------------------------------------------------------------------
  */

  const contextValue = useMemo(
    () => ({
      /*
       * Student
       */
      student,

      setStudent,
      updateStudent,
      refreshStudent,

      /*
       * Authentication
       */
      token,
      isAuthenticated,
      hasToken,

      /*
       * Loading
       */
      loading,
      authenticationChecked,

      /*
       * Actions
       */
      login,
      logout,
      register,

      /*
       * Registration data
       */
      registrationEmail,
      registrationPhone,
      registrationStudentId,

      /*
       * Utility
       */
      checkAuthentication,
      isStudentLoggedIn,
    }),
    [
      student,
      token,
      isAuthenticated,
      hasToken,
      loading,
      authenticationChecked,
      registrationEmail,
      registrationPhone,
      registrationStudentId,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | PROVIDER
  |--------------------------------------------------------------------------
  */

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| USE AUTH
|--------------------------------------------------------------------------
|
| Usage:
|
| const {
|   student,
|   login,
|   logout,
|   isAuthenticated
| } = useAuth();
|
*/

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
}

export default AuthContext;
