# ============================================================
# PragyanAI Student Verification Platform
# File: backend/database.py
# ============================================================

import os

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker


# ============================================================
# DATABASE URL
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not configured."
    )

# Remove accidental whitespace
DATABASE_URL = DATABASE_URL.strip()

# Remove accidental surrounding quotes
if (
    len(DATABASE_URL) >= 2
    and DATABASE_URL[0] == '"'
    and DATABASE_URL[-1] == '"'
):
    DATABASE_URL = DATABASE_URL[1:-1].strip()

if (
    len(DATABASE_URL) >= 2
    and DATABASE_URL[0] == "'"
    and DATABASE_URL[-1] == "'"
):
    DATABASE_URL = DATABASE_URL[1:-1].strip()


# ============================================================
# POSTGRESQL URL NORMALIZATION
# ============================================================

if DATABASE_URL.startswith("postgres://"):

    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql+psycopg://",
        1,
    )

elif DATABASE_URL.startswith("postgresql://"):

    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1,
    )


# ============================================================
# SAFE DATABASE CONFIGURATION LOG
# ============================================================

try:

    # Never print the password.
    if "://" in DATABASE_URL:

        scheme, remainder = DATABASE_URL.split(
            "://",
            1,
        )

        if "@" in remainder:

            credentials, host_part = remainder.split(
                "@",
                1,
            )

            if ":" in credentials:

                username = credentials.split(
                    ":",
                    1,
                )[0]

                print(
                    "Database configuration detected: "
                    f"{scheme}://{username}:****@{host_part}"
                )

            else:

                print(
                    "Database configuration detected: "
                    f"{scheme}://****@{host_part}"
                )

        else:

            print(
                "Database configuration detected: "
                f"{scheme}://****"
            )

    else:

        print(
            "Database configuration detected: "
            "Invalid DATABASE_URL format"
        )

except Exception:

    print(
        "Database configuration detected: "
        "Unable to display configuration safely"
    )


# ============================================================
# SQLALCHEMY ENGINE
# ============================================================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)


# ============================================================
# SESSION FACTORY
# ============================================================

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# ============================================================
# BASE MODEL
# ============================================================

class Base(DeclarativeBase):
    pass


# ============================================================
# DATABASE SESSION DEPENDENCY
# ============================================================

def get_db():
    """
    Provide a SQLAlchemy database session.

    The session is automatically closed after
    the request completes.
    """

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# ============================================================
# DATABASE CONNECTION TEST
# ============================================================

def test_database_connection():
    """
    Test the PostgreSQL database connection.
    """

    db = SessionLocal()

    try:

        db.execute(
            text("SELECT 1")
        )

        return True

    except Exception as error:

        print(
            "Database connection test failed:",
            error,
        )

        return False

    finally:

        db.close()
