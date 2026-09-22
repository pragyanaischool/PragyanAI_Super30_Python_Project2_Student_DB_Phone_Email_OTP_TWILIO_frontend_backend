// frontend/src/api/api.js

import axios from "axios";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


// ============================================================
// VALIDATE API CONFIGURATION
// ============================================================

if (!API_BASE_URL) {
  console.error(
    "VITE_API_BASE_URL is not configured."
  );

  console.error(
    "Please create frontend/.env and add:"
  );

  console.error(
    "VITE_API_BASE_URL=https://YOUR-RENDER-BACKEND.onrender.com/api"
  );
}


// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  timeout: 30000,
});


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {

    // --------------------------------------------------------
    // Get admin token
    // --------------------------------------------------------

    const adminToken =
      localStorage.getItem("admin_token");


    // --------------------------------------------------------
    // Get student token
    // --------------------------------------------------------

    const studentToken =
      localStorage.getItem("student_token");


    // --------------------------------------------------------
    // Select available token
    // --------------------------------------------------------

    const token =
      adminToken || studentToken;


    // --------------------------------------------------------
    // Add Authorization header
    // --------------------------------------------------------

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    // --------------------------------------------------------
    // Debug information
    // --------------------------------------------------------

    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      config.url
    );


    return config;
  },

  (error) => {

    console.error(
      "API Request Error:",
      error
    );

    return Promise.reject(error);
  }
);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(

  (response) => {

    console.log(
      "API Response:",
      response.status,
      response.config.url
    );

    return response;
  },


  async (error) => {

    // --------------------------------------------------------
    // Network error
    // --------------------------------------------------------

    if (!error.response) {

      console.error(
        "Network Error:",
        error.message
      );

      return Promise.reject(error);
    }


    const status =
      error.response.status;


    // --------------------------------------------------------
    // Unauthorized
    // --------------------------------------------------------

    if (status === 401) {

      console.warn(
        "Authentication token is invalid or expired."
      );


      // ------------------------------------------------------
      // Remove stored tokens
      // ------------------------------------------------------

      localStorage.removeItem(
        "admin_token"
      );

      localStorage.removeItem(
        "student_token"
      );


      // ------------------------------------------------------
      // Determine current page
      // ------------------------------------------------------

      const currentPath =
        window.location.pathname;


      // ------------------------------------------------------
      // Don't redirect if already on login pages
      // ------------------------------------------------------

      const isAdminLoginPage =
        currentPath === "/admin/login";


      const isStudentLoginPage =
        currentPath === "/login";


      if (
        !isAdminLoginPage &&
        !isStudentLoginPage
      ) {

        // ----------------------------------------------------
        // Admin area
        // ----------------------------------------------------

        if (
          currentPath.startsWith(
            "/admin"
          )
        ) {

          window.location.href =
            "/admin/login";

        }

        // ----------------------------------------------------
        // Student area
        // ----------------------------------------------------

        else {

          window.location.href =
            "/login";

        }

      }

    }


    // --------------------------------------------------------
    // Forbidden
    // --------------------------------------------------------

    if (status === 403) {

      console.warn(
        "Access forbidden."
      );

    }


    // --------------------------------------------------------
    // Validation error
    // --------------------------------------------------------

    if (status === 422) {

      console.warn(
        "API validation error:",
        error.response.data
      );

    }


    // --------------------------------------------------------
    // Server error
    // --------------------------------------------------------

    if (status >= 500) {

      console.error(
        "Backend server error:",
        error.response.data
      );

    }


    return Promise.reject(error);
  }
);


// ============================================================
// HEALTH CHECK
// ============================================================

export async function checkApiHealth() {

  const response = await api.get(
    "/../health"
  );

  return response.data;
}


// ============================================================
// API INFORMATION
// ============================================================

export async function getApiInformation() {

  const response = await api.get(
    "/"
  );

  return response.data;
}


// ============================================================
// EXPORT AXIOS INSTANCE
// ============================================================

export default api;
