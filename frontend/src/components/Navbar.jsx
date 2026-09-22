import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const studentToken = localStorage.getItem("student_token");
  const adminToken = localStorage.getItem("admin_token");

  const isStudentLoggedIn = Boolean(studentToken);
  const isAdminLoggedIn = Boolean(adminToken);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleStudentLogout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("registration_email");
    localStorage.removeItem("registration_phone");
    localStorage.removeItem("registration_student_id");

    closeMenu();
    navigate("/login");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_token");

    closeMenu();
    navigate("/admin/login");
  };

  const navLinkClass = ({ isActive }) =>
    `navbar-link ${isActive ? "active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMenu}
        >
          <div className="navbar-logo">
            P
          </div>

          <div className="navbar-brand-text">
            <span className="navbar-title">
              PragyanAI
            </span>

            <span className="navbar-subtitle">
              Student Verification
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-navigation">
          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>

          {!isStudentLoggedIn &&
            !isAdminLoggedIn && (
              <>
                <NavLink
                  to="/register"
                  className={navLinkClass}
                >
                  Register
                </NavLink>

                <NavLink
                  to="/login"
                  className={navLinkClass}
                >
                  Student Login
                </NavLink>
              </>
            )}

          {isStudentLoggedIn && (
            <>
              <NavLink
                to="/student/dashboard"
                className={navLinkClass}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/student/profile"
                className={navLinkClass}
              >
                Profile
              </NavLink>

              <button
                type="button"
                className="navbar-button logout-button"
                onClick={handleStudentLogout}
              >
                Logout
              </button>
            </>
          )}

          {isAdminLoggedIn && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={navLinkClass}
              >
                Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/students"
                className={navLinkClass}
              >
                Students
              </NavLink>

              <button
                type="button"
                className="navbar-button logout-button"
                onClick={handleAdminLogout}
              >
                Logout
              </button>
            </>
          )}

          {!isAdminLoggedIn &&
            !isStudentLoggedIn && (
              <NavLink
                to="/admin/login"
                className="navbar-admin-link"
              >
                Admin
              </NavLink>
            )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="navbar-mobile-button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
        >
          <span />
          <span />
          <span />
        </button>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="navbar-mobile-menu">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Home
            </NavLink>

            {!isStudentLoggedIn &&
              !isAdminLoggedIn && (
                <>
                  <NavLink
                    to="/register"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    Register
                  </NavLink>

                  <NavLink
                    to="/login"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    Student Login
                  </NavLink>

                  <NavLink
                    to="/admin/login"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    Admin Login
                  </NavLink>
                </>
              )}

            {isStudentLoggedIn && (
              <>
                <NavLink
                  to="/student/dashboard"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/student/profile"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>

                <button
                  type="button"
                  className="navbar-mobile-action"
                  onClick={handleStudentLogout}
                >
                  Logout
                </button>
              </>
            )}

            {isAdminLoggedIn && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </NavLink>

                <NavLink
                  to="/admin/students"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Students
                </NavLink>

                <button
                  type="button"
                  className="navbar-mobile-action"
                  onClick={handleAdminLogout}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
