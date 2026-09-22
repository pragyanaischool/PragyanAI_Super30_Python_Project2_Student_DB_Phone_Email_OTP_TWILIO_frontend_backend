import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  sendPhoneOTP,
  verifyPhoneOTP,
} from "../api/otpApi";

import OTPInput from "../components/OTPInput";

import {
  getRegistrationEmail,
  getRegistrationPhone,
} from "../api/authApi";

import { OTP_RESEND_SECONDS } from "../utils/constants";

function PhoneVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone =
    location.state?.phone ||
    getRegistrationPhone();

  const email =
    location.state?.email ||
    getRegistrationEmail();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!phone) {
      navigate("/register", { replace: true });
    }
  }, [phone, navigate]);

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
    if (phone) {
      handleSendOTP(true);
    }

    // Initial OTP send only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  const extractMessage = (errorObject, fallback) => {
    const detail = errorObject?.response?.data?.detail;

    if (Array.isArray(detail)) {
      return detail
        .map((item) => item?.msg || "Validation error")
        .join(", ");
    }

    return detail || errorObject?.message || fallback;
  };

  const handleSendOTP = async () => {
    if (!phone || countdown > 0) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await sendPhoneOTP(phone);

      setSuccess(
        response?.message ||
          "A verification OTP has been sent to your phone."
      );

      setCountdown(OTP_RESEND_SECONDS);
    } catch (errorObject) {
      setError(
        extractMessage(
          errorObject,
          "Unable to send phone OTP."
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await verifyPhoneOTP(phone, otp);

      setSuccess(
        response?.message ||
          "Phone number verified successfully."
      );

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            email,
            registrationCompleted: true,
          },
        });
      }, 1000);
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

  if (!phone) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="otp-page-container">
        <div className="otp-icon">📱</div>

        <div className="auth-header">
          <span className="auth-badge">
            Step 2 of 2
          </span>

          <h1>Verify Your Phone</h1>

          <p>
            We sent a verification code to:
          </p>

          <strong className="verification-email">
            {phone}
          </strong>
        </div>

        <div className="verification-progress">
          <div className="progress-step completed">
            <span>✓</span>
            <label>Email</label>
          </div>

          <div className="progress-line active" />

          <div className="progress-step active">
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
          <label>Enter Phone OTP</label>

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
            disabled={loading || !otp}
          >
            {loading
              ? "Verifying..."
              : "Verify Phone Number"}
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
                onClick={handleSendOTP}
                disabled={sending}
              >
                {sending
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            )}
          </div>
        </div>

        <div className="verification-help">
          <p>
            Didn't receive the SMS?
          </p>

          <ul>
            <li>Check that your phone has network coverage.</li>
            <li>Confirm that the number was entered correctly.</li>
            <li>Wait before requesting another OTP.</li>
          </ul>
        </div>

        <div className="auth-footer">
          <Link to="/verify-email">
            ← Back to Email Verification
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PhoneVerification;
