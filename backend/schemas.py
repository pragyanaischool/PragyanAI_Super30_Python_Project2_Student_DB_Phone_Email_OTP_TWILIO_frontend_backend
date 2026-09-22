# ============================================================
# PragyanAI Student Verification Platform
# File: backend/schemas.py
# ============================================================

from datetime import datetime
from typing import Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


# ============================================================
# BASE ORM SCHEMA
# ============================================================

class ORMBaseModel(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# STUDENT REGISTRATION
# ============================================================

class StudentRegister(BaseModel):

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    college_name: str = Field(
        ...,
        min_length=2,
        max_length=200,
    )

    degree: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    branch: str = Field(
        ...,
        min_length=2,
        max_length=120,
    )

    tenth_cgpa: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )

    twelfth_cgpa: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )

    be_cgpa: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )

    phone: str = Field(
        ...,
        min_length=10,
        max_length=30,
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=128,
    )

    @field_validator(
        "full_name",
        "college_name",
        "degree",
        "branch",
    )
    @classmethod
    def clean_text(cls, value: str):

        value = value.strip()

        if not value:

            raise ValueError(
                "This field cannot be empty."
            )

        return value

    @field_validator("phone")
    @classmethod
    def clean_phone(cls, value: str):

        value = value.strip()

        if not value:

            raise ValueError(
                "Phone number is required."
            )

        return value


# ============================================================
# COMPATIBILITY ALIAS
# ============================================================
#
# Existing auth.py expects:
#
# Register
#
# New code uses:
#
# StudentRegister
#
# Both now point to the same schema.
# ============================================================

Register = StudentRegister


# ============================================================
# STUDENT UPDATE
# ============================================================

class StudentUpdate(BaseModel):

    full_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    college_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=200,
    )

    degree: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    branch: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=120,
    )

    tenth_cgpa: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )

    twelfth_cgpa: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )

    be_cgpa: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )

    phone: Optional[str] = Field(
        default=None,
        min_length=10,
        max_length=30,
    )

    @field_validator(
        "full_name",
        "college_name",
        "degree",
        "branch",
    )
    @classmethod
    def clean_optional_text(
        cls,
        value: Optional[str],
    ):

        if value is None:
            return None

        value = value.strip()

        if not value:

            raise ValueError(
                "This field cannot be empty."
            )

        return value


# ============================================================
# STUDENT RESPONSE
# ============================================================

class StudentResponse(
    ORMBaseModel
):

    id: int

    full_name: str

    college_name: str

    degree: str

    branch: str

    tenth_cgpa: Optional[float] = None

    twelfth_cgpa: Optional[float] = None

    be_cgpa: Optional[float] = None

    phone: str

    email: EmailStr

    email_verified: bool

    phone_verified: bool

    approval_status: str

    rejection_reason: Optional[str] = None

    created_at: datetime

    updated_at: datetime


# ============================================================
# COMPATIBILITY ALIAS
# ============================================================
#
# Existing auth.py expects:
#
# StudentOut
#
# New code uses:
#
# StudentResponse
# ============================================================

StudentOut = StudentResponse


# ============================================================
# LOGIN REQUEST
# ============================================================

class LoginRequest(BaseModel):

    email: EmailStr

    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
    )


# ============================================================
# COMPATIBILITY ALIAS
# ============================================================
#
# Existing auth.py expects:
#
# Login
#
# New code uses:
#
# LoginRequest
# ============================================================

Login = LoginRequest


# ============================================================
# TOKEN RESPONSE
# ============================================================

class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"


# ============================================================
# COMPATIBILITY ALIAS
# ============================================================

Token = TokenResponse


# ============================================================
# EMAIL OTP REQUEST
# ============================================================

class OTPRequest(BaseModel):

    email: EmailStr


# ============================================================
# EMAIL OTP VERIFY
# ============================================================

class OTPVerifyRequest(BaseModel):

    email: EmailStr

    otp: str = Field(
        ...,
        min_length=6,
        max_length=6,
    )

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, value: str):

        value = value.strip()

        if not value.isdigit():

            raise ValueError(
                "OTP must contain only numbers."
            )

        if len(value) != 6:

            raise ValueError(
                "OTP must contain exactly 6 digits."
            )

        return value


# ============================================================
# PHONE OTP REQUEST
# ============================================================

class PhoneOTPRequest(BaseModel):

    phone: str = Field(
        ...,
        min_length=10,
        max_length=30,
    )

    @field_validator("phone")
    @classmethod
    def clean_phone(cls, value: str):

        value = value.strip()

        if not value:

            raise ValueError(
                "Phone number is required."
            )

        return value


# ============================================================
# PHONE OTP VERIFY
# ============================================================

class PhoneOTPVerifyRequest(BaseModel):

    phone: str = Field(
        ...,
        min_length=10,
        max_length=30,
    )

    otp: str = Field(
        ...,
        min_length=4,
        max_length=8,
    )

    @field_validator("phone")
    @classmethod
    def clean_phone(cls, value: str):

        value = value.strip()

        if not value:

            raise ValueError(
                "Phone number is required."
            )

        return value

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, value: str):

        value = value.strip()

        if not value.isdigit():

            raise ValueError(
                "OTP must contain only numbers."
            )

        return value


# ============================================================
# ADMIN DECISION
# ============================================================

class AdminDecision(BaseModel):

    reason: Optional[str] = Field(
        default=None,
        max_length=1000,
    )

    @field_validator("reason")
    @classmethod
    def clean_reason(
        cls,
        value: Optional[str],
    ):

        if value is None:
            return None

        value = value.strip()

        if not value:
            return None

        return value


# ============================================================
# GENERIC MESSAGE RESPONSE
# ============================================================

class MessageResponse(BaseModel):

    message: str

    success: bool = True


# ============================================================
# COMPATIBILITY ALIAS
# ============================================================

Message = MessageResponse


# ============================================================
# REGISTRATION RESPONSE
# ============================================================

class RegistrationResponse(BaseModel):

    success: bool = True

    message: str

    student_id: Optional[int] = None

    email: Optional[EmailStr] = None

    phone: Optional[str] = None

    email_verified: bool = False

    phone_verified: bool = False

    approval_status: str = "PENDING"


# ============================================================
# VERIFICATION RESPONSE
# ============================================================

class VerificationResponse(BaseModel):

    success: bool = True

    message: str

    email_verified: Optional[bool] = None

    phone_verified: Optional[bool] = None


# ============================================================
# ADMIN DASHBOARD RESPONSE
# ============================================================

class AdminDashboardResponse(BaseModel):

    total_students: int

    pending_students: int

    approved_students: int

    rejected_students: int

    email_verified: int

    phone_verified: int

    fully_verified: int
