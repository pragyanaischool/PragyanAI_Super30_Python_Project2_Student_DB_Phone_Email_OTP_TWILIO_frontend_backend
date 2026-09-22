# ============================================================
# PragyanAI Student Verification Platform
# File: backend/main.py
# ============================================================

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from config import settings
from database import Base, engine

# Import models BEFORE create_all()
# so SQLAlchemy knows all registered tables.
import models

from routers import admin, auth, otp, students


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifecycle.

    On startup:
        - Creates database tables if they don't exist.

    On shutdown:
        - Application closes normally.
    """

    print("==============================================")
    print("Starting PragyanAI Student Verification API")
    print("==============================================")

    try:

        # ----------------------------------------------------
        # CREATE TABLES
        # ----------------------------------------------------

        Base.metadata.create_all(
            bind=engine
        )

        print("Database tables initialized successfully.")

    except Exception as exc:

        print(
            "WARNING: Database initialization failed:"
        )

        print(str(exc))

        # We don't immediately stop the server here.
        # /health will report the database problem.

    yield

    print("==============================================")
    print("Shutting down PragyanAI API")
    print("==============================================")


# ============================================================
# CREATE FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title=settings.app_name,
    version="2.0.0",
    description=(
        "PragyanAI Student Registration, "
        "Email OTP, Phone OTP, Student Login "
        "and Admin Approval API."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

allowed_origins = [
    # Local React/Vite development
    "http://localhost:5173",
    "http://127.0.0.1:5173", "https://pragyanai-student-sql-email-phone.netlify.app",

    # Netlify production frontend
    settings.frontend_url,
]


# Remove duplicates and empty values
allowed_origins = list(
    dict.fromkeys(
        origin
        for origin in allowed_origins
        if origin
    )
)


print(
    "Allowed CORS origins:",
    allowed_origins
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=allowed_origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# INCLUDE AUTH ROUTER
# ============================================================

app.include_router(
    auth.router,
    prefix="/api",
)


# ============================================================
# INCLUDE OTP ROUTER
# ============================================================

app.include_router(
    otp.router,
    prefix="/api",
)


# ============================================================
# INCLUDE STUDENT ROUTER
# ============================================================

app.include_router(
    students.router,
    prefix="/api",
)


# ============================================================
# INCLUDE ADMIN ROUTER
# ============================================================

app.include_router(
    admin.router,
    prefix="/api",
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    """
    API root endpoint.
    """

    return {
        "service": "PragyanAI Student Verification API",
        "status": "running",
        "version": "2.0.0",
        "environment": settings.app_env,
        "docs": "/docs",
        "health": "/health",
    }


# ============================================================
# BASIC HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    """
    Basic application health check.

    This endpoint verifies that the FastAPI
    application is running.
    """

    return {
        "status": "healthy",
        "service": "PragyanAI Student Verification API",
    }


# ============================================================
# DATABASE HEALTH CHECK
# ============================================================

@app.get("/health/database")
def database_health():
    """
    Check PostgreSQL database connectivity.

    Executes:

        SELECT 1

    against the configured database.
    """

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT 1")
            )

            result.scalar()

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as exc:

        return {
            "status": "unhealthy",
            "database": "connection_failed",
            "error": str(exc),
        }


# ============================================================
# APPLICATION INFORMATION
# ============================================================

@app.get("/api")
def api_information():
    """
    API information endpoint.
    """

    return {
        "name": "PragyanAI Student Verification API",

        "version": "2.0.0",

        "environment": settings.app_env,

        "endpoints": {
            "student_registration":
                "/api/auth/register",

            "student_login":
                "/api/auth/login",

            "student_profile":
                "/api/students/me",

            "email_otp_send":
                "/api/otp/email/send",

            "email_otp_verify":
                "/api/otp/email/verify",

            "phone_otp_send":
                "/api/otp/phone/send",

            "phone_otp_verify":
                "/api/otp/phone/verify",

            "admin_login":
                "/api/admin/login",

            "admin_students":
                "/api/admin/students",

            "admin_dashboard":
                "/api/admin/dashboard",
        },

        "documentation": "/docs",
    }


# ============================================================
# STARTUP MESSAGE
# ============================================================

print("==============================================")
print("PragyanAI API configuration loaded")
print(f"Environment: {settings.app_env}")
print(f"Frontend URL: {settings.frontend_url}")
print("API prefix: /api")
print("==============================================")
