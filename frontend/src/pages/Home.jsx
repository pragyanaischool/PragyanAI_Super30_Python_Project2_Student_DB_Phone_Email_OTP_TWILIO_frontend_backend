import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

function Home() {
  const { isAuthenticated: studentAuthenticated } = useAuth();
  const { isAuthenticated: adminAuthenticated } = useAdmin();

  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            🎓 PragyanAI Student Verification Platform
          </span>

          <h1>
            Student Registration,
            <br />
            <span>Verification &amp; Career Portal</span>
          </h1>

          <p className="hero-description">
            Securely register your student profile, verify your email and
            mobile number using OTP, and access your PragyanAI student portal.
          </p>

          <div className="hero-actions">
            {studentAuthenticated ? (
              <Link to="/student/dashboard" className="btn btn-primary btn-lg">
                Go to Student Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Register as Student
                </Link>

                <Link to="/login" className="btn btn-secondary btn-lg">
                  Student Login
                </Link>
              </>
            )}
          </div>

          {adminAuthenticated && (
            <div className="hero-admin-link">
              <Link to="/admin/dashboard">
                Open Admin Dashboard →
              </Link>
            </div>
          )}
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-icon">🔐</div>
            <h3>Secure Verification</h3>
            <p>Email + Mobile OTP verification</p>
          </div>

          <div className="hero-card">
            <div className="hero-card-icon">👨‍🎓</div>
            <h3>Student Profile</h3>
            <p>Manage your academic information</p>
          </div>

          <div className="hero-card">
            <div className="hero-card-icon">🚀</div>
            <h3>Career Access</h3>
            <p>Access your PragyanAI student journey</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span>Why this platform?</span>
          <h2>Everything in one place</h2>
          <p>
            A secure student identity and verification platform for the
            PragyanAI ecosystem.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Email Verification</h3>
            <p>
              Verify your registered email address through a secure OTP.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Phone Verification</h3>
            <p>
              Verify your mobile number using Twilio OTP verification.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Admin Approval</h3>
            <p>
              Verified student registrations are reviewed by the
              administration.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Student Portal</h3>
            <p>
              Access your verified profile and student information securely.
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-heading">
          <span>Simple Process</span>
          <h2>How it works</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h3>Register</h3>
            <p>Enter your academic and contact information.</p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <h3>Email OTP</h3>
            <p>Verify your registered email address.</p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <h3>Phone OTP</h3>
            <p>Verify your mobile number.</p>
          </div>

          <div className="step-card">
            <span className="step-number">04</span>
            <h3>Approval</h3>
            <p>Wait for administrator approval.</p>
          </div>

          <div className="step-card">
            <span className="step-number">05</span>
            <h3>Login</h3>
            <p>Access your student dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
