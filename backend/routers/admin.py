# ============================================================
# PragyanAI Student Verification Platform
# File: backend/routers/admin.py
# ============================================================

from datetime import datetime, timedelta, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from jose import (
    JWTError,
    jwt,
)

from pydantic import (
    BaseModel,
    Field,
)

from sqlalchemy.orm import Session

from sqlalchemy import func

from config import settings
from database import get_db
from models import Student


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ============================================================
# SECURITY
# ============================================================

security = HTTPBearer()


# ============================================================
# REQUEST SCHEMAS
# ============================================================

class AdminLoginRequest(BaseModel):

    email: str = Field(
        ...,
        min_length=3,
        max_length=255,
    )

    password: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )


class RejectStudentRequest(BaseModel):

    rejection_reason: str = Field(
        ...,
        min_length=1,
        max_length=1000,
    )


# ============================================================
# CREATE ADMIN TOKEN
# ============================================================

def create_admin_token():

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    )

    payload = {
        "sub": settings.admin_email,
        "email": settings.admin_email,
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

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials.",
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
        email = payload.get("email")

        if role != "admin":

            raise credentials_exception

        if not email:

            raise credentials_exception

        if (
            str(email).strip().lower()
            != str(
                settings.admin_email
            ).strip().lower()
        ):

            raise credentials_exception

        return {
            "email": email,
            "role": role,
        }

    except JWTError:

        raise credentials_exception

    except Exception:

        raise credentials_exception


# ============================================================
# ADMIN LOGIN
# ============================================================

@router.post(
    "/login",
)
def admin_login(
    login_data: AdminLoginRequest,
):

    email = (
        login_data.email
        .strip()
        .lower()
    )

    password = login_data.password

    configured_email = (
        str(
            settings.admin_email
        )
        .strip()
        .lower()
    )

    configured_password = str(
        settings.admin_password
    )

    print(
        f"Admin login attempt: {email}"
    )

    # --------------------------------------------------------
    # VERIFY ADMIN CREDENTIALS
    # --------------------------------------------------------

    if (
        email != configured_email
        or password != configured_password
    ):

        print(
            f"Admin login failed: {email}"
        )

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

    print(
        f"Admin login successful: {email}"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "admin",
        "email": configured_email,
    }


# ============================================================
# ADMIN PROFILE
# ============================================================

@router.get(
    "/me",
)
def admin_me(
    current_admin: dict = Depends(
        get_current_admin
    ),
):

    return {
        "email": current_admin["email"],
        "role": current_admin["role"],
    }


# ============================================================
# ADMIN DASHBOARD
# ============================================================

@router.get(
    "/dashboard",
)
def admin_dashboard(
    current_admin: dict = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):

    total_students = (
        db.query(
            func.count(Student.id)
        )
        .scalar()
        or 0
    )

    pending_students = (
        db.query(
            func.count(Student.id)
        )
        .filter(
            Student.approval_status
            == "PENDING"
        )
        .scalar()
        or 0
    )

    approved_students = (
        db.query(
            func.count(Student.id)
        )
        .filter(
            Student.approval_status
            == "APPROVED"
        )
        .scalar()
        or 0
    )

    rejected_students = (
        db.query(
            func.count(Student.id)
        )
        .filter(
            Student.approval_status
            == "REJECTED"
        )
        .scalar()
        or 0
    )

    email_verified_students = (
        db.query(
            func.count(Student.id)
        )
        .filter(
            Student.email_verified.is_(True)
        )
        .scalar()
        or 0
    )

    phone_verified_students = (
        db.query(
            func.count(Student.id)
        )
        .filter(
            Student.phone_verified.is_(True)
        )
        .scalar()
        or 0
    )

    fully_verified_students = (
        db.query(
            func.count(Student.id)
        )
        .filter(
            Student.email_verified.is_(True)
        )
        .filter(
            Student.phone_verified.is_(True)
        )
        .scalar()
        or 0
    )

    return {
        "total_students": total_students,

        "pending_students": pending_students,

        "approved_students": approved_students,

        "rejected_students": rejected_students,

        "email_verified_students": (
            email_verified_students
        ),

        "phone_verified_students": (
            phone_verified_students
        ),

        "fully_verified_students": (
            fully_verified_students
        ),
    }


# ============================================================
# LIST STUDENTS
# ============================================================

@router.get(
    "/students",
)
def list_students(
    current_admin: dict = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):

    students = (
        db.query(Student)
        .order_by(
            Student.created_at.desc()
        )
        .all()
    )

    return {
        "students": [
            {
                "id": student.id,

                "full_name": student.full_name,

                "college_name": student.college_name,

                "degree": student.degree,

                "branch": student.branch,

                "tenth_cgpa": student.tenth_cgpa,

                "twelfth_cgpa": student.twelfth_cgpa,

                "be_cgpa": student.be_cgpa,

                "phone": student.phone,

                "email": student.email,

                "email_verified": (
                    student.email_verified
                ),

                "phone_verified": (
                    student.phone_verified
                ),

                "approval_status": (
                    student.approval_status
                ),

                "rejection_reason": (
                    student.rejection_reason
                ),

                "created_at": (
                    student.created_at
                ),

                "updated_at": (
                    student.updated_at
                ),
            }

            for student in students
        ],

        "count": len(students),
    }


# ============================================================
# GET SINGLE STUDENT
# ============================================================

@router.get(
    "/students/{student_id}",
)
def get_student(
    student_id: int,
    current_admin: dict = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):

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

    return {
        "id": student.id,

        "full_name": student.full_name,

        "college_name": student.college_name,

        "degree": student.degree,

        "branch": student.branch,

        "tenth_cgpa": student.tenth_cgpa,

        "twelfth_cgpa": student.twelfth_cgpa,

        "be_cgpa": student.be_cgpa,

        "phone": student.phone,

        "email": student.email,

        "email_verified": (
            student.email_verified
        ),

        "phone_verified": (
            student.phone_verified
        ),

        "approval_status": (
            student.approval_status
        ),

        "rejection_reason": (
            student.rejection_reason
        ),

        "created_at": (
            student.created_at
        ),

        "updated_at": (
            student.updated_at
        ),
    }


# ============================================================
# APPROVE STUDENT
# ============================================================

@router.put(
    "/students/{student_id}/approve",
)
def approve_student(
    student_id: int,
    current_admin: dict = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):

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
    # APPROVE
    # --------------------------------------------------------

    student.approval_status = "APPROVED"

    student.rejection_reason = None

    db.commit()

    db.refresh(student)

    return {
        "message": "Student approved successfully.",

        "success": True,

        "student": {
            "id": student.id,

            "full_name": student.full_name,

            "email": student.email,

            "approval_status": (
                student.approval_status
            ),
        },
    }


# ============================================================
# REJECT STUDENT
# ============================================================

@router.put(
    "/students/{student_id}/reject",
)
def reject_student(
    student_id: int,
    request: RejectStudentRequest,
    current_admin: dict = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):

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
    # REJECT
    # --------------------------------------------------------

    student.approval_status = "REJECTED"

    student.rejection_reason = (
        request.rejection_reason.strip()
    )

    db.commit()

    db.refresh(student)

    return {
        "message": "Student rejected successfully.",

        "success": True,

        "student": {
            "id": student.id,

            "full_name": student.full_name,

            "email": student.email,

            "approval_status": (
                student.approval_status
            ),

            "rejection_reason": (
                student.rejection_reason
            ),
        },
    }


# ============================================================
# RESET STUDENT TO PENDING
# ============================================================

@router.put(
    "/students/{student_id}/pending",
)
def reset_student_to_pending(
    student_id: int,
    current_admin: dict = Depends(
        get_current_admin
    ),
    db: Session = Depends(get_db),
):

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

    student.approval_status = "PENDING"

    student.rejection_reason = None

    db.commit()

    db.refresh(student)

    return {
        "message": (
            "Student moved to pending status."
        ),

        "success": True,

        "student": {
            "id": student.id,

            "full_name": student.full_name,

            "email": student.email,

            "approval_status": (
                student.approval_status
            ),
        },
    }
