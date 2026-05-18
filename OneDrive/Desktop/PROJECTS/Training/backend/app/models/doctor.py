# =========================================================
# ✅ FULLY UPDATED doctor.py
# ✅ FIXED SQLALCHEMY OVERLAP WARNING
# =========================================================

# =========================================================
# FILE: backend/app/models/doctor.py
# =========================================================

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DECIMAL,
    DateTime,
    Boolean,
)

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.db.database import Base


class Doctor(Base):

    __tablename__ = "doctors"

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
    # 🔥 PROFESSIONAL INFO
    # =========================================================

    specialization = Column(
        String(100),
        nullable=False
    )

    experience = Column(
        Integer,
        default=0,
        nullable=False
    )

    consultation_fee = Column(
        DECIMAL(10, 2),
        default=0,
        nullable=False
    )

    qualification = Column(
        String(255),
        nullable=False
    )

    hospital_name = Column(
        String(255),
        nullable=True
    )

    license_number = Column(
        String(100),
        nullable=False
    )

    bio = Column(
        String(1000),
        nullable=True
    )

    # =========================================================
    # 🔥 ENTERPRISE SEARCH + PROFILE
    # =========================================================

    city = Column(
        String(120),
        nullable=True
    )

    profile_image = Column(
        String(500),
        nullable=True
    )

    is_online = Column(
        Boolean,
        default=False,
        nullable=False
    )

    accepts_emergency = Column(
        Boolean,
        default=False,
        nullable=False
    )

    # =========================================================
    # 🔥 EMAIL SERVICE
    # =========================================================

    mail_email = Column(
        String(255),
        nullable=True
    )

    mail_password = Column(
        String(255),
        nullable=True
    )

    # =========================================================
    # 🔥 ENTERPRISE VERIFICATION
    # =========================================================

    is_verified = Column(
        Boolean,
        default=False,
        nullable=False
    )

    # =========================================================
    # 🔥 MODERATION WORKFLOW
    # =========================================================

    # PENDING
    # APPROVED
    # REJECTED
    # SUSPENDED

    status = Column(
        String(50),
        default="PENDING",
        nullable=False
    )

    moderation_note = Column(
        String(255),
        nullable=True
    )

    # =========================================================
    # 🔥 TIMESTAMPS
    # =========================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # =========================================================
    # 🔥 RELATIONSHIPS
    # =========================================================

    user = relationship(
        "User",
        back_populates="doctor"
    )

    appointments = relationship(
        "Appointment",
        foreign_keys="Appointment.doctor_id",
        back_populates="doctor",
        cascade="all, delete"
    )

    # =========================================================
    # ✅ FIXED WARNING HERE
    # =========================================================

    availabilities = relationship(

        "Availability",

        back_populates="doctor",

        cascade="all, delete-orphan",

        overlaps="availability"
    )

    # =========================================================
    # 🔥 SERIALIZER
    # =========================================================

    def to_dict(self):

        return {

            # =================================================
            # BASIC
            # =================================================

            "id":
                self.id,

            "user_id":
                self.user_id,

            # =================================================
            # USER INFO
            # =================================================

            "name":
                (
                    self.user.name
                    if self.user
                    else None
                ),

            "email":
                (
                    self.user.email
                    if self.user
                    else None
                ),

            "phone":
                (
                    getattr(
                        self.user,
                        "phone",
                        None
                    )
                    if self.user
                    else None
                ),

            "address":
                (
                    getattr(
                        self.user,
                        "address",
                        None
                    )
                    if self.user
                    else None
                ),

            "role":
                (
                    self.user.role
                    if self.user
                    else "DOCTOR"
                ),

            # =================================================
            # PROFESSIONAL INFO
            # =================================================

            "specialization":
                self.specialization,

            "experience":
                self.experience or 0,

            "consultation_fee":
                float(
                    self.consultation_fee or 0
                ),

            "qualification":
                self.qualification,

            "hospital_name":
                self.hospital_name,

            "license_number":
                self.license_number,

            "bio":
                self.bio,

            # =================================================
            # PROFILE
            # =================================================

            "city":
                (
                    self.city
                    or
                    (
                        getattr(
                            self.user,
                            "city",
                            None
                        )
                        if self.user
                        else None
                    )
                ),

            "profile_image":
                self.profile_image,

            "is_online":
                self.is_online,

            "accepts_emergency":
                self.accepts_emergency,

            # =================================================
            # EMAIL SERVICE
            # =================================================

            "mail_email":
                self.mail_email,

            # =================================================
            # VERIFICATION
            # =================================================

            "is_verified":
                self.is_verified,

            "status":
                self.status,

            "moderation_note":
                self.moderation_note,

            # =================================================
            # ENTERPRISE ANALYTICS
            # =================================================

            "availability_status":
                "AVAILABLE",

            "availability_badge":
                "Available Today",

            "next_available_slot":
                None,

            "today_slots":
                0,

            "booked_slots":
                0,

            "remaining_slots":
                0,

            "workload_percentage":
                0,

            "is_fully_booked":
                False,

            "active_appointments":
                len(
                    self.appointments or []
                ),

            # =================================================
            # TIMESTAMPS
            # =================================================

            "created_at":
                (
                    self.created_at.isoformat()
                    if self.created_at
                    else None
                ),

            "updated_at":
                (
                    self.updated_at.isoformat()
                    if self.updated_at
                    else None
                ),
        }