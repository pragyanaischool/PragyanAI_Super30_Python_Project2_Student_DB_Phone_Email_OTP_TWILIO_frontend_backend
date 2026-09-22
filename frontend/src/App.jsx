import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================================================
   COMMON COMPONENTS
   ========================================================= */

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import StudentProtectedRoute from "./components/StudentProtectedRoute";

/* =========================================================
   PUBLIC PAGES
   ========================================================= */

import Home from "./pages/Home";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import PhoneVerification from "./pages/PhoneVerification";
import Login from "./pages/Login";

/* =========================================================
   STUDENT PAGES
   ========================================================= */

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";

/* =========================================================
   ADMIN PAGES
   ========================================================= */

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminStudentDetails from "./pages/AdminStudentDetails";

/* =========================================================
   PUBLIC LAYOUT
   ========================================================= */

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="app-main">
        {children}
      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   STUDENT LAYOUT
   ========================================================= */

function StudentLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="app-main student-app-main">
        {children}
      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   ADMIN LAYOUT
   ========================================================= */

function AdminLayout({ children }) {
  return (
    <main className="admin-app-main">
      {children}
    </main>
  );
}

/* =========================================================
   404 PAGE
   ========================================================= */

function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          padding: "50px 30px",
          borderRadius: "20px",
          background: "#ffffff",
          boxShadow: "0 15px 50px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: "800",
            lineHeight: "1",
            marginBottom: "15px",
          }}
        >
          404
        </div>

        <h1
          style={{
            marginBottom: "12px",
            fontSize: "30px",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "28px",
            lineHeight: "1.6",
          }}
        >
          The page you are looking for does not exist or may
          have been moved.
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            border: "none",
            borderRadius: "10px",
            padding: "12px 24px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   APPLICATION
   ========================================================= */

function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
         ===================================================== */}

      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />

      <Route
        path="/verify-email"
        element={
          <PublicLayout>
            <EmailVerification />
          </PublicLayout>
        }
      />

      <Route
        path="/verify-phone"
        element={
          <PublicLayout>
            <PhoneVerification />
          </PublicLayout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />

      {/* =====================================================
          STUDENT ROUTES
         ===================================================== */}

      <Route
        path="/student"
        element={
          <StudentProtectedRoute>
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </StudentProtectedRoute>
        }
      />

      <Route
        path="/student/dashboard"
        element={
          <StudentProtectedRoute>
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </StudentProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <StudentProtectedRoute>
            <StudentLayout>
              <StudentProfile />
            </StudentLayout>
          </StudentProtectedRoute>
        }
      />

      {/* =====================================================
          ADMIN LOGIN
         ===================================================== */}

      <Route
        path="/admin"
        element={
          <Navigate
            to="/admin/login"
            replace
          />
        }
      />

      <Route
        path="/admin/login"
        element={
          <AdminLayout>
            <AdminLogin />
          </AdminLayout>
        }
      />

      {/* =====================================================
          ADMIN DASHBOARD
         ===================================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />

      {/* =====================================================
          ADMIN STUDENTS
         ===================================================== */}

      <Route
        path="/admin/students"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />

      {/* =====================================================
          ADMIN STUDENT DETAILS
         ===================================================== */}

      <Route
        path="/admin/students/:studentId"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminStudentDetails />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />

      {/* =====================================================
          ADMIN STATUS FILTER ROUTES
         ===================================================== */}

      <Route
        path="/admin/students/pending"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/students/approved"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/students/rejected"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />

      {/* =====================================================
          FALLBACK
         ===================================================== */}

      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />

    </Routes>
  );
}

export default App;
