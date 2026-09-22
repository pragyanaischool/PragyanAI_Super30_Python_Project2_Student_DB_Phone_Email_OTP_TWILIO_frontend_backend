# ============================================================
# PragyanAI Student Verification Platform
# File: backend/routers/admin.py
# ============================================================

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import Student
from schemas import AdminDecision, LoginRequest, TokenResponse


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ============================================================
# BEARER AUTHENTICATION
# ============================================================

security = HTTPBearer(
    auto_error=False
)


# ============================================================
# ADMIN CREDENTIALS
# ============================================================

# These are the DEFAULT values.
#
# Render environment variables take precedence:
#
# ADMIN_EMAIL=admin@pragyanai.com
# ADMIN_PASSWORD=12345678
#
# ============================================================

DEFAULT_ADMIN_EMAIL = "admin@pragyanai.com"
DEFAULT_ADMIN_PASSWORD = "12345678"


# ============================================================
# CREATE ADMIN JWT
# ============================================================

def create_admin_token() -> str:
    """
    Create JWT token for administrator.
    """

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    )

    payload = {
        "sub": settings.admin_email,
        "role": "admin",
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm="HS256",
    )


# ============================================================
# GET CURRENT ADMIN
# ============================================================

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
):
    """
    Validate administrator JWT.

    Frontend request must contain:

    Authorization: Bearer <JWT>
    """

    if credentials is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin authentication required.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=["HS256"],
        )

        role = payload.get("role")

        subject = payload.get("sub")

        # ----------------------------------------------------
        # CHECK ROLE
        # ----------------------------------------------------

        if role != "admin":

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required.",
            )

        # ----------------------------------------------------
        # CHECK SUBJECT
        # ----------------------------------------------------

        if not subject:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token.",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        return subject

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired admin token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


# ============================================================
# ADMIN LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=TokenResponse,
)
def admin_login(
    request: LoginRequest,
):
    """
    Admin login.

    Endpoint:

        POST /api/admin/login

    Request:

        {
            "email": "admin@pragyanai.com",
            "password": "12345678"
        }

    Response:

        {
            "access_token": "...",
            "token_type": "bearer"
        }
    """

    # --------------------------------------------------------
    # CLEAN INPUT
    # --------------------------------------------------------

    email = request.email.strip().lower()

    password = request.password.strip()

    # --------------------------------------------------------
    # GET CONFIGURED ADMIN CREDENTIALS
    # --------------------------------------------------------

    configured_email = (
        getattr(
            settings,
            "admin_email",
            DEFAULT_ADMIN_EMAIL,
        )
        or DEFAULT_ADMIN_EMAIL
    )

    configured_password = (
        getattr(
            settings,
            "admin_password",
            DEFAULT_ADMIN_PASSWORD,
        )
        or DEFAULT_ADMIN_PASSWORD
    )

    configured_email = (
        configured_email.strip().lower()
    )

    configured_password = (
        configured_password.strip()
    )

    # --------------------------------------------------------
    # VALIDATE EMAIL
    # --------------------------------------------------------

    if not email:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin email is required.",
        )

    # --------------------------------------------------------
    # VALIDATE PASSWORD
    # --------------------------------------------------------

    if not password:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin password is required.",
        )

    # --------------------------------------------------------
    # CHECK ADMIN EMAIL
    # --------------------------------------------------------

    if email != configured_email:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------------
    # CHECK ADMIN PASSWORD
    # --------------------------------------------------------

    if password != configured_password:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------------
    # CREATE TOKEN
    # --------------------------------------------------------

    access_token = create_admin_token()

    # --------------------------------------------------------
    # RETURN TOKEN
    # --------------------------------------------------------

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
    )


# ============================================================
# ADMIN PROFILE
# ============================================================

@router.get(
    "/me",
)
def admin_me(
    admin_email: str = Depends(
        get_current_admin
    ),
):
    """
    Return currently authenticated admin.
    """

    return {
        "authenticated": True,
        "role": "admin",
        "email": admin_email,
    }


# ============================================================
# GET ALL STUDENTS
# ============================================================

@router.get(
    "/students",
)
def get_all_students(
    admin_email: str = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):
    """
    Return all students.

    Requires admin JWT.
    """

    students = (
        db.query(Student)
        .order_by(
            Student.created_at.desc()
        )
        .all()
    )

    return students


# ============================================================
# GET SINGLE STUDENT
# ============================================================

@router.get(
    "/students/{student_id}",
)
def get_student(
    student_id: int,
    admin_email: str = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):
    """
    Get one student by ID.
    """

    student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if student is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found.",
        )

    return student


# ============================================================
# APPROVE STUDENT
# ============================================================

