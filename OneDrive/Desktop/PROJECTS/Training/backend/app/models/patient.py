from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
)

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.db.database import Base


class Patient(Base):

    __tablename__ = "patients"

    # =========================================================
    # 🔥 PRIMARY KEY
    # =========================================================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =========================================================
    # 🔥 USER LINK
    # =========================================================
    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        unique=True,
        nullable=False
    )

    # =========================================================
    # 🔥 PATIENT INFO
    # =========================================================
    age = Column(
        Integer,
        nullable=True
    )

    gender = Column(
        String(20),
        nullable=True
    )

    blood_group = Column(
        String(10),
        nullable=True
    )

    # =========================================================
    # 🔥 NEW PROFILE FIELDS
    # =========================================================
    emergency_contact = Column(
        String(20),
        nullable=True
    )

    medical_history = Column(
        String(1000),
        nullable=True
    )

    allergies = Column(
        String(500),
        nullable=True
    )

    # =========================================================
    # 🔥 TIMESTAMPS
    # =========================================================
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    # =========================================================
    # 🔥 RELATIONSHIPS
    # =========================================================
    user = relationship(
        "User",
        back_populates="patient"
    )