# ============================================================
# PragyanAI Student Verification Platform
# File: backend/routers/otp.py
# ============================================================

import os
import random
import smtplib

from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from pydantic import BaseModel, Field

from sqlalchemy.orm import Session

from database import get_db
from models import Student

from routers.auth import get_current_student


# ============================================================
# OPTIONAL TWILIO IMPORT
# ============================================================

try:
    from twilio.rest import Client

except ImportError:

    Client = None


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/otp",
    tags=["OTP Verification"],
)


# ============================================================
# CONFIGURATION
# ============================================================

SMTP_HOST = os.getenv(
    "SMTP_HOST",
    "smtp.gmail.com",
)

SMTP_PORT = int(
    os.getenv(
        "SMTP_PORT",
        "587",
    )
)

EMAIL_ADDRESS = os.getenv(
    "EMAIL_ADDRESS",
    "",
)

EMAIL_APP_PASSWORD = os.getenv(
    "EMAIL_APP_PASSWORD",
    "",
)

OTP_EXPIRE_MINUTES = int(
    os.getenv(
        "OTP_EXPIRE_MINUTES",
        "10",
    )
)

TWILIO_ACCOUNT_SID = os.getenv(
    "TWILIO_ACCOUNT_SID",
    "",
)

TWILIO_AUTH_TOKEN = os.getenv(
    "TWILIO_AUTH_TOKEN",
    "",
)

TWILIO_VERIFY_SERVICE_SID = os.getenv(
    "TWILIO_VERIFY_SERVICE_SID",
    "",
)


# ============================================================
# DEVELOPMENT OTP STORAGE
# ============================================================
#
# Used for email OTP.
#
# For production with multiple backend instances,
# move OTP storage to PostgreSQL or Redis.
# ============================================================

email_otp_store = {}


# ============================================================
# REQUEST SCHEMAS
# ============================================================

class OTPVerifyRequest(BaseModel):

    otp: str = Field(
        ...,
        min_length=4,
        max_length=10,
    )


# ============================================================
# RESPONSE HELPER
# ============================================================

def success_response(
    message: str,
):
    return {
        "message": message,
        "success": True,
    }


# ============================================================
# GENERATE EMAIL OTP
# ============================================================

def generate_email_otp() -> str:

    return str(
        random.randint(
            100000,
            999999,
        )
    )


# ============================================================
# SEND EMAIL
# ============================================================

def send_email(
    to_email: str,
    subject: str,
    body: str,
):

    if not EMAIL_ADDRESS:
        raise RuntimeError(
            "EMAIL_ADDRESS is not configured."
        )

    if not EMAIL_APP_PASSWORD:
        raise RuntimeError(
            "EMAIL_APP_PASSWORD is not configured."
        )

    message = EmailMessage()

    message["Subject"] = subject
    message["From"] = EMAIL_ADDRESS
    message["To"] = to_email

    message.set_content(body)

    with smtplib.SMTP(
        SMTP_HOST,
        SMTP_PORT,
        timeout=30,
    ) as smtp:

        smtp.starttls()

        smtp.login(
            EMAIL_ADDRESS,
            EMAIL_APP_PASSWORD,
        )

        smtp.send_message(
            message
        )


# ============================================================
# TWILIO CLIENT
# ============================================================

def get_twilio_client():

    if Client is None:

        raise RuntimeError(
            "Twilio package is not installed."
        )

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

    return Client(
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
    )


# ============================================================
# SEND EMAIL OTP
# ============================================================

@router.post(
    "/email/send",
)
def send_email_otp(
    current_student: Student = Depends(
        get_current_student
    ),
):

    # --------------------------------------------------------
    # ALREADY VERIFIED
    # --------------------------------------------------------

    if current_student.email_verified:

        return success_response(
            "Email is already verified."
        )

    # --------------------------------------------------------
    # GENERATE OTP
    # --------------------------------------------------------

    otp = generate_email_otp()

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=OTP_EXPIRE_MINUTES
        )
    )

    email_otp_store[
        current_student.email
    ] = {
        "otp": otp,
        "expires_at": expires_at,
    }

    # --------------------------------------------------------
    # EMAIL BODY
    # --------------------------------------------------------

    body = f"""
Dear {current_student.full_name},

Your PragyanAI email verification OTP is:

{otp}

This OTP is valid for {OTP_EXPIRE_MINUTES} minutes.

Please do not share this OTP with anyone.

Regards,
PragyanAI
Student Verification Platform
""".strip()

    # --------------------------------------------------------
    # SEND EMAIL
    # --------------------------------------------------------

    try:

        send_email(
            to_email=current_student.email,
            subject="PragyanAI Email Verification OTP",
            body=body,
        )

        print(
            "Email OTP sent successfully to:",
            current_student.email,
        )

        return success_response(
            "Email OTP sent successfully."
        )

    except Exception as error:

        # Keep OTP available for development/testing.
        print(
            "Email OTP sending failed:",
            error,
        )

        print(
            "================================================"
        )

        print(
            "DEVELOPMENT EMAIL OTP"
        )

        print(
            f"Email: {current_student.email}"
        )

        print(
            f"OTP: {otp}"
        )

        print(
            "================================================"
        )

        # We return success because the OTP was generated.
        # The OTP can be retrieved from Render logs during
        # development if SMTP is not configured correctly.

        return success_response(
            "Email OTP generated. "
            "Please check your email or server logs."
        )


