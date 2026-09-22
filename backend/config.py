# ============================================================
# PragyanAI Student Verification Platform
# File: backend/config.py
# ============================================================

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


# ============================================================
# APPLICATION SETTINGS
# ============================================================

class Settings(BaseSettings):
    """
    Application configuration.

    Values are loaded from:

    1. Environment variables
    2. .env file during local development
    3. Default values defined below

    On Render, configure these values in:
    Render → Web Service → Environment
    """

    # --------------------------------------------------------
    # APPLICATION
    # --------------------------------------------------------

    app_name: str = (
        "PragyanAI Student Verification API"
    )

    app_env: str = "production"

    # --------------------------------------------------------
    # JWT
    # --------------------------------------------------------

    secret_key: str = (
        "CHANGE_THIS_SECRET_KEY_IN_RENDER"
    )

    access_token_expire_minutes: int = 60

    # --------------------------------------------------------
    # DATABASE
    # --------------------------------------------------------

    database_url: str = ""

    # --------------------------------------------------------
    # FRONTEND
    # --------------------------------------------------------

    frontend_url: str = (
        "https://pragyanai-student-sql-email-phone.netlify.app/"
    )

    # --------------------------------------------------------
    # EMAIL / GMAIL SMTP
    # --------------------------------------------------------

    email_address: str = ""

    email_app_password: str = ""

    smtp_host: str = (
        "smtp.gmail.com"
    )

    smtp_port: int = 587

    # --------------------------------------------------------
    # OTP
    # --------------------------------------------------------

    otp_expire_minutes: int = 10

    # --------------------------------------------------------
    # TWILIO
    # --------------------------------------------------------

    twilio_account_sid: str = ""

    twilio_auth_token: str = ""

    twilio_verify_service_sid: str = ""

    # --------------------------------------------------------
    # ADMIN
    # --------------------------------------------------------

    admin_email: str = (
        "admin@pragyanai.com"
    )

    admin_password: str = (
        "12345678"
    )

    # --------------------------------------------------------
    # PYDANTIC SETTINGS CONFIGURATION
    # --------------------------------------------------------

    model_config = SettingsConfigDict(

        # Local development:
        # backend/.env

        env_file=".env",

        # Environment variable names are case-insensitive
        #
        # ADMIN_EMAIL
        # admin_email
        #
        # both can map to admin_email

        case_sensitive=False,

        # Ignore unrelated environment variables
        extra="ignore",
    )


# ============================================================
# SETTINGS SINGLETON
# ============================================================

@lru_cache
def get_settings() -> Settings:
    """
    Create and cache application settings.

    The same Settings object is reused
    throughout the application.
    """

    return Settings()


# ============================================================
# GLOBAL SETTINGS OBJECT
# ============================================================

settings = get_settings()
