# ============================================================
# PragyanAI Student Verification Platform
# File: backend/create_test_student.py
# ============================================================

from database import SessionLocal
from models import Student
from security import hash_password


# ============================================================
# TEST STUDENT DETAILS
# ============================================================

EMAIL = "student@gmail.com"
PASSWORD = "Student@123"

PHONE = "9876543210"


# ============================================================
# CREATE STUDENT
# ============================================================

def create_test_student():

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Check existing student
        # ----------------------------------------------------

        existing_student = (
            db.query(Student)
            .filter(
                Student.email == EMAIL
            )
            .first()
        )

        # ----------------------------------------------------
        # If already exists, update it
        # ----------------------------------------------------

        if existing_student:

            print(
                f"Student already exists: {EMAIL}"
            )

            existing_student.password_hash = (
                hash_password(PASSWORD)
            )

            existing_student.email_verified = True

            existing_student.phone_verified = True

            existing_student.approval_status = "APPROVED"

            existing_student.rejection_reason = None

            db.commit()

            db.refresh(
                existing_student
            )

            print(
                "Existing student updated successfully."
            )

            print(
                f"Student ID: {existing_student.id}"
            )

            return

        # ----------------------------------------------------
        # Create new student
        # ----------------------------------------------------

        student = Student(

            full_name="Test Student",

            college_name="PragyanAI Test College",

            degree="BE",

            branch="Computer Science and Engineering",

            tenth_cgpa=8.5,

            twelfth_cgpa=8.5,

            be_cgpa=8.5,

            phone=PHONE,

            email=EMAIL,

            password_hash=
                hash_password(PASSWORD),

            email_verified=True,

            phone_verified=True,

            approval_status="APPROVED",

            rejection_reason=None,
        )

        # ----------------------------------------------------
        # Save
        # ----------------------------------------------------

        db.add(student)

        db.commit()

        db.refresh(student)

        print(
            "============================================"
        )

        print(
            "TEST STUDENT CREATED SUCCESSFULLY"
        )

        print(
            "============================================"
        )

        print(
            f"Student ID: {student.id}"
        )

        print(
            f"Email: {student.email}"
        )

        print(
            "Password: Student@123"
        )

        print(
            f"Email Verified: {student.email_verified}"
        )

        print(
            f"Phone Verified: {student.phone_verified}"
        )

        print(
            f"Approval Status: {student.approval_status}"
        )

        print(
            "============================================"
        )

    except Exception as error:

        db.rollback()

        print(
            "ERROR:",
            error
        )

        raise

    finally:

        db.close()


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    create_test_student()
