// frontend/src/pages/AdminLogin.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  adminLogin,
  isAdminLoggedIn,
} from "../api/adminApi";


// ============================================================
// ADMIN LOGIN PAGE
// ============================================================

function AdminLogin() {

  const navigate = useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================================
  // IF ALREADY LOGGED IN
  // ==========================================================

  // We intentionally don't redirect during render.
  // The user can still submit/login normally.
  // Dashboard protection should be handled by routing.


  // ==========================================================
  // HANDLE LOGIN
  // ==========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    // --------------------------------------------------------
    // Validate email
    // --------------------------------------------------------

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {

      setError(
        "Please enter your email address."
      );

      return;
    }


    // --------------------------------------------------------
    // Validate password
    // --------------------------------------------------------

    if (!password) {

      setError(
        "Please enter your password."
      );

      return;
    }


    // --------------------------------------------------------
    // Start loading
    // --------------------------------------------------------

    setLoading(true);


    try {

      // ------------------------------------------------------
      // Login
      // ------------------------------------------------------

      const result = await adminLogin(
        cleanEmail,
        password
      );


      // ------------------------------------------------------
      // Validate token
      // ------------------------------------------------------

      if (!result?.access_token) {

        throw new Error(
          "Login succeeded but no access token was returned."
        );
      }


      // ------------------------------------------------------
      // Token is already stored by adminLogin()
      // ------------------------------------------------------

      setSuccess(
        "Login successful. Redirecting..."
      );


      // ------------------------------------------------------
      // Redirect to dashboard
      // ------------------------------------------------------

      setTimeout(() => {

        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

      }, 500);


    } catch (err) {

      console.error(
        "Admin login failed:",
        err
      );


      // ------------------------------------------------------
      // Extract backend error
      // ------------------------------------------------------

      let errorMessage =
        "Invalid email or password.";


      if (
        err?.response?.data?.detail
      ) {

        const detail =
          err.response.data.detail;


        if (typeof detail === "string") {

          errorMessage = detail;

        } else if (
          Array.isArray(detail)
        ) {

          errorMessage =
            detail
              .map(
                (item) =>
                  item?.msg ||
                  "Invalid input."
              )
              .join(", ");

        }

      } else if (err?.message) {

        errorMessage =
          err.message;

      }


      setError(errorMessage);

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="admin-login-page">

      {/* ================================================== */}
      {/* BACKGROUND */}
      {/* ================================================== */}

      <div className="admin-login-background">

        <div className="admin-login-orb orb-one" />

        <div className="admin-login-orb orb-two" />

        <div className="admin-login-grid" />

      </div>


      {/* ================================================== */}
      {/* MAIN CONTAINER */}
      {/* ================================================== */}

      <main className="admin-login-container">

        {/* ================================================= */}
        {/* BRAND */}
        {/* ================================================= */}

        <div className="admin-brand">

          <Link
            to="/"
            className="back-link"
          >
            ← PragyanAI
          </Link>
