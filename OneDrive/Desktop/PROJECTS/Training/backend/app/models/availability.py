from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    Time,
    Boolean,
    DateTime,
)

from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.db.database import Base


class Availability(Base):

    __tablename__ = "availability"

    # =====================================================
    # ✅ PRIMARY KEY
    # =====================================================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================================
    # ✅ DOCTOR RELATION
    # =====================================================
    doctor_id = Column(
        Integer,
        ForeignKey(
            "doctors.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True,
    )

    # =====================================================
    # ✅ WEEKDAY
    # =====================================================
    day_of_week = Column(
        String(20),
        nullable=False,
        index=True,
    )

    # =====================================================
    # ✅ SHIFT START TIME
    # =====================================================
    start_time = Column(
        Time,
        nullable=False
    )

    # =====================================================
    # ✅ SHIFT END TIME
    # =====================================================
    end_time = Column(
        Time,
        nullable=False
    )

    # =====================================================
    # ✅ SLOT DURATION (MINUTES)
    # =====================================================
    slot_duration = Column(
        Integer,
        default=15,
        nullable=False
    )

    # =====================================================
    # ✅ MAX PATIENTS PER SLOT
    # =====================================================
    slot_capacity = Column(
        Integer,
        default=1,
        nullable=False
    )

    # =====================================================
    # ✅ BUFFER BETWEEN SLOTS (MINUTES)
    # =====================================================
    buffer_time = Column(
        Integer,
        default=0,
        nullable=False
    )

    # =====================================================
    # ✅ ONLINE CONSULTATION SUPPORT
    # =====================================================
    is_online = Column(
        Boolean,
        default=True,
        nullable=False
    )

    # =====================================================
    # ✅ ACTIVE SCHEDULE
    # =====================================================
    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    # =====================================================
    # ✅ EMERGENCY SUPPORT
    # =====================================================
    accepts_emergency = Column(
        Boolean,
        default=False,
        nullable=False
    )

    # =====================================================
    # ✅ CREATED TIME
    # =====================================================
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # =====================================================
    # ✅ UPDATED TIME
    # =====================================================
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # =====================================================
    # ✅ RELATIONSHIP
    # =====================================================
    doctor = relationship(
        "Doctor",
        back_populates="availabilities",
        overlaps="availability"
    )

    # =====================================================
    # ✅ NORMALIZE DAY NAME
    # =====================================================
    @staticmethod
    def normalize_day(day: str):

        return (
            day.strip()
            .capitalize()
        )

    # =====================================================
    # ✅ SERIALIZER
    # =====================================================
    def to_dict(self):

        return {

            "id":
                self.id,

            "doctor_id":
                self.doctor_id,

            "day_of_week":
                self.day_of_week,

            "start_time":
                (
                    self.start_time.strftime("%H:%M")
                    if self.start_time
                    else None
                ),

            "end_time":
                (
                    self.end_time.strftime("%H:%M")
                    if self.end_time
                    else None
                ),

            "slot_duration":
                self.slot_duration,

            "slot_capacity":
                self.slot_capacity,

            "buffer_time":
                self.buffer_time,

            "is_online":
                self.is_online,

            "is_active":
                self.is_active,

            "accepts_emergency":
                self.accepts_emergency,

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