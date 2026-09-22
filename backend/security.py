# backend/security.py

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import Student


# ============================================================
# CONFIGURATION
# ============================================================

ALGORITHM = "HS256"


# ============================================================
# PASSWORD HASHING
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using bcrypt.
    """

    if not password:
        raise ValueError("Password cannot be empty.")

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against a bcrypt hash.
    """

    if not plain_password or not hashed_password:
        return False

    try:

        return pwd_context.verify(
            plain_password,
            hashed_password,
        )

    except Exception:

        return False


# ============================================================
# OAUTH2
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


# ============================================================
# CREATE ACCESS TOKEN
# ============================================================

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create JWT access token.
    """

    if not settings.secret_key:

        raise RuntimeError(
            "SECRET_KEY is not configured."
        )

    to_encode = data.copy()

    if expires_delta is not None:

        expire = (
            datetime.now(timezone.utc)
            + expires_delta
        )

    else:

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

    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=ALGORITHM,
    )

    return encoded_jwt


# ============================================================
# DECODE ACCESS TOKEN
# ============================================================

def decode_access_token(
    token: str,
) -> Optional[dict]:
    """
    Decode and validate JWT token.
    """

    if not token:
        return None

    if not settings.secret_key:
        return None

    try:

        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[ALGORITHM],
        )

        return payload

    except JWTError:

        return None

    except Exception:

        return None


# ============================================================
# CURRENT STUDENT
# ============================================================

def get_current_student(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Student:
    """
    Get the currently authenticated student.

    This dependency is used by protected endpoints such as:

        GET /api/students/me
        POST /api/otp/email/send
        POST /api/otp/email/verify
        POST /api/otp/phone/send
        POST /api/otp/phone/verify
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )

    # --------------------------------------------------------
    # Decode JWT
    # --------------------------------------------------------

    payload = decode_access_token(token)

    if payload is None:

        raise credentials_exception

    # --------------------------------------------------------
    # Get subject
    # --------------------------------------------------------

    subject = payload.get("sub")

    if subject is None:

        raise credentials_exception

    # --------------------------------------------------------
    # Convert student ID
    # --------------------------------------------------------

    try:

        student_id = int(subject)

    except (
        ValueError,
        TypeError,
    ):

        raise credentials_exception

    # --------------------------------------------------------
    # Find student
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if student is None:

        raise credentials_exception

    return student


# ============================================================
# COMPATIBILITY ALIAS
# ============================================================

# Existing routers may import:
#
#     from security import current_student
#
# Therefore expose the dependency under both names.

current_student = get_current_student


# ============================================================
# USER ID FROM TOKEN
# ============================================================

def get_user_id_from_token(
    token: str,
) -> Optional[int]:
    """
    Extract student/user ID from JWT `sub`.
    """

    payload = decode_access_token(token)

    if not payload:

        return None

    subject = payload.get("sub")

    if subject is None:

        return None

    try:

        return int(subject)

    except (
        ValueError,
        TypeError,
    ):

        return None


# ============================================================
# EMAIL FROM TOKEN
# ============================================================

def get_email_from_token(
    token: str,
) -> Optional[str]:
    """
    Extract email from JWT.
    """

    payload = decode_access_token(token)

    if not payload:

        return None

    email = payload.get("email")

    if not email:

        return None

    return str(email)


# ============================================================
# ROLE FROM TOKEN
# ============================================================

def get_role_from_token(
    token: str,
) -> Optional[str]:
    """
    Extract role from JWT.
    """

    payload = decode_access_token(token)

    if not payload:

        return None

    role = payload.get("role")

    if not role:

        return None

    return str(role)


# ============================================================
# TOKEN VALIDATION
# ============================================================

def is_token_valid(
    token: str,
) -> bool:
    """
    Return True when JWT is valid.
    """

    payload = decode_access_token(token)

    return payload is not None


# ============================================================
# ADMIN TOKEN
# ============================================================

def create_admin_token() -> str:
    """
    Create JWT token for administrator.
    """

    return create_access_token(
        {
            "sub": "admin",
            "email": settings.admin_email,
            "role": "admin",
        }
    )


# ============================================================
# ADMIN TOKEN VALIDATION
# ============================================================

def is_admin_token(
    token: str,
) -> bool:
    """
    Check whether JWT belongs to admin.
    """

    payload = decode_access_token(token)

    if not payload:

        return False

    return payload.get("role") == "admin"
