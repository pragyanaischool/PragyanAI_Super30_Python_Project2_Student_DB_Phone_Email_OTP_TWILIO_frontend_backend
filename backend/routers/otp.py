# backend/routers/otp.py

import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import Student
from schemas import OTP, Message
from security import current_student

from email_service import send_otp_email
from otp_service import send_phone_otp, verify_phone_otp


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/otp",
    tags=["OTP Verification"],
)


# ============================================================
# EMAIL OTP GENERATOR
# ============================================================

def generate_email_otp() -> str:
    """
    Generate a secure 6-digit email OTP.
    """

    return str(
        random.SystemRandom().randint(
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
    current_student: Student = Depends(current_student),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Already verified
    # --------------------------------------------------------

    if current_student.email_verified:

        return {
            "message": "Email is already verified.",
            "success": True,
        }

    # --------------------------------------------------------
    # Generate OTP
    # --------------------------------------------------------

    otp = generate_email_otp()

    # --------------------------------------------------------
    # Save OTP
    #
    # This implementation expects the Student model to have:
    #
    # email_otp
    # email_otp_expires_at
    #
    # If your model uses different names, we will align it
    # after the next Render traceback.
    # --------------------------------------------------------

    current_student.email_otp = otp

    current_student.email_otp_expires_at = (
        datetime.utcnow()
        + timedelta(
            minutes=settings.otp_expire_minutes
        )
    )

    db.commit()

    # --------------------------------------------------------
    # Send email
    # --------------------------------------------------------

    try:

        send_otp_email(
            to_email=current_student.email,
            otp=otp,
        )

    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to send email OTP. "
                f"{str(exc)}"
            ),
        )

    return {
        "message": "Email OTP sent successfully.",
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
    otp_data: OTP,
    current_student: Student = Depends(current_student),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Already verified
    # --------------------------------------------------------

    if current_student.email_verified:

        return {
            "message": "Email is already verified.",
            "success": True,
        }

    # --------------------------------------------------------
    # OTP exists?
    # --------------------------------------------------------

    if not current_student.email_otp:

        raise HTTPException(
            status_code=400,
            detail=(
                "No email OTP found. "
                "Please request a new OTP."
            ),
        )

    # --------------------------------------------------------
    # OTP expiry
    # --------------------------------------------------------

    if (
        not current_student.email_otp_expires_at
        or datetime.utcnow()
        > current_student.email_otp_expires_at
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Email OTP has expired. "
                "Please request a new OTP."
            ),
        )

    # --------------------------------------------------------
    # OTP comparison
    # --------------------------------------------------------

    if str(otp_data.otp) != str(
        current_student.email_otp
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid email OTP.",
        )

    # --------------------------------------------------------
    # Verification successful
    # --------------------------------------------------------

    current_student.email_verified = True

    current_student.email_otp = None
    current_student.email_otp_expires_at = None

    db.commit()

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
def send_phone_otp_route(
    current_student: Student = Depends(current_student),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Already verified
    # --------------------------------------------------------

    if current_student.phone_verified:

        return {
            "message": "Phone number is already verified.",
            "success": True,
        }

    # --------------------------------------------------------
    # Validate phone
    # --------------------------------------------------------

    if not current_student.phone:

        raise HTTPException(
            status_code=400,
            detail="Student phone number is missing.",
        )

    # --------------------------------------------------------
    # Send Twilio Verify OTP
    # --------------------------------------------------------

    try:

        send_phone_otp(
            current_student.phone
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to send phone OTP. "
                f"{str(exc)}"
            ),
        )

    return {
        "message": "Phone OTP sent successfully.",
        "success": True,
    }


# ============================================================
# VERIFY PHONE OTP
# ============================================================

@router.post(
    "/phone/verify",
    response_model=Message,
)
def verify_phone_otp_route(
    otp_data: OTP,
    current_student: Student = Depends(current_student),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Already verified
    # --------------------------------------------------------

    if current_student.phone_verified:

        return {
            "message": "Phone number is already verified.",
            "success": True,
        }

    # --------------------------------------------------------
    # Validate phone
    # --------------------------------------------------------

    if not current_student.phone:

        raise HTTPException(
            status_code=400,
            detail="Student phone number is missing.",
        )

    # --------------------------------------------------------
    # Verify Twilio OTP
    # --------------------------------------------------------

    try:

        verified = verify_phone_otp(
            current_student.phone,
            otp_data.otp,
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to verify phone OTP. "
                f"{str(exc)}"
            ),
        )

    # --------------------------------------------------------
    # Invalid OTP
    # --------------------------------------------------------

    if not verified:

        raise HTTPException(
            status_code=400,
            detail="Invalid phone OTP.",
        )

    # --------------------------------------------------------
    # Verification successful
    # --------------------------------------------------------

    current_student.phone_verified = True

    db.commit()

    return {
        "message": "Phone number verified successfully.",
        "success": True,
    }
    
