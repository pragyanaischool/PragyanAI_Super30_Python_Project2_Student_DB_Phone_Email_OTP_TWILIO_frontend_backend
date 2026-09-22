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
 * Handles:
 *
 * Email:
 * POST /api/otp/email/send
 * POST /api/otp/email/verify
 *
 * Phone:
 * POST /api/otp/phone/send
 * POST /api/otp/phone/verify
 *
 * ============================================================
 */


/* ============================================================
   SEND EMAIL OTP
   ============================================================ */

export async function sendEmailOTP(email = null) {
  try {
    const targetEmail =
      email ||
      getRegistrationEmail();

    if (!targetEmail) {
      throw new Error(
        "Email address is missing. Please complete registration again."
      );
    }

    const payload = {
      email: targetEmail,
    };

    /*
     * If registration created a student ID,
     * include it as an additional field.
     *
     * FastAPI/Pydantic will ignore it if the backend
     * schema does not allow extra fields only if configured.
     *
     * Therefore we intentionally send only email here.
     */

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
  otp
) {
  try {
    const targetEmail =
      email ||
      getRegistrationEmail();

    if (!targetEmail) {
      throw new Error(
        "Email address is missing. Please complete registration again."
      );
    }

    if (!otp) {
      throw new Error("Please enter the OTP.");
    }

    const payload = {
      email: targetEmail,
      otp: String(otp).trim(),
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
    const targetPhone =
      phone ||
      getRegistrationPhone();

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
  otp
) {
  try {
    const targetPhone =
      phone ||
      getRegistrationPhone();

    if (!targetPhone) {
      throw new Error(
        "Phone number is missing. Please complete registration again."
      );
    }

    if (!otp) {
      throw new Error("Please enter the OTP.");
    }

    const payload = {
      phone: targetPhone,
      otp: String(otp).trim(),
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
   NORMALIZE OTP ERROR
   ============================================================ */

function normalizeOTPError(error) {
  /*
   * No server response.
   */

  if (!error?.response) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(
      "Unable to connect to the server. Please try again."
    );
  }

  const status = error.response.status;
  const data = error.response.data;

  /*
   * FastAPI validation errors.
   */

  if (Array.isArray(data?.detail)) {
    const messages = data.detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item?.msg || "";
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return new Error(messages.join(" "));
    }
  }

  /*
   * Standard FastAPI detail.
   */

  if (typeof data?.detail === "string") {
    return new Error(data.detail);
  }

  /*
   * Alternative response format.
   */

  if (typeof data?.message === "string") {
    return new Error(data.message);
  }

  /*
   * Status-specific messages.
   */

  if (status === 400) {
    return new Error(
      "Invalid OTP request. Please check your details and try again."
    );
  }

  if (status === 401) {
    return new Error(
      "Your verification session has expired. Please register again."
    );
  }

  if (status === 403) {
    return new Error(
      "You are not authorized to perform this verification."
    );
  }

  if (status === 404) {
    return new Error(
      "Registration record was not found. Please register again."
    );
  }

  if (status === 409) {
    return new Error(
      "This verification request conflicts with the current account status."
    );
  }

  if (status === 429) {
    return new Error(
      "Too many OTP requests. Please wait before requesting another OTP."
    );
  }

  if (status >= 500) {
    return new Error(
      "OTP service is temporarily unavailable. Please try again later."
    );
  }

  return new Error(
    error?.message || "OTP verification failed."
  );
}


/* ============================================================
   OTP HELPERS
   ============================================================ */

export function getOTPRegistrationDetails() {
  return {
    email: getRegistrationEmail(),
    phone: getRegistrationPhone(),
    studentId: getRegistrationStudentId(),
  };
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

