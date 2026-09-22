# backend/routers/students.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Student
from schemas import StudentOut, UpdateStudent
from security import current_student


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
def get_my_profile(
    current: Student = Depends(current_student),
):
    """
    Return the currently logged-in student's profile.
    """

    return current


# ============================================================
# UPDATE CURRENT STUDENT PROFILE
# ============================================================

@router.put(
    "/me",
    response_model=StudentOut,
)
def update_my_profile(
    student_data: UpdateStudent,
    current: Student = Depends(current_student),
    db: Session = Depends(get_db),
):
    """
    Update the currently logged-in student's profile.
    """

    update_data = student_data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # Nothing to update
    # --------------------------------------------------------

    if not update_data:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields were provided for update.",
        )

    # --------------------------------------------------------
    # Check duplicate phone
    # --------------------------------------------------------

    if "phone" in update_data:

        existing_phone = (
            db.query(Student)
            .filter(
                Student.phone == update_data["phone"],
                Student.id != current.id,
            )
            .first()
        )

        if existing_phone:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Phone number is already registered "
                    "with another student."
                ),
            )

    # --------------------------------------------------------
    # Update fields
    # --------------------------------------------------------

    for field, value in update_data.items():

        if hasattr(current, field):

            setattr(
                current,
                field,
                value,
            )

    # --------------------------------------------------------
    # Profile changes may require re-verification
    # --------------------------------------------------------

    if "phone" in update_data:

        current.phone_verified = False

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    db.commit()
    db.refresh(current)

    return current


# ============================================================
# GET STUDENT BY ID
# ============================================================

@router.get(
    "/{student_id}",
    response_model=StudentOut,
)
def get_student(
    student_id: int,
    current: Student = Depends(current_student),
    db: Session = Depends(get_db),
):
    """
    Get a student record.

    A student can only access their own record through this
    endpoint.
    """

    if current.id != student_id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own profile.",
        )

    student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if student is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found.",
        )

    return student


# ============================================================
# DELETE CURRENT STUDENT ACCOUNT
# ============================================================

@router.delete(
    "/me",
)
def delete_my_account(
    current: Student = Depends(current_student),
    db: Session = Depends(get_db),
):
    """
    Delete the currently logged-in student's account.
    """

    db.delete(current)
    db.commit()

    return {
        "success": True,
        "message": "Student account deleted successfully.",
    }
  
