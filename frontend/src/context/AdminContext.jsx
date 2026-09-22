import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  isAdminLoggedIn,
  clearAdminToken,
  getAdminToken,
} from "../api/adminApi";

/*
|--------------------------------------------------------------------------
| ADMIN CONTEXT
|--------------------------------------------------------------------------
*/

const AdminContext =
  createContext(null);

/*
|--------------------------------------------------------------------------
| ADMIN PROVIDER
|--------------------------------------------------------------------------
*/

export function AdminProvider({
  children,
}) {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [admin, setAdmin] =
    useState(null);

  const [token, setToken] =
    useState(() =>
      getAdminToken()
    );

  const [loading, setLoading] =
    useState(true);

  const [
    authenticationChecked,
    setAuthenticationChecked,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CHECK ADMIN AUTHENTICATION
  |--------------------------------------------------------------------------
  |
  | Browser refresh:
  |
  | admin_token
  |     ↓
  | GET /api/admin/me
  |     ↓
  | Admin profile
  |
  */

  const checkAuthentication =
    async () => {
      const storedToken =
        getAdminToken();

      /*
       * No admin token.
       */
      if (!storedToken) {
        setAdmin(null);
        setToken(null);
        setLoading(false);
        setAuthenticationChecked(true);

        return;
      }

      try {
        setLoading(true);

        /*
         * Backend validates JWT.
         */
        const adminProfile =
          await getAdminProfile();

        setAdmin(
          adminProfile
        );

        setToken(
          storedToken
        );
      } catch (error) {
        console.warn(
          "Admin authentication check failed:",
          error
        );

        /*
         * Invalid/expired token.
         */
        clearAdminToken();

        setAdmin(null);
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
  | ADMIN LOGIN
  |--------------------------------------------------------------------------
  */

  const login = async (
    email,
    password
  ) => {
    setLoading(true);

    try {
      /*
       * adminApi.js calls:
       *
       * POST /api/admin/login
       */
      const response =
        await adminLogin(
          email,
          password
        );

      /*
       * Retrieve newly stored JWT.
       */
      const storedToken =
        getAdminToken();

      if (storedToken) {
        setToken(
          storedToken
        );
      }

      /*
       * Some backend implementations
       * may return admin information
       * directly.
       */
      if (response?.admin) {
        setAdmin(
          response.admin
        );
      } else {
        /*
         * Retrieve authenticated admin
         * profile from backend.
         */
        try {
          const adminProfile =
            await getAdminProfile();

          setAdmin(
            adminProfile
          );
        } catch (profileError) {
          console.warn(
            "Unable to retrieve admin profile after login:",
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
  | ADMIN LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    /*
     * Clear admin token.
     */
    clearAdminToken();

    /*
     * Clear context.
     */
    setAdmin(null);
    setToken(null);
  };

  /*
  |--------------------------------------------------------------------------
  | REFRESH ADMIN PROFILE
  |--------------------------------------------------------------------------
  */

  const refreshAdmin =
    async () => {
      try {
        const adminProfile =
          await getAdminProfile();

        setAdmin(
          adminProfile
        );

        return adminProfile;
      } catch (error) {
        if (
          error?.response?.status ===
          401
        ) {
          clearAdminToken();

          setAdmin(null);
          setToken(null);
        }

        throw error;
      }
    };

  /*
  |--------------------------------------------------------------------------
  | UPDATE ADMIN STATE
  |--------------------------------------------------------------------------
  */

  const updateAdmin = (
    updatedAdmin
  ) => {
    setAdmin(
      updatedAdmin
    );
  };

  /*
  |--------------------------------------------------------------------------
  | AUTH FLAGS
  |--------------------------------------------------------------------------
  */

  const isAuthenticated =
    Boolean(
      token && admin
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
       * Admin
       */
      admin,

      setAdmin,
      updateAdmin,
      refreshAdmin,

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

      /*
       * Utility
       */
      checkAuthentication,
      isAdminLoggedIn,
    }),
    [
      admin,
      token,
      isAuthenticated,
      hasToken,
      loading,
      authenticationChecked,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | PROVIDER
  |--------------------------------------------------------------------------
  */

  return (
    <AdminContext.Provider
      value={contextValue}
    >
      {children}
    </AdminContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| USE ADMIN
|--------------------------------------------------------------------------
|
| Usage:
|
| const {
|   admin,
|   login,
|   logout,
|   isAuthenticated
| } = useAdmin();
|
*/

export function useAdmin() {
  const context =
    useContext(
      AdminContext
    );

  if (!context) {
    throw new Error(
      "useAdmin must be used inside an AdminProvider."
    );
  }

  return context;
}

export default AdminContext;
