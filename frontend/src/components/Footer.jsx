import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link
              to="/"
              className="footer-logo-link"
            >
              <div className="footer-logo">
                P
              </div>

              <div>
                <h3>PragyanAI</h3>
                <p>
                  Student Verification Platform
                </p>
              </div>
            </Link>

            <p className="footer-description">
              Secure student registration,
              verification, authentication and
              approval platform powered by
              PragyanAI.
            </p>
          </div>

          {/* Student */}
          <div className="footer-section">
            <h4>Student</h4>

            <Link to="/register">
              Register
            </Link>

            <Link to="/login">
              Student Login
            </Link>

            <Link to="/verify-email">
              Email Verification
            </Link>

            <Link to="/verify-phone">
              Phone Verification
            </Link>
          </div>

          {/* Administration */}
          <div className="footer-section">
            <h4>Administration</h4>

            <Link to="/admin/login">
              Admin Login
            </Link>

            <Link to="/admin/dashboard">
              Dashboard
            </Link>

            <Link to="/admin/students">
              Students
            </Link>
          </div>

          {/* Platform */}
          <div className="footer-section">
            <h4>Platform</h4>

            <p>Secure Authentication</p>
            <p>Email OTP</p>
            <p>Phone OTP</p>
            <p>Admin Approval</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} PragyanAI.
            All rights reserved.
          </p>

          <p>
            Student Verification Platform
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
