import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { sendEmailOTP, verifyEmailOTP } from "../api/otpApi";
import OTPInput from "../components/OTPInput";
import { getRegistrationEmail } from "../api/authApi";
import { OTP_RESEND_SECONDS } from "../utils/constants";

function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";
  const emailFromStorage = getRegistrationEmail();

  const email = emailFromState || emailFromStorage;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCountdown((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (email) {
      handleSendOTP(true);
    }
    // Intentionally only on initial page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const extractMessage = (errorObject, fallback) => {
    const detail = errorObject?.response?.data?.detail;

    if (Array.isArray(detail)) {
      return detail
        .map((item) => item?.msg || "Validation error")
        .join(", ");
    }

    return detail || errorObject?.message || fallback;
  };

  const handleSendOTP = async (silent = false) => {
    if (!email || countdown > 0) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await sendEmailOTP(email);

      setSuccess(
        response?.message ||
          "A verification OTP has been sent to your email."
      );

      setCountdown(OTP_RESEND_SECONDS);
    } catch (errorObject) {
      setError(
        extractMessage(
          errorObject,
          "Unable to send email OTP."
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await verifyEmailOTP(email, otp);

      setSuccess(
        response?.message ||
          "Email verified successfully."
      );

      window.setTimeout(() => {
        navigate("/verify-phone", {
          state: {
            email,
            phone: location.state?.phone,
            studentId: location.state?.studentId,
          },
        });
      }, 700);
    } catch (errorObject) {
      setError(
        extractMessage(
          errorObject,
          "Invalid or expired OTP."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="otp-page-container">
        <div className="otp-icon">📧</div>

        <div className="auth-header">
          <span className="auth-badge">
            Step 1 of 2
          </span>

          <h1>Verify Your Email</h1>

          <p>
            We sent a 6-digit verification code to:
          </p>

          <strong className="verification-email">
            {email}
          </strong>
        </div>

        <div className="verification-progress">
          <div className="progress-step active">
            <span>1</span>
            <label>Email</label>
          </div>

          <div className="progress-line" />

          <div className="progress-step">
            <span>2</span>
            <label>Phone</label>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        <div className="otp-card">
          <label>Enter Email OTP</label>

          <OTPInput
            value={otp}
            onChange={setOtp}
            length={6}
            disabled={loading}
          />

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <div className="otp-resend">
            {countdown > 0 ? (
              <span>
                Resend OTP in{" "}
                <strong>{countdown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                className="link-button"
                onClick={() => handleSendOTP(false)}
                disabled={sending}
              >
                {sending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>

        <div className="verification-help">
          <p>
            Didn't receive the email?
          </p>

          <ul>
            <li>Check your Spam or Promotions folder.</li>
            <li>Make sure the email address is correct.</li>
            <li>Wait a few seconds before requesting another OTP.</li>
          </ul>
        </div>

        <div className="auth-footer">
          <Link to="/register">
            ← Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
