
import api from "./api";
import {
  getRegistrationEmail,
  getRegistrationPhone,
  getRegistrationStudentId,
} from "./authApi";

/**
 * ============================================================
 * OTP API
 * ============================================================
 *
 * Student Email + Phone OTP Verification
 *
 * Backend endpoints:
 *
 * POST /api/otp/email/send
 * POST /api/otp/email/verify
 * POST /api/otp/phone/send
 * POST /api/otp/phone/verify
 *
 * Registration Flow:
 *
 * Register
 *    ↓
 * Email OTP
 *    ↓
 * Verify Email OTP
 *    ↓
 * Phone OTP
 *    ↓
 * Verify Phone OTP
 *    ↓
 * Pending Admin Approval
 *    ↓
 * Student Login
 *
 * ============================================================
 */


/* ============================================================
   HELPER: GET EMAIL
   ============================================================ */

function resolveEmail(email) {
  return (
    email ||
    getRegistrationEmail() ||
    ""
  ).trim();
}


/* ============================================================
   HELPER: GET PHONE
   ============================================================ */

function resolvePhone(phone) {
  return (
    phone ||
    getRegistrationPhone() ||
    ""
  ).trim();
}


/* ============================================================
   HELPER: GET STUDENT ID
   ============================================================ */

function resolveStudentId(studentId) {
  return (
    studentId ||
    getRegistrationStudentId() ||
    ""
  );
}


/* ============================================================
   SEND EMAIL OTP
   ============================================================ */

export async function sendEmailOTP(email = null) {
  try {
    const targetEmail = resolveEmail(email);

    if (!targetEmail) {
      throw new Error(
        "Email address is missing. Please complete registration again."
      );
    }

    const payload = {
      email: targetEmail,
    };

    const response = await api.post(
      "/otp/email/send",
      payload
    );

    return response.data;

  } catch (error) {
    throw normalizeOTPError(error);
  }
}


/* ============================================================
   VERIFY EMAIL OTP
   ============================================================ */

export async function verifyEmailOTP(
  email = null,
  otp = ""
) {
  try {
    const targetEmail = resolveEmail(email);

    if (!targetEmail) {
      throw new Error(
        "Email address is missing. Please complete registration again."
      );
    }

    const normalizedOTP =
      String(otp || "").trim();

    if (!normalizedOTP) {
      throw new Error(
        "Please enter the OTP."
      );
    }

    if (!/^\d{6}$/.test(normalizedOTP)) {
      throw new Error(
        "Please enter the 6-digit OTP."
      );
    }

    const payload = {
      email: targetEmail,
      otp: normalizedOTP,
    };

    const response = await api.post(
      "/otp/email/verify",
      payload
    );

    return response.data;

  } catch (error) {
    throw normalizeOTPError(error);
  }
}


/* ============================================================
   SEND PHONE OTP
   ============================================================ */

export async function sendPhoneOTP(phone = null) {
  try {
    const targetPhone = resolvePhone(phone);

    if (!targetPhone) {
      throw new Error(
        "Phone number is missing. Please complete registration again."
      );
    }

    const payload = {
      phone: targetPhone,
    };

    const response = await api.post(
      "/otp/phone/send",
      payload
    );

    return response.data;

  } catch (error) {
    throw normalizeOTPError(error);
  }
}


/* ============================================================
   VERIFY PHONE OTP
   ============================================================ */

export async function verifyPhoneOTP(
  phone = null,
  otp = ""
) {
  try {
    const targetPhone = resolvePhone(phone);

    if (!targetPhone) {
      throw new Error(
        "Phone number is missing. Please complete registration again."
      );
    }

    const normalizedOTP =
      String(otp || "").trim();

    if (!normalizedOTP) {
      throw new Error(
        "Please enter the OTP."
      );
    }

    if (!/^\d{6}$/.test(normalizedOTP)) {
      throw new Error(
        "Please enter the 6-digit OTP."
      );
    }

    const payload = {
      phone: targetPhone,
      otp: normalizedOTP,
    };

    const response = await api.post(
      "/otp/phone/verify",
      payload
    );

    return response.data;

  } catch (error) {
    throw normalizeOTPError(error);
  }
}


/* ============================================================
   RESEND EMAIL OTP
   ============================================================ */

export async function resendEmailOTP(email = null) {
  return sendEmailOTP(email);
}


/* ============================================================
   RESEND PHONE OTP
   ============================================================ */

export async function resendPhoneOTP(phone = null) {
  return sendPhoneOTP(phone);
}


/* ============================================================
   GET OTP REGISTRATION DETAILS
   ============================================================ */

export function getOTPRegistrationDetails() {
  return {
    email: getRegistrationEmail(),
    phone: getRegistrationPhone(),
    studentId: getRegistrationStudentId(),
  };
}


/* ============================================================
   NORMALIZE OTP ERROR
   ============================================================ */

function normalizeOTPError(error) {

  /* ----------------------------------------------------------
     Client-side validation error
     ---------------------------------------------------------- */

  if (
    error instanceof Error &&
    !error.response
  ) {
    return error;
  }


  /* ----------------------------------------------------------
     Network / CORS / server unavailable
     ---------------------------------------------------------- */

  if (!error?.response) {
    return new Error(
      "Unable to connect to the server. Please check your internet connection and try again."
    );
  }


  const status =
    error.response.status;

  const data =
    error.response.data;


  /* ----------------------------------------------------------
     FastAPI validation error
     
     Example:
     
     {
       "detail": [
         {
           "loc": ["body", "otp"],
           "msg": "field required",
           "type": "missing"
         }
       ]
     }
     ---------------------------------------------------------- */

  if (Array.isArray(data?.detail)) {

    const messages =
      data.detail
        .map((item) => {

          if (typeof item === "string") {
            return item;
          }

          return item?.msg || "";
        })
        .filter(Boolean);

    if (messages.length > 0) {
      return new Error(
        messages.join(" ")
      );
    }
  }


  /* ----------------------------------------------------------
     Standard FastAPI error
     ---------------------------------------------------------- */

  if (
    typeof data?.detail === "string"
  ) {
    return new Error(
      data.detail
    );
  }


  /* ----------------------------------------------------------
     Alternative backend message
     ---------------------------------------------------------- */

  if (
    typeof data?.message === "string"
  ) {
    return new Error(
      data.message
    );
  }


  /* ----------------------------------------------------------
     Status-specific errors
     ---------------------------------------------------------- */

  switch (status) {

    case 400:
      return new Error(
        "Invalid OTP request. Please check your details and try again."
      );

    case 401:
      return new Error(
        "Your verification session has expired. Please register again."
      );

    case 403:
      return new Error(
        "You are not authorized to perform this verification."
      );

    case 404:
      return new Error(
        "Registration record was not found. Please register again."
      );

    case 409:
      return new Error(
        "This verification request conflicts with the current account status."
      );

    case 422:
      return new Error(
        "Invalid verification information. Please check your details."
      );

    case 429:
      return new Error(
        "Too many OTP requests. Please wait before requesting another OTP."
      );

    default:
      if (status >= 500) {
        return new Error(
          "OTP service is temporarily unavailable. Please try again later."
        );
      }

      return new Error(
        error?.message ||
        "OTP verification failed."
      );
  }
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const otpApi = {
  sendEmailOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  verifyPhoneOTP,
  resendEmailOTP,
  resendPhoneOTP,
  getOTPRegistrationDetails,
};

export default otpApi;


