# ============================================================
# PragyanAI Student Verification Platform
# File: backend/routers/students.py
# ============================================================

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database import get_db
from models import Student
from schemas import StudentOut
from routers.auth import get_current_student


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/students",
    tags=["Students"],
)


# ============================================================
# GET CURRENT STUDENT PROFILE
# ============================================================

@router.get(
    "/me",
    response_model=StudentOut,
)
def get_student_profile(
    current_student: Student = Depends(
        get_current_student
    ),
):
    """
    Return the profile of the currently
    authenticated student.
    """

    return current_student


# ============================================================
# GET CURRENT STUDENT DASHBOARD DATA
# ============================================================

@router.get(
    "/profile",
    response_model=StudentOut,
)
def get_student_profile_data(
    current_student: Student = Depends(
        get_current_student
    ),
):
    """
    Return profile information for the
    authenticated student.

    This endpoint is useful for the
    student dashboard.
    """

    return current_student


# ============================================================
# GET STUDENT BY ID
# ============================================================

@router.get(
    "/{student_id}",
    response_model=StudentOut,
)
def get_student(
    student_id: int,
    current_student: Student = Depends(
        get_current_student
    ),
    db: Session = Depends(get_db),
):
    """
    Get a student record.

    A student can access only their own
    student record through this endpoint.
    """

    # --------------------------------------------------------
    # AUTHORIZATION CHECK
    # --------------------------------------------------------

    if current_student.id != student_id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "access this student record."
            ),
        )

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

    # --------------------------------------------------------
    # STUDENT NOT FOUND
    # --------------------------------------------------------

    if student is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found.",
        )

    return student
