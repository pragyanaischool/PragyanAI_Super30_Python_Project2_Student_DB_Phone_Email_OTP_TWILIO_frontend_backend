# ============================================================
# PragyanAI Student Verification Platform
# File: backend/models.py
# ============================================================

from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    Integer,
    String,
    Text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from database import Base


# ============================================================
# STUDENT MODEL
# ============================================================

class Student(Base):

    __tablename__ = "students"

    # ========================================================
    # PRIMARY KEY
    # ========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    # ========================================================
    # PERSONAL INFORMATION
    # ========================================================

    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    college_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    # ========================================================
    # ACADEMIC INFORMATION
    # ========================================================

    degree: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    branch: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    tenth_cgpa: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    twelfth_cgpa: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    be_cgpa: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # ========================================================
    # CONTACT INFORMATION
    # ========================================================

    phone: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        unique=True,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    # ========================================================
    # AUTHENTICATION
    # ========================================================

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # ========================================================
    # VERIFICATION
    # ========================================================

    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    phone_verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # ========================================================
    # ADMIN APPROVAL
    # ========================================================

    approval_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="PENDING",
        index=True,
    )

    rejection_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ========================================================
    # TIMESTAMPS
    # ========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ========================================================
    # REPRESENTATION
    # ========================================================

    def __repr__(self) -> str:

        return (
            f"<Student "
            f"id={self.id!r} "
            f"email={self.email!r} "
            f"approval_status={self.approval_status!r}>"
        )
        
