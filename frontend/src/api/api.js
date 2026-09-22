import axios from "axios";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
| Local:
|   VITE_API_BASE_URL=http://127.0.0.1:8000/api
|
| Production:
|   VITE_API_BASE_URL=https://your-render-service.onrender.com/api
|
*/

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn(
    "VITE_API_BASE_URL is not configured. " +
      "Please create frontend/.env and add VITE_API_BASE_URL."
  );
}

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_BASE_URL || "http://127.0.0.1:8000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
|
| Automatically attaches the appropriate JWT token.
|
| Admin:
|   admin_token
|
| Student:
|   student_token
|
*/

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("admin_token");
    const studentToken = localStorage.getItem("student_token");

    /*
     * Admin routes should use admin token.
     */
    if (config.url?.startsWith("/admin") && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    /*
     * Student routes should use student token.
     */
    else if (
      !config.url?.startsWith("/admin") &&
      studentToken
    ) {
      config.headers.Authorization = `Bearer ${studentToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
|
| Handles:
|   401 Unauthorized
|   403 Forbidden
|   Network errors
|
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    /*
     * No response from backend.
     */
    if (!error.response) {
      console.error(
        "API Network Error:",
        error.message
      );

      return Promise.reject(error);
    }

    const status = error.response.status;
    const currentPath = window.location.pathname;

    /*
     * 401 Unauthorized
     */
    if (status === 401) {
      /*
       * Admin session expired.
       */
      if (
        currentPath.startsWith("/admin") &&
        currentPath !== "/admin/login"
      ) {
        localStorage.removeItem("admin_token");

        window.location.href = "/admin/login";
      }

      /*
       * Student session expired.
       */
      else if (
        !currentPath.startsWith("/admin") &&
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        currentPath !== "/verify-email" &&
        currentPath !== "/verify-phone"
      ) {
        localStorage.removeItem("student_token");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
