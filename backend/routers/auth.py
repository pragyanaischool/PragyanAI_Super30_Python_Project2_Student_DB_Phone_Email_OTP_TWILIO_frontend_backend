# ============================================================
# PragyanAI Student Verification Platform
# File: backend/routers/auth.py
# ============================================================

from datetime import datetime, timedelta, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt

from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import Student
from schemas import (
    Register,
    Login,
    Token,
    Message,
    StudentOut,
)
from security import (
    hash_password,
    verify_password,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# OAUTH2
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


# ============================================================
# CREATE ACCESS TOKEN
# ============================================================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    )

    to_encode.update(
        {
            "exp": expire,
        }
    )

    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm="HS256",
    )


# ============================================================
# GET CURRENT STUDENT
# ============================================================

def get_current_student(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Authenticate the current student from JWT.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:

        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=["HS256"],
        )

        student_id = payload.get("sub")

        if student_id is None:
            raise credentials_exception

        student_id = int(student_id)

    except (
        JWTError,
        ValueError,
        TypeError,
    ):

        raise credentials_exception

    student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if student is None:
        raise credentials_exception

    return student


# ============================================================
# REGISTER STUDENT
# ============================================================

@router.post(
    "/register",
    response_model=StudentOut,
    status_code=status.HTTP_201_CREATED,
)
def register_student(
    student_data: Register,
    db: Session = Depends(get_db),
):

    email = (
        str(student_data.email)
        .strip()
        .lower()
    )

    phone = (
        str(student_data.phone)
        .strip()
    )

    # --------------------------------------------------------
    # CHECK EMAIL
    # --------------------------------------------------------

    existing_email = (
        db.query(Student)
        .filter(
            Student.email == email
        )
        .first()
    )

    if existing_email:

        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    # --------------------------------------------------------
    # CHECK PHONE
    # --------------------------------------------------------

    existing_phone = (
        db.query(Student)
        .filter(
            Student.phone == phone
        )
        .first()
    )

    if existing_phone:

        raise HTTPException(
            status_code=400,
            detail="Phone number already registered.",
        )

    # --------------------------------------------------------
    # CREATE STUDENT
    # --------------------------------------------------------

    student = Student(
        full_name=student_data.full_name.strip(),
        college_name=student_data.college_name.strip(),
        degree=student_data.degree.strip(),
        branch=student_data.branch.strip(),

        tenth_cgpa=student_data.tenth_cgpa,
        twelfth_cgpa=student_data.twelfth_cgpa,
        be_cgpa=student_data.be_cgpa,

        phone=phone,
        email=email,

        password_hash=hash_password(
            student_data.password
        ),

        email_verified=False,
        phone_verified=False,

        approval_status="PENDING",

    )

    db.add(student)

    db.commit()

    db.refresh(student)

    return student


# ============================================================
# STUDENT LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=Token,
)
def login_student(
    login_data: Login,
    db: Session = Depends(get_db),
):

    email = (
        str(login_data.email)
        .strip()
        .lower()
    )

    password = str(
        login_data.password
    )

    print(
        f"Student login attempt: {email}"
    )

    # --------------------------------------------------------
    # FIND STUDENT
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.email == email
        )
        .first()
    )

    if student is None:

        print(
            "Student login failed: "
            f"email not found - {email}"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------------
    # VERIFY PASSWORD
    # --------------------------------------------------------

    password_valid = verify_password(
        password,
        student.password_hash,
    )

    if not password_valid:

        print(
            "Student login failed: "
            f"invalid password - {email}"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # --------------------------------------------------------
    # EMAIL VERIFICATION
    # --------------------------------------------------------

    if not student.email_verified:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Please verify your email "
                "before login."
            ),
        )

    # --------------------------------------------------------
    # PHONE VERIFICATION
    # --------------------------------------------------------

    if not student.phone_verified:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Please verify your phone number "
                "before login."
            ),
        )

    # --------------------------------------------------------
    # ADMIN APPROVAL
    # --------------------------------------------------------

    approval_status = str(
        student.approval_status or ""
    ).strip().upper()

    if approval_status != "APPROVED":

        if approval_status == "REJECTED":

            rejection_reason = getattr(
                student,
                "rejection_reason",
                None,
            )

            if rejection_reason:

                detail = (
                    "Your registration has been rejected. "
                    f"Reason: {rejection_reason}"
                )

            else:

                detail = (
                    "Your registration has been rejected. "
                    "Please contact PragyanAI administration."
                )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=detail,
            )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your account is awaiting "
                "admin approval."
            ),
        )

    # --------------------------------------------------------
    # CREATE JWT
    # --------------------------------------------------------

    access_token = create_access_token(
        {
            "sub": str(student.id),
            "email": student.email,
            "role": "student",
        }
    )

    print(
        f"Student login successful: {email}"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# ============================================================
# CURRENT STUDENT
# ============================================================

@router.get(
    "/me",
    response_model=StudentOut,
)
def get_me(
    current_student: Student = Depends(
        get_current_student
    ),
):

    return current_student


# ============================================================
# LOGOUT
# ============================================================

@router.post(
    "/logout",
    response_model=Message,
)
def logout():

    return {
        "message": (
            "Logout successful. "
            "Please remove the JWT token "
            "from the frontend."
        ),
        "success": True,
    }
