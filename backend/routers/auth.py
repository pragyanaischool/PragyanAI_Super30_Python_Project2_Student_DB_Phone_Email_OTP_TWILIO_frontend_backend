from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import Student
from schemas import Register, Login, Token, Message, StudentOut
from security import hash_password, verify_password


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# JWT
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


def create_access_token(data: dict):
    """
    Create JWT access token.
    """

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
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
# CURRENT STUDENT
# ============================================================

def get_current_student(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Decode JWT and return the currently authenticated student.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={
            "WWW-Authenticate": "Bearer",
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
        .filter(Student.id == student_id)
        .first()
    )

    if student is None:
        raise credentials_exception

    return student


# ============================================================
# REGISTER
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
    """
    Register a new student.
    """

    # --------------------------------------------------------
    # Normalize email
    # --------------------------------------------------------

    email = str(
        student_data.email
    ).strip().lower()

    # --------------------------------------------------------
    # Normalize phone
    # --------------------------------------------------------

    phone = str(
        student_data.phone
    ).strip()

    # --------------------------------------------------------
    # Check duplicate email
    # --------------------------------------------------------

    existing_email = (
        db.query(Student)
        .filter(Student.email == email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )

    # --------------------------------------------------------
    # Check duplicate phone
    # --------------------------------------------------------

    existing_phone = (
        db.query(Student)
        .filter(Student.phone == phone)
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered.",
        )

    # --------------------------------------------------------
    # Create student
    # --------------------------------------------------------

    student = Student(
        full_name=student_data.full_name,
        college_name=student_data.college_name,
        degree=student_data.degree,
        branch=student_data.branch,
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

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    db.add(student)

    try:
        db.commit()
        db.refresh(student)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create student registration.",
        )

    return student


# ============================================================
# LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=Token,
)
def login_student(
    login_data: Login,
    db: Session = Depends(get_db),
):
    """
    Student login using JSON:

    {
        "email": "student@gmail.com",
        "password": "Student@123"
    }
    """

    # --------------------------------------------------------
    # Validate request object
    # --------------------------------------------------------

    if login_data is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login information is required.",
        )

    # --------------------------------------------------------
    # Normalize email
    # --------------------------------------------------------

    email = str(
        login_data.email
    ).strip().lower()

    password = str(
        login_data.password
    )

    # --------------------------------------------------------
    # Basic validation
    # --------------------------------------------------------

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is required.",
        )

    if not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required.",
        )

    # --------------------------------------------------------
    # Find student
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(Student.email == email)
        .first()
    )

    # --------------------------------------------------------
    # Invalid credentials
    # --------------------------------------------------------

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    # --------------------------------------------------------
    # Verify password
    # --------------------------------------------------------

    try:
        password_valid = verify_password(
            password,
            student.password_hash,
        )

    except Exception:
        password_valid = False

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    # --------------------------------------------------------
    # Email verification
    # --------------------------------------------------------

    if not student.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before login.",
        )

    # --------------------------------------------------------
    # Phone verification
    # --------------------------------------------------------

    if not student.phone_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your phone number before login.",
        )

    # --------------------------------------------------------
    # Admin approval
    # --------------------------------------------------------

    approval_status = str(
        student.approval_status or ""
    ).strip().upper()

    if approval_status != "APPROVED":

        if approval_status == "REJECTED":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Your registration has been rejected. "
                    "Please contact PragyanAI administration."
                ),
            )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your account is awaiting admin approval."
            ),
        )

    # --------------------------------------------------------
    # Create JWT
    # --------------------------------------------------------

    access_token = create_access_token(
        {
            "sub": str(student.id),
            "email": student.email,
            "role": "student",
        }
    )

    # --------------------------------------------------------
    # Return token
    # --------------------------------------------------------

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
    """
    Return authenticated student.
    """

    return current_student


# ============================================================
# LOGOUT
# ============================================================

@router.post(
    "/logout",
    response_model=Message,
)
def logout():
    """
    JWT logout is handled client-side by removing
    the stored token.
    """

    return {
        "message": (
            "Logout successful. "
            "Please remove the JWT token from the frontend."
        ),
        "success": True,
    }

    
