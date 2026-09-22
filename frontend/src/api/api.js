// ============================================================
// PragyanAI Student Verification Platform
// File: frontend/src/api/api.js
// ============================================================

import axios from "axios";


// ============================================================
// API BASE URL
// ============================================================
//
// Netlify Production:
// VITE_API_BASE_URL
//
// Expected value:
//
// https://pragyanai-super30-python-project2-yspf.onrender.com/api
//
// Local development fallback:
//
// http://localhost:8000/api
// ============================================================

const ENV_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


// ============================================================
// NORMALIZE API URL
// ============================================================

const normalizeBaseURL = (url) => {

  if (!url) {
    return "";
  }

  return String(url)
    .trim()
    .replace(/\/+$/, "");
};


// ============================================================
// FINAL API BASE URL
// ============================================================

const API_BASE_URL =
  normalizeBaseURL(
    ENV_API_BASE_URL
  ) ||
  "http://localhost:8000/api";


// ============================================================
// DEBUG INFORMATION
// ============================================================
//
// This is safe to expose because it does not contain passwords
// or API secrets.
// ============================================================

console.log(
  "================================================"
);

console.log(
  "PragyanAI API Configuration"
);

console.log(
  "VITE_API_BASE_URL:",
  ENV_API_BASE_URL || "(not configured)"
);

console.log(
  "Final API Base URL:",
  API_BASE_URL
);

console.log(
  "================================================"
);


// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: 30000,

  headers: {
    "Content-Type":
      "application/json",

    Accept:
      "application/json",
  },

});


// ============================================================
// TOKEN HELPERS
// ============================================================

const getStudentToken = () => {

  try {

    return localStorage.getItem(
      "student_token"
    );

  } catch (error) {

    console.warn(
      "Unable to read student token:",
      error
    );

    return null;
  }
};


