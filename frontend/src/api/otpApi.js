import api from "./api";

/*
|--------------------------------------------------------------------------
| EMAIL OTP
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| SEND EMAIL OTP
|--------------------------------------------------------------------------
|
| POST /api/otp/email/send
|
*/

export async function sendEmailOTP(
  email
) {
  try {
    if (!email) {
      throw new Error(
        "Email address is required."
      );
    }

    const response = await api.post(
      "/otp/email/send",
      {
        email:
          email.trim().toLowerCase(),
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| VERIFY EMAIL OTP
|--------------------------------------------------------------------------
|
| POST /api/otp/email/verify
|
*/

export async function verifyEmailOTP(
  email,
  otp
) {
  try {
    if (!email) {
      throw new Error(
        "Email address is required."
      );
    }

    if (!otp) {
      throw new Error(
        "Email OTP is required."
      );
    }

    const response = await api.post(
      "/otp/email/verify",
      {
        email:
          email.trim().toLowerCase(),

        otp:
          String(otp).trim(),
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| PHONE OTP
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| SEND PHONE OTP
|--------------------------------------------------------------------------
|
| POST /api/otp/phone/send
|
| Twilio Verify sends the OTP.
|
*/

export async function sendPhoneOTP(
  phone
) {
  try {
    if (!phone) {
      throw new Error(
        "Phone number is required."
      );
    }

    const response = await api.post(
      "/otp/phone/send",
      {
        phone:
          phone.trim(),
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| VERIFY PHONE OTP
|--------------------------------------------------------------------------
|
| POST /api/otp/phone/verify
|
*/

export async function verifyPhoneOTP(
  phone,
  otp
) {
  try {
    if (!phone) {
      throw new Error(
        "Phone number is required."
      );
    }

    if (!otp) {
      throw new Error(
        "Phone OTP is required."
      );
    }

    const response = await api.post(
      "/otp/phone/verify",
      {
        phone:
          phone.trim(),

        otp:
          String(otp).trim(),
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| GENERIC OTP ERROR MESSAGE
|--------------------------------------------------------------------------
|
| Converts FastAPI/Axios errors into
| something useful for the UI.
|
*/

export function getOTPErrorMessage(
  error
) {
  if (!error) {
    return "Something went wrong.";
  }

  /*
   * FastAPI validation error:
   *
   * {
   *   detail: [...]
   * }
   */

  if (
    Array.isArray(
      error.response?.data?.detail
    )
  ) {
    return error.response.data.detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return (
          item?.msg ||
          "Invalid request."
        );
      })
      .join(" ");
  }

  /*
   * Normal FastAPI error.
   */

  if (
    typeof error.response?.data?.detail ===
    "string"
  ) {
    return error.response.data.detail;
  }

  /*
   * Backend message.
   */

  if (
    typeof error.response?.data?.message ===
    "string"
  ) {
    return error.response.data.message;
  }

  /*
   * Axios message.
   */

  if (error.message) {
    return error.message;
  }

  return "Unable to process OTP request.";
}