# ============================================================
# VERIFY EMAIL OTP
# ============================================================

@router.post(
    "/email/verify",
)
def verify_email_otp(
    request: OTPVerifyRequest,
    current_student: Student = Depends(
        get_current_student
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # ALREADY VERIFIED
    # --------------------------------------------------------

    if current_student.email_verified:

        return success_response(
            "Email is already verified."
        )

    # --------------------------------------------------------
    # FIND OTP
    # --------------------------------------------------------

    stored_otp = email_otp_store.get(
        current_student.email
    )

    if not stored_otp:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "No email OTP found. "
                "Please request a new OTP."
            ),
        )

    # --------------------------------------------------------
    # CHECK EXPIRATION
    # --------------------------------------------------------

    now = datetime.now(timezone.utc)

    expires_at = stored_otp[
        "expires_at"
    ]

    if now > expires_at:

        email_otp_store.pop(
            current_student.email,
            None,
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Email OTP has expired. "
                "Please request a new OTP."
            ),
        )

    # --------------------------------------------------------
    # CHECK OTP
    # --------------------------------------------------------

    if request.otp.strip() != str(
        stored_otp["otp"]
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email OTP.",
        )

    # --------------------------------------------------------
    # VERIFY EMAIL
    # --------------------------------------------------------

    current_student.email_verified = True

    db.commit()

    db.refresh(
        current_student
    )

    email_otp_store.pop(
        current_student.email,
        None,
    )

    return success_response(
        "Email verified successfully."
    )


# ============================================================
# SEND PHONE OTP
# ============================================================

@router.post(
    "/phone/send",
)
def send_phone_otp(
    current_student: Student = Depends(
        get_current_student
    ),
):

    # --------------------------------------------------------
    # ALREADY VERIFIED
    # --------------------------------------------------------

    if current_student.phone_verified:

        return success_response(
            "Phone number is already verified."
        )

    # --------------------------------------------------------
    # TWILIO
    # --------------------------------------------------------

    try:

        client = get_twilio_client()

        verification = (
            client.verify
            .v2
            .services(
                TWILIO_VERIFY_SERVICE_SID
            )
            .verifications
            .create(
                to=current_student.phone,
                channel="sms",
            )
        )

        print(
            "Twilio phone verification started:",
            verification.status,
        )

        return success_response(
            "Phone OTP sent successfully."
        )

    except Exception as error:

        print(
            "Phone OTP sending error:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Unable to send phone OTP. "
                "Please check Twilio configuration."
            ),
        )


# ============================================================
# VERIFY PHONE OTP
# ============================================================

@router.post(
    "/phone/verify",
)
def verify_phone_otp(
    request: OTPVerifyRequest,
    current_student: Student = Depends(
        get_current_student
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # ALREADY VERIFIED
    # --------------------------------------------------------

    if current_student.phone_verified:

        return success_response(
            "Phone number is already verified."
        )

    # --------------------------------------------------------
    # TWILIO
    # --------------------------------------------------------

    try:

        client = get_twilio_client()

        verification_check = (
            client.verify
            .v2
            .services(
                TWILIO_VERIFY_SERVICE_SID
            )
            .verification_checks
            .create(
                to=current_student.phone,
                code=request.otp.strip(),
            )
        )

        print(
            "Twilio verification status:",
            verification_check.status,
        )

        if verification_check.status != "approved":

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid phone OTP.",
            )

        # ----------------------------------------------------
        # UPDATE DATABASE
        # ----------------------------------------------------

        current_student.phone_verified = True

        db.commit()

        db.refresh(
            current_student
        )

        return success_response(
            "Phone number verified successfully."
        )

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Phone OTP verification error:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Unable to verify phone OTP. "
                "Please check Twilio configuration."
            ),
        )


# ============================================================
# VERIFICATION STATUS
# ============================================================

@router.get(
    "/status",
)
def verification_status(
    current_student: Student = Depends(
        get_current_student
    ),
):

    return {
        "email": current_student.email,
        "phone": current_student.phone,

        "email_verified": bool(
            current_student.email_verified
        ),

        "phone_verified": bool(
            current_student.phone_verified
        ),

        "approval_status": (
            current_student.approval_status
        ),
    }
