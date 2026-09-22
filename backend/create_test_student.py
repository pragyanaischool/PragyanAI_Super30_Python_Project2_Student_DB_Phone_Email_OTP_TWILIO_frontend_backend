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

TEST_EMAIL = "student@gmail.com"
TEST_PASSWORD = "Student@123"
TEST_PHONE = "9999999999"


# ============================================================
# CREATE / UPDATE TEST STUDENT
# ============================================================

def create_test_student():

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # CHECK WHETHER STUDENT ALREADY EXISTS
        # ----------------------------------------------------

        student = (
            db.query(Student)
            .filter(
                Student.email == TEST_EMAIL
            )
            .first()
        )

        # ----------------------------------------------------
        # CREATE NEW STUDENT
        # ----------------------------------------------------

        if student is None:

            print(
                f"Student not found. "
                f"Creating {TEST_EMAIL}..."
            )

            student = Student(
                full_name="PragyanAI Test Student",

                college_name=(
                    "PragyanAI Demo College"
                ),

                degree="BE",

                branch="Computer Science and Engineering",

                tenth_cgpa=9.0,

                twelfth_cgpa=9.0,

                be_cgpa=8.5,

                phone=TEST_PHONE,

                email=TEST_EMAIL,

                password_hash=hash_password(
                    TEST_PASSWORD
                ),

                email_verified=True,

                phone_verified=True,

                approval_status="APPROVED",

                rejection_reason=None,
            )

            db.add(student)

            db.commit()

            db.refresh(student)

            print(
                "================================================"
            )

            print(
                "TEST STUDENT CREATED SUCCESSFULLY"
            )

            print(
                "================================================"
            )

            print(
                f"ID       : {student.id}"
            )

            print(
                f"Email    : {student.email}"
            )

            print(
                f"Password : {TEST_PASSWORD}"
            )

            print(
                f"Phone    : {student.phone}"
            )

            print(
                f"Email Verified : {student.email_verified}"
            )

            print(
                f"Phone Verified : {student.phone_verified}"
            )

            print(
                f"Approval Status : {student.approval_status}"
            )

            print(
                "================================================"
            )

        # ----------------------------------------------------
        # UPDATE EXISTING STUDENT
        # ----------------------------------------------------

        else:

            print(
                f"Student already exists: "
                f"{student.email}"
            )

            student.password_hash = hash_password(
                TEST_PASSWORD
            )

            student.email_verified = True

            student.phone_verified = True

            student.approval_status = "APPROVED"

            student.rejection_reason = None

            db.commit()

            db.refresh(student)

            print(
                "================================================"
            )

            print(
                "TEST STUDENT UPDATED SUCCESSFULLY"
            )

            print(
                "================================================"
            )

            print(
                f"ID       : {student.id}"
            )

            print(
                f"Email    : {student.email}"
            )

            print(
                f"Password : {TEST_PASSWORD}"
            )

            print(
                f"Email Verified : {student.email_verified}"
            )

            print(
                f"Phone Verified : {student.phone_verified}"
            )

            print(
                f"Approval Status : {student.approval_status}"
            )

            print(
                "================================================"
            )

    except Exception as error:

        db.rollback()

        print(
            "================================================"
        )

        print(
            "ERROR CREATING TEST STUDENT"
        )

        print(
            "================================================"
        )

        print(
            repr(error)
        )

        raise

    finally:

        db.close()


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    create_test_student()
