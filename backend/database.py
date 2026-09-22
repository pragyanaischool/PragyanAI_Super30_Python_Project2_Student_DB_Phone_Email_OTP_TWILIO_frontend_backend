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
# GET DATABASE URL
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")


if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not configured. "
        "Please add DATABASE_URL in Render → Web Service → Environment."
    )


# ============================================================
# CLEAN DATABASE URL
# ============================================================

DATABASE_URL = DATABASE_URL.strip()


# ============================================================
# CONVERT RENDER POSTGRESQL URL
# ============================================================
#
# Render may provide:
#
# postgres://username:password@host/database
#
# or:
#
# postgresql://username:password@host/database
#
# SQLAlchemy + psycopg should use:
#
# postgresql+psycopg://username:password@host/database
#
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
# CREATE DATABASE ENGINE
# ============================================================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)


# ============================================================
# SESSION LOCAL
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ============================================================
# SQLALCHEMY BASE
# ============================================================

Base = declarative_base()


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    """
    Creates a database session for a FastAPI request.

    The session is automatically closed after
    the request completes.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
