# backend/routers/auth.py

from datetime import datetime, timedelta

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

    expire = datetime.utcnow() + timedelta(
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

    # --------------------------------------------------------
    # Check duplicate email
    # --------------------------------------------------------

    existing_email = (
        db.query(Student)
        .filter(Student.email == student_data.email)
        .first()
    )

    if existing_email:

        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    # --------------------------------------------------------
    # Check duplicate phone
    # --------------------------------------------------------

    existing_phone = (
        db.query(Student)
        .filter(Student.phone == student_data.phone)
        .first()
    )

    if existing_phone:

        raise HTTPException(
            status_code=400,
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
        phone=student_data.phone,
        email=str(student_data.email).lower(),
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

    email = str(login_data.email).lower()

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
        )

    if not verify_password(
        login_data.password,
        student.password_hash,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # --------------------------------------------------------
    # Email verification
    # --------------------------------------------------------

    if not student.email_verified:

        raise HTTPException(
            status_code=403,
            detail="Please verify your email before login.",
        )

    # --------------------------------------------------------
    # Phone verification
    # --------------------------------------------------------

    if not student.phone_verified:

        raise HTTPException(
            status_code=403,
            detail="Please verify your phone number before login.",
        )

    # --------------------------------------------------------
    # Admin approval
    # --------------------------------------------------------

    if student.approval_status != "APPROVED":

        if student.approval_status == "REJECTED":

            raise HTTPException(
                status_code=403,
                detail=(
                    "Your registration has been rejected. "
                    "Please contact PragyanAI administration."
                ),
            )

        raise HTTPException(
            status_code=403,
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
            "Please remove the JWT token from the frontend."
        ),
        "success": True,
    }
    
