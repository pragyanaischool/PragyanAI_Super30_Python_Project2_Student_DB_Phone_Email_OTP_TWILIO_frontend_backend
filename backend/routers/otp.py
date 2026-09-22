# ============================================================
# PragyanAI Student Verification Platform
# File: backend/routers/otp.py
# ============================================================

from datetime import datetime, timedelta, timezone
import random

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from database import get_db
from models import Student
from schemas import Message
from routers.auth import get_current_student

# These imports must match your existing OTP/email utilities.
# If your project uses different function names, we will align
# them with the actual utils file.
try:
    from utils.email import send_email
except ImportError:
    send_email = None

try:
    from utils.sms import send_phone
except ImportError:
    send_phone = None


router = APIRouter(
    prefix="/otp",
    tags=["OTP Verification"],
)


# ============================================================
# OTP CONFIGURATION
# ============================================================

OTP_EXPIRE_MINUTES = 10


# ============================================================
# IN-MEMORY OTP STORAGE
# ============================================================
#
# NOTE:
# This is suitable for initial testing.
#
# For production with multiple Render instances/restarts,
# OTPs should eventually be stored in PostgreSQL or Redis.
#

email_otps = {}

phone_otps = {}


# ============================================================
# GENERATE OTP
# ============================================================

def generate_otp() -> str:
    return str(
        random.randint(
            100000,
            999999,
        )
    )


# ============================================================
# SEND EMAIL OTP
# ============================================================

@router.post(
    "/email/send",
    response_model=Message,
)
def send_email_otp(
    current_student: Student = Depends(get_current_student),
):

    if current_student.email_verified:

        return {
            "message": "Email is already verified.",
            "success": True,
        }

    otp = generate_otp()

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=OTP_EXPIRE_MINUTES
        )
    )

    email_otps[
        current_student.email
    ] = {
        "otp": otp,
        "expires_at": expires_at,
    }

    print(
        f"EMAIL OTP for "
        f"{current_student.email}: {otp}"
    )

    if send_email is not None:

        try:

            send_email(
                to_email=current_student.email,
                subject="PragyanAI Email Verification OTP",
                body=(
                    "Your PragyanAI email verification OTP is: "
                    f"{otp}\n\n"
                    f"This OTP is valid for "
                    f"{OTP_EXPIRE_MINUTES} minutes."
                ),
            )

        except Exception as error:

            print(
                "Email OTP sending error:",
                error,
            )

    return {
        "message": (
            "Email OTP generated successfully. "
            "Please check your email."
        ),
        "success": True,
    }


# ============================================================
# VERIFY EMAIL OTP
# ============================================================

@router.post(
    "/email/verify",
    response_model=Message,
)
def verify_email_otp(
    otp: str,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):

    email = current_student.email

    stored = email_otps.get(email)

    if not stored:

        raise HTTPException(
            status_code=400,
            detail="No email OTP found. Please request a new OTP.",
        )

    now = datetime.now(timezone.utc)

    if now > stored["expires_at"]:

        email_otps.pop(
            email,
            None,
        )

        raise HTTPException(
            status_code=400,
            detail="Email OTP has expired. Please request a new OTP.",
        )

    if str(otp).strip() != str(stored["otp"]):

        raise HTTPException(
            status_code=400,
            detail="Invalid email OTP.",
        )

    current_student.email_verified = True

    db.commit()

    email_otps.pop(
        email,
        None,
    )

    return {
        "message": "Email verified successfully.",
        "success": True,
    }


# ============================================================
# SEND PHONE OTP
# ============================================================

@router.post(
    "/phone/send",
    response_model=Message,
)
def send_phone_otp(
    current_student: Student = Depends(get_current_student),
):

    if current_student.phone_verified:

        return {
            "message": "Phone number is already verified.",
            "success": True,
        }

    otp = generate_otp()

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=OTP_EXPIRE_MINUTES
        )
    )

    phone_otps[
        current_student.phone
    ] = {
        "otp": otp,
        "expires_at": expires_at,
    }

    print(
        f"PHONE OTP for "
        f"{current_student.phone}: {otp}"
    )

    if send_phone is not None:

        try:

            send_phone(
                phone_number=current_student.phone,
                message=(
                    "PragyanAI verification OTP: "
                    f"{otp}. "
                    f"Valid for {OTP_EXPIRE_MINUTES} minutes."
                ),
            )

        except Exception as error:

            print(
                "Phone OTP sending error:",
                error,
            )

    return {
        "message": (
            "Phone OTP generated successfully. "
            "Please check your phone."
        ),
        "success": True,
    }


# ============================================================
# VERIFY PHONE OTP
# ============================================================

@router.post(
    "/phone/verify",
    response_model=Message,
)
def verify_phone_otp(
    otp: str,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):

    phone = current_student.phone

    stored = phone_otps.get(phone)

    if not stored:

        raise HTTPException(
            status_code=400,
            detail="No phone OTP found. Please request a new OTP.",
        )

    now = datetime.now(timezone.utc)

    if now > stored["expires_at"]:

        phone_otps.pop(
            phone,
            None,
        )

        raise HTTPException(
            status_code=400,
            detail="Phone OTP has expired. Please request a new OTP.",
        )

    if str(otp).strip() != str(stored["otp"]):

        raise HTTPException(
            status_code=400,
            detail="Invalid phone OTP.",
        )

    current_student.phone_verified = True

    db.commit()

    phone_otps.pop(
        phone,
        None,
    )

    return {
        "message": "Phone number verified successfully.",
        "success": True,
    }