@router.put(
    "/students/{student_id}/approve",
)
def approve_student(
    student_id: int,
    admin_email: str = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):
    """
    Approve a student.

    Requirements:

    1. Student exists
    2. Email verified
    3. Phone verified
    """

    # --------------------------------------------------------
    # FIND STUDENT
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if student is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found.",
        )

    # --------------------------------------------------------
    # EMAIL VERIFICATION
    # --------------------------------------------------------

    if not student.email_verified:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Student email is not verified. "
                "Student cannot be approved."
            ),
        )

    # --------------------------------------------------------
    # PHONE VERIFICATION
    # --------------------------------------------------------

    if not student.phone_verified:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Student phone is not verified. "
                "Student cannot be approved."
            ),
        )

    # --------------------------------------------------------
    # APPROVE
    # --------------------------------------------------------

    student.approval_status = "APPROVED"

    student.rejection_reason = None

    student.updated_at = datetime.utcnow()

    # --------------------------------------------------------
    # DATABASE COMMIT
    # --------------------------------------------------------

    db.commit()

    db.refresh(student)

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "Student approved successfully.",
        "student": student,
    }


# ============================================================
# REJECT STUDENT
# ============================================================

@router.put(
    "/students/{student_id}/reject",
)
def reject_student(
    student_id: int,
    decision: AdminDecision,
    admin_email: str = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):
    """
    Reject a student.

    Request:

        {
            "reason": "Incomplete information"
        }
    """

    # --------------------------------------------------------
    # FIND STUDENT
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if student is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found.",
        )

    # --------------------------------------------------------
    # GET REASON
    # --------------------------------------------------------

    reason = ""

    if decision.reason:

        reason = decision.reason.strip()

    if not reason:

        reason = "Rejected by administrator."

    # --------------------------------------------------------
    # REJECT
    # --------------------------------------------------------

    student.approval_status = "REJECTED"

    student.rejection_reason = reason

    student.updated_at = datetime.utcnow()

    # --------------------------------------------------------
    # DATABASE COMMIT
    # --------------------------------------------------------

    db.commit()

    db.refresh(student)

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "Student rejected successfully.",
        "student": student,
    }


# ============================================================
# GET STUDENTS BY STATUS
# ============================================================

@router.get(
    "/students/status/{approval_status}",
)
def get_students_by_status(
    approval_status: str,
    admin_email: str = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):
    """
    Get students by approval status.

    Supported:

        PENDING
        APPROVED
        REJECTED
    """

    # --------------------------------------------------------
    # NORMALIZE STATUS
    # --------------------------------------------------------

    approval_status = (
        approval_status
        .strip()
        .upper()
    )

    # --------------------------------------------------------
    # VALID STATUS
    # --------------------------------------------------------

    allowed_statuses = {
        "PENDING",
        "APPROVED",
        "REJECTED",
    }

    if approval_status not in allowed_statuses:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid approval status. "
                "Use PENDING, APPROVED or REJECTED."
            ),
        )

    # --------------------------------------------------------
    # QUERY
    # --------------------------------------------------------

    students = (
        db.query(Student)
        .filter(
            Student.approval_status
            == approval_status
        )
        .order_by(
            Student.created_at.desc()
        )
        .all()
    )

    return students


# ============================================================
# ADMIN DASHBOARD STATISTICS
# ============================================================

@router.get(
    "/dashboard",
)
def admin_dashboard(
    admin_email: str = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):
    """
    Return admin dashboard statistics.
    """

    # --------------------------------------------------------
    # TOTAL
    # --------------------------------------------------------

    total_students = (
        db.query(Student)
        .count()
    )

    # --------------------------------------------------------
    # PENDING
    # --------------------------------------------------------

    pending_students = (
        db.query(Student)
        .filter(
            Student.approval_status
            == "PENDING"
        )
        .count()
    )

    # --------------------------------------------------------
    # APPROVED
    # --------------------------------------------------------

    approved_students = (
        db.query(Student)
        .filter(
            Student.approval_status
            == "APPROVED"
        )
        .count()
    )

    # --------------------------------------------------------
    # REJECTED
    # --------------------------------------------------------

    rejected_students = (
        db.query(Student)
        .filter(
            Student.approval_status
            == "REJECTED"
        )
        .count()
    )

    # --------------------------------------------------------
    # EMAIL VERIFIED
    # --------------------------------------------------------

    email_verified = (
        db.query(Student)
        .filter(
            Student.email_verified == True
        )
        .count()
    )

    # --------------------------------------------------------
    # PHONE VERIFIED
    # --------------------------------------------------------

    phone_verified = (
        db.query(Student)
        .filter(
            Student.phone_verified == True
        )
        .count()
    )

    # --------------------------------------------------------
    # FULLY VERIFIED
    # --------------------------------------------------------

    fully_verified = (
        db.query(Student)
        .filter(
            Student.email_verified == True,
            Student.phone_verified == True,
        )
        .count()
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "total_students": total_students,
        "pending_students": pending_students,
        "approved_students": approved_students,
        "rejected_students": rejected_students,
        "email_verified": email_verified,
        "phone_verified": phone_verified,
        "fully_verified": fully_verified,
    }
    
