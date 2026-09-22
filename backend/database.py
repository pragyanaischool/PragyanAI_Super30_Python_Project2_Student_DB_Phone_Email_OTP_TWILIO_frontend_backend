# ============================================================
# PragyanAI Student Verification Platform
# File: backend/database.py
# ============================================================

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import (
    DeclarativeBase,
    sessionmaker,
)


# ============================================================
# DATABASE URL
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not configured."
    )


# ============================================================
# RENDER POSTGRESQL COMPATIBILITY
# ============================================================

# Render PostgreSQL may provide:
#
# postgresql://...
#
# SQLAlchemy with psycopg uses:
#
# postgresql+psycopg://...
#
# Convert automatically when required.

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
    Provides a database session for FastAPI requests.

    The session is always closed after the request,
    even when an exception occurs.
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
    Test whether the configured database is reachable.
    """

    from sqlalchemy import text

    db = SessionLocal()

    try:
        db.execute(text("SELECT 1"))

        return True

    except Exception as error:
        print(
            "Database connection test failed:",
            error,
        )

        return False

    finally:
        db.close()
