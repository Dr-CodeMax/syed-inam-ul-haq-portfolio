from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Date,
    Time,
    String,
    Text,
    Boolean,
    DateTime,
)

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.db.database import Base


class Appointment(Base):

    __tablename__ = "appointments"

    # =========================================================
    # 🔥 PRIMARY KEY
    # =========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =========================================================
    # 🔥 FOREIGN KEYS
    # =========================================================

    patient_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=False
    )

    # =========================================================
    # 🔥 APPOINTMENT DETAILS
    # =========================================================

    date = Column(
        Date,
        nullable=False,
        index=True,
    )

    time = Column(
        Time,
        nullable=False,
        index=True,
    )

    # =========================================================
    # 🔥 SLOT MANAGEMENT
    # =========================================================

    slot_end_time = Column(
        Time,
        nullable=True
    )

    slot_capacity = Column(
        Integer,
        default=1
    )

    booking_position = Column(
        Integer,
        default=1
    )

    # =========================================================
    # 🔥 STATUS
    # =========================================================

    status = Column(
        String(20),
        default="PENDING",
        index=True,
    )

    # =========================================================
    # 🔥 PRIORITY
    # =========================================================

    priority = Column(
        String(20),
        default="NORMAL"
    )

    priority_score = Column(
        Integer,
        default=0
    )

    # =========================================================
    # 🔥 MEDICAL DETAILS
    # =========================================================

    symptoms = Column(
        Text,
        nullable=True
    )

    notes = Column(
        Text,
        nullable=True
    )

    # =========================================================
    # 🔥 REAL-TIME WORKFLOW
    # =========================================================

    is_completed = Column(
        Boolean,
        default=False
    )

    is_checked_in = Column(
        Boolean,
        default=False
    )

    # =========================================================
    # 🔥 TRANSFER SYSTEM
    # =========================================================

    is_transferred = Column(
        Boolean,
        default=False
    )

    transferred_from = Column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=True
    )

    transferred_to = Column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=True
    )

    transfer_reason = Column(
        Text,
        nullable=True
    )

    # =========================================================
    # 🔥 AUDIT
    # =========================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # =========================================================
    # 🔥 RELATIONSHIPS
    # =========================================================

    # ✅ FIXED OVERLAP WARNING
    patient = relationship(
        "User",
        foreign_keys=[patient_id],
        overlaps="appointments"
    )

    doctor = relationship(
        "Doctor",
        foreign_keys=[doctor_id],
        back_populates="appointments"
    )

    transferred_from_doctor = relationship(
        "Doctor",
        foreign_keys=[transferred_from]
    )

    transferred_to_doctor = relationship(
        "Doctor",
        foreign_keys=[transferred_to]
    )