# backend/otp_service.py

from twilio.rest import Client

from config import settings


# ============================================================
# TWILIO CONFIGURATION
# ============================================================

TWILIO_ACCOUNT_SID = settings.twilio_account_sid
TWILIO_AUTH_TOKEN = settings.twilio_auth_token
TWILIO_VERIFY_SERVICE_SID = settings.twilio_verify_service_sid


# ============================================================
# TWILIO CLIENT
# ============================================================

def get_twilio_client() -> Client:
    """
    Create and return a Twilio client.
    """

    if not TWILIO_ACCOUNT_SID:
        raise RuntimeError(
            "TWILIO_ACCOUNT_SID is not configured."
        )

    if not TWILIO_AUTH_TOKEN:
        raise RuntimeError(
            "TWILIO_AUTH_TOKEN is not configured."
        )

    return Client(
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
    )


# ============================================================
# VALIDATE TWILIO CONFIGURATION
# ============================================================

def validate_twilio_configuration():
    """
    Validate required Twilio Verify configuration.
    """

    if not TWILIO_ACCOUNT_SID:
        raise RuntimeError(
            "TWILIO_ACCOUNT_SID is not configured."
        )

    if not TWILIO_AUTH_TOKEN:
        raise RuntimeError(
            "TWILIO_AUTH_TOKEN is not configured."
        )

    if not TWILIO_VERIFY_SERVICE_SID:
        raise RuntimeError(
            "TWILIO_VERIFY_SERVICE_SID is not configured."
        )


# ============================================================
# SEND PHONE OTP
# ============================================================

def send_phone(
    phone: str,
):
    """
    Send OTP to a phone number using Twilio Verify.

    The phone number should normally be in E.164 format.

    Example:

        +919876543210
    """

    if not phone:
        raise ValueError(
            "Phone number is required."
        )

    validate_twilio_configuration()

    client = get_twilio_client()

    try:

        verification = (
            client.verify
            .v2
            .services(
                TWILIO_VERIFY_SERVICE_SID
            )
            .verifications
            .create(
                to=phone,
                channel="sms",
            )
        )

        print(
            "Twilio OTP sent:",
            verification.status,
        )

        return {
            "success": True,
            "status": verification.status,
        }

    except Exception as exc:

        print(
            "Twilio OTP sending failed:",
            str(exc),
        )

        raise RuntimeError(
            f"Unable to send phone OTP: {exc}"
        ) from exc


# ============================================================
# COMPATIBILITY ALIAS
# ============================================================

def send_phone_otp(
    phone: str,
):
    """
    Compatibility wrapper used by routers/otp.py.
    """

    return send_phone(phone)


# ============================================================
# VERIFY PHONE OTP
# ============================================================

def verify_phone(
    phone: str,
    otp: str,
) -> bool:
    """
    Verify an OTP using Twilio Verify.

    Returns True when Twilio reports the verification
    status as approved.
    """

    if not phone:
        raise ValueError(
            "Phone number is required."
        )

    if not otp:
        raise ValueError(
            "OTP is required."
        )

    validate_twilio_configuration()

    client = get_twilio_client()

    try:

        verification_check = (
            client.verify
            .v2
            .services(
                TWILIO_VERIFY_SERVICE_SID
            )
            .verification_checks
            .create(
                to=phone,
                code=str(otp),
            )
        )

        print(
            "Twilio OTP verification status:",
            verification_check.status,
        )

        return (
            verification_check.status
            == "approved"
        )

    except Exception as exc:

        print(
            "Twilio OTP verification failed:",
            str(exc),
        )

        raise RuntimeError(
            f"Unable to verify phone OTP: {exc}"
        ) from exc


# ============================================================
# COMPATIBILITY ALIAS
# ============================================================

def verify_phone_otp(
    phone: str,
    otp: str,
) -> bool:
    """
    Compatibility wrapper used by routers/otp.py.
    """

    return verify_phone(
        phone,
        otp,
    )
  
