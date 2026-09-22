# ============================================================
# PragyanAI Student Verification Platform
# File: backend/security.py
# ============================================================

from datetime import datetime, timedelta, timezone

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


# ============================================================
# HASH PASSWORD
# ============================================================

def hash_password(password: str) -> str:
    """
    Hash a plain-text password using bcrypt.
    """

    if not password:
        raise ValueError(
            "Password cannot be empty."
        )

    return pwd_context.hash(password)


# ============================================================
# VERIFY PASSWORD
# ============================================================

def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against
    the stored bcrypt password hash.
    """

    if not plain_password:
        return False

    if not hashed_password:
        return False

    try:
        return pwd_context.verify(
            plain_password,
            hashed_password,
        )

    except Exception as error:

        print(
            "Password verification error:",
            error,
        )

        return False


# ============================================================
# CREATE JWT ACCESS TOKEN
# ============================================================

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a JWT access token.
    """

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

    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm="HS256",
    )


# ============================================================
# DECODE JWT ACCESS TOKEN
# ============================================================

def decode_access_token(
    token: str,
) -> dict | None:
    """
    Decode and validate a JWT.

    Returns:
        JWT payload if valid.
        None if invalid or expired.
    """

    if not token:
        return None

    try:

        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=["HS256"],
        )

        return payload

    except JWTError as error:

        print(
            "JWT validation error:",
            error,
        )

        return None

    except Exception as error:

        print(
            "Unexpected JWT error:",
            error,
        )

        return None


# ============================================================
# GET STUDENT ID FROM TOKEN
# ============================================================

def get_student_id_from_token(
    token: str,
) -> int | None:
    """
    Extract student ID from JWT 'sub'.
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
# GET ROLE FROM TOKEN
# ============================================================

def get_role_from_token(
    token: str,
) -> str | None:
    """
    Extract role from JWT.
    """

    payload = decode_access_token(token)

    if not payload:
        return None

    role = payload.get("role")

    if role is None:
        return None

    return str(role)