const getAdminToken = () => {

  try {

    return localStorage.getItem(
      "admin_token"
    );

  } catch (error) {

    console.warn(
      "Unable to read admin token:",
      error
    );

    return null;
  }
};


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(

  (config) => {

    // --------------------------------------------------------
    // Ensure headers exist
    // --------------------------------------------------------

    config.headers =
      config.headers || {};

    // --------------------------------------------------------
    // Current request URL
    // --------------------------------------------------------

    const requestUrl =
      config.url || "";

    // --------------------------------------------------------
    // Detect admin request
    // --------------------------------------------------------

    const isAdminRequest =
      requestUrl.startsWith(
        "/admin"
      );

    // --------------------------------------------------------
    // Get tokens
    // --------------------------------------------------------

    const studentToken =
      getStudentToken();

    const adminToken =
      getAdminToken();

    // --------------------------------------------------------
    // Select token
    // --------------------------------------------------------

    let token = null;

    if (
      isAdminRequest &&
      adminToken
    ) {

      token = adminToken;

    } else if (
      !isAdminRequest &&
      studentToken
    ) {

      token = studentToken;
    }

    // --------------------------------------------------------
    // Add Authorization header
    // --------------------------------------------------------

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    } else {

      // ------------------------------------------------------
      // Make sure an old Authorization header is not reused.
      // ------------------------------------------------------

      delete config.headers.Authorization;
    }

    // --------------------------------------------------------
    // Debug request
    // --------------------------------------------------------

    const fullURL =
      `${config.baseURL || ""}${config.url || ""}`;

    console.log(
      "------------------------------------------------"
    );

    console.log(
      "PragyanAI API REQUEST"
    );

    console.log(
      "Method:",
      config.method?.toUpperCase()
    );

    console.log(
      "URL:",
      fullURL
    );

    console.log(
      "Admin Request:",
      isAdminRequest
    );

    console.log(
      "Authorization:",
      token
        ? "Bearer token attached"
        : "No token"
    );

    // --------------------------------------------------------
    // NEVER print passwords.
    // --------------------------------------------------------

    if (
      config.data &&
      typeof config.data === "object"
    ) {

      const safeData = {
        ...config.data,
      };

      if (
        Object.prototype.hasOwnProperty.call(
          safeData,
          "password"
        )
      ) {

        safeData.password =
          "***";
      }

      if (
        Object.prototype.hasOwnProperty.call(
          safeData,
          "otp"
        )
      ) {

        safeData.otp =
          "***";
      }

      console.log(
        "Request Data:",
        safeData
      );
    }

    console.log(
      "------------------------------------------------"
    );

    return config;
  },

  (error) => {

    console.error(
      "API Request Interceptor Error:",
      error
    );

    return Promise.reject(
      error
    );
  }
);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(

  // ----------------------------------------------------------
  // SUCCESS
  // ----------------------------------------------------------

  (response) => {

    console.log(
      "------------------------------------------------"
    );

    console.log(
      "PragyanAI API RESPONSE"
    );

    console.log(
      "Status:",
      response.status
    );

    console.log(
      "URL:",
      response.config?.url
    );

    console.log(
      "Response:",
      response.data
    );

    console.log(
      "------------------------------------------------"
    );

    return response;
  },


  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  (error) => {

    // --------------------------------------------------------
    // NO HTTP RESPONSE
    //
    // This means browser could not receive a response.
    //
    // Typical causes:
    // - wrong API URL
    // - Render unavailable
    // - CORS
    // - network connection
    // - timeout
    // --------------------------------------------------------

    if (!error.response) {

      console.error(
        "================================================"
      );

      console.error(
        "PragyanAI API NETWORK ERROR"
      );

      console.error(
        "================================================"
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Code:",
        error.code
      );

      console.error(
        "Base URL:",
        error.config?.baseURL
      );

      console.error(
        "Request URL:",
        error.config?.url
      );

      console.error(
        "Full URL:",
        `${error.config?.baseURL || ""}${error.config?.url || ""}`
      );

      console.error(
        "================================================"
      );

      return Promise.reject(
        error
      );
    }


    // --------------------------------------------------------
    // HTTP ERROR RESPONSE
    // --------------------------------------------------------

    const status =
      error.response.status;

    const responseData =
      error.response.data;

    console.error(
      "================================================"
    );

    console.error(
      "PragyanAI API HTTP ERROR"
    );

    console.error(
      "Status:",
      status
    );

    console.error(
      "URL:",
      error.config?.url
    );

    console.error(
      "Response:",
      responseData
    );

    console.error(
      "================================================"
    );


    // --------------------------------------------------------
    // 401 UNAUTHORIZED
    // --------------------------------------------------------

    if (
      status === 401
    ) {

      const requestUrl =
        error.config?.url || "";

      // ------------------------------------------------------
      // Do NOT remove tokens during login.
      // ------------------------------------------------------

      const isLoginRequest =
        requestUrl.includes(
          "/auth/login"
        ) ||
        requestUrl.includes(
          "/admin/login"
        );

      if (!isLoginRequest) {

        try {

          localStorage.removeItem(
            "student_token"
          );

          localStorage.removeItem(
            "admin_token"
          );

        } catch (storageError) {

          console.warn(
            "Unable to clear authentication tokens:",
            storageError
          );
        }
      }
    }


    // --------------------------------------------------------
    // 403 FORBIDDEN
    // --------------------------------------------------------

    if (
      status === 403
    ) {

      console.warn(
        "API returned 403 Forbidden."
      );

      console.warn(
        "Response:",
        responseData
      );
    }


    // --------------------------------------------------------
    // 422 VALIDATION ERROR
    // --------------------------------------------------------

    if (
      status === 422
    ) {

      console.warn(
        "API returned 422 Validation Error."
      );

      console.warn(
        "FastAPI validation response:",
        responseData
      );
    }


    // --------------------------------------------------------
    // 500 SERVER ERROR
    // --------------------------------------------------------

    if (
      status >= 500
    ) {

      console.error(
        "Backend server error:",
        responseData
      );
    }


    // --------------------------------------------------------
    // Always preserve original Axios error.
    // --------------------------------------------------------

    return Promise.reject(
      error
    );
  }
);


// ============================================================
// EXPORT AXIOS INSTANCE
// ============================================================

export default api;
