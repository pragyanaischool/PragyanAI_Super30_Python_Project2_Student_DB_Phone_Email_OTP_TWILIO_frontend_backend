# backend/security.py

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from config import settings


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

    Never store plain-text passwords in the database.
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
# JWT CONFIGURATION
# ============================================================

ALGORITHM = "HS256"


# ============================================================
# CREATE ACCESS TOKEN
# ============================================================

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token.

    Example:

        token = create_access_token(
            {
                "sub": str(student.id),
                "email": student.email,
                "role": "student",
            }
        )
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
    Decode and validate a JWT access token.

    Returns:
        dict -> valid token payload
        None -> invalid/expired token
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
# GET USER ID FROM TOKEN
# ============================================================

def get_user_id_from_token(
    token: str,
) -> Optional[int]:
    """
    Extract the student/user ID from JWT `sub`.
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
# GET EMAIL FROM TOKEN
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
# GET ROLE FROM TOKEN
# ============================================================

def get_role_from_token(
    token: str,
) -> Optional[str]:
    """
    Extract role from JWT.

    Possible roles:

        student
        admin
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
    Return True if the JWT is valid.
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
# CHECK ADMIN TOKEN
# ============================================================

def is_admin_token(
    token: str,
) -> bool:
    """
    Check whether a token belongs to an administrator.
    """

    payload = decode_access_token(token)

    if not payload:
        return False

    return payload.get("role") == "admin"
