# =========================================================
# ✅ FIX app/models/user.py
# =========================================================

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
)

from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):

    __tablename__ = "users"

    # =========================================================
    # 🔥 PRIMARY KEY
    # =========================================================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =========================================================
    # 🔥 BASIC INFO
    # =========================================================
    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        index=True,
        nullable=False
    )

    city = Column(
        String(100),
        nullable=True
    )

    # =========================================================
    # 🔥 PROFILE
    # =========================================================
    phone = Column(
        String(20),
        nullable=True
    )

    profile_image = Column(
        String(500),
        nullable=True
    )

    address = Column(
        String(500),
        nullable=True
    )

    # =========================================================
    # ✅ IMPORTANT FIX
    # =========================================================
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        server_default="1"
    )

    # =========================================================
    # 🔥 RELATIONSHIPS
    # =========================================================

    doctor = relationship(
        "Doctor",
        back_populates="user",
        uselist=False
    )

    patient = relationship(
        "Patient",
        back_populates="user",
        uselist=False
    )

    appointments = relationship(
        "Appointment",
        foreign_keys="Appointment.patient_id"
    )