# backend/database.py

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# READ DATABASE URL
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")


if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is missing.\n"
        "Go to Render → Web Service → Environment Variables "
        "and add DATABASE_URL."
    )


# ============================================================
# CLEAN DATABASE URL
# ============================================================

DATABASE_URL = DATABASE_URL.strip()


# Remove accidental surrounding quotes
if (
    len(DATABASE_URL) >= 2
    and DATABASE_URL[0] == DATABASE_URL[-1]
    and DATABASE_URL[0] in ("'", '"')
):
    DATABASE_URL = DATABASE_URL[1:-1].strip()


# Remove accidental psql command prefix
if DATABASE_URL.startswith("psql "):

    DATABASE_URL = DATABASE_URL[5:].strip()

    if (
        len(DATABASE_URL) >= 2
        and DATABASE_URL[0] == DATABASE_URL[-1]
        and DATABASE_URL[0] in ("'", '"')
    ):
        DATABASE_URL = DATABASE_URL[1:-1].strip()


# ============================================================
# NORMALIZE POSTGRESQL SCHEME
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

elif DATABASE_URL.startswith("postgresql+psycopg://"):

    # Already correct
    pass

else:

    raise RuntimeError(
        "Invalid DATABASE_URL format.\n\n"
        "Expected something like:\n"
        "postgresql://username:password@hostname/database\n\n"
        "Please copy the Internal Database URL directly "
        "from your Render PostgreSQL database."
    )


# ============================================================
# BASIC VALIDATION
# ============================================================

if "@" not in DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL appears to be malformed: "
        "database host separator '@' is missing."
    )


if "/" not in DATABASE_URL.split("@", 1)[-1]:
    raise RuntimeError(
        "DATABASE_URL appears to be malformed: "
        "database name is missing."
    )


# ============================================================
# SAFE STARTUP INFORMATION
# ============================================================
#
# This does NOT print the password.
#
# Example:
#
# postgresql+psycopg://username:****@hostname/database
#
# ============================================================

try:

    scheme_and_rest = DATABASE_URL.split("://", 1)

    scheme = scheme_and_rest[0]

    connection_part = scheme_and_rest[1]

    credentials, host_database = connection_part.split("@", 1)

    if ":" in credentials:

        username = credentials.split(":", 1)[0]

    else:

        username = credentials

    print(
        f"Database configuration detected: "
        f"{scheme}://{username}:****@{host_database}"
    )

except Exception:

    raise RuntimeError(
        "DATABASE_URL is present but appears to be malformed. "
        "Copy the Internal Database URL directly from Render."
    )


# ============================================================
# CREATE SQLALCHEMY ENGINE
# ============================================================

try:

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
    )

except Exception as exc:

    raise RuntimeError(
        "SQLAlchemy could not parse DATABASE_URL.\n\n"
        "Make sure Render DATABASE_URL contains only the "
        "PostgreSQL connection URL.\n\n"
        "Example:\n"
        "postgresql://username:password@hostname/database\n\n"
        f"Original error: {exc}"
    ) from exc


# ============================================================
# SESSION FACTORY
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ============================================================
# BASE CLASS
# ============================================================

Base = declarative_base()


# ============================================================
# FASTAPI DATABASE DEPENDENCY
# ============================================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()
        
