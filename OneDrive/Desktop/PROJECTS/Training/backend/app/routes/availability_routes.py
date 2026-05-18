from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from typing import List

from datetime import date

from app.db.database import get_db

from app.schemas.availability_schema import (
    AvailabilityCreate,
    AvailabilityResponse,
    BulkAvailabilityCreate
)

from app.services.availability_service import (
    create_availability,
    bulk_create_availability
)

from app.services.slot_service import (
    generate_slots
)

from app.core.dependencies import (
    require_role
)

from app.models.doctor import Doctor
from app.models.user import User
from app.models.availability import Availability

router = APIRouter(
    prefix="/availability",
    tags=["Availability"]
)


# =====================================================
# ✅ NORMALIZE DAY
# =====================================================
def normalize_day(day: str):

    return day.strip().capitalize()


# =====================================================
# ✅ CREATE SINGLE SLOT
# =====================================================
@router.post(
    "/create",
    response_model=AvailabilityResponse
)
def create_slot(

    data: AvailabilityCreate,

    db: Session = Depends(get_db),

    user: User = Depends(
        require_role("DOCTOR")
    )
):

    try:

        # ✅ FETCH AUTHENTICATED DOCTOR
        doctor = db.query(Doctor).filter(
            Doctor.user_id == user.id
        ).first()

        if not doctor:
            raise HTTPException(
                status_code=400,
                detail="Doctor profile not found"
            )

        # =================================================
        # ✅ NORMALIZE DAY
        # =================================================
        data.day_of_week = normalize_day(
            data.day_of_week
        )

        # =================================================
        # ✅ CREATE AVAILABILITY
        # =================================================
        availability = create_availability(
            db,
            doctor.id,
            data
        )

        return availability

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# =====================================================
# ✅ BULK CREATE SLOTS
# =====================================================
@router.post(
    "/bulk-create",
    response_model=List[AvailabilityResponse]
)
def bulk_create_slots(

    data: List[BulkAvailabilityCreate],

    db: Session = Depends(get_db),

    user: User = Depends(
        require_role("DOCTOR")
    )
):

    try:

        # ✅ FETCH AUTHENTICATED DOCTOR
        doctor = db.query(Doctor).filter(
            Doctor.user_id == user.id
        ).first()

        if not doctor:
            raise HTTPException(
                status_code=400,
                detail="Doctor profile not found"
            )

        # =================================================
        # ✅ NORMALIZE ALL DAYS
        # =================================================
        for item in data:

            item.day_of_week = normalize_day(
                item.day_of_week
            )

        # =================================================
        # ✅ CREATE AVAILABILITY
        # =================================================
        created_slots = bulk_create_availability(
            db,
            doctor.id,
            data
        )

        return created_slots

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# =====================================================
# ✅ GET DOCTOR AVAILABILITY
# =====================================================
@router.get(
    "/{doctor_id}",
    response_model=List[AvailabilityResponse]
)
def get_availability(

    doctor_id: int,

    db: Session = Depends(get_db)
):

    # =================================================
    # ✅ VERIFY DOCTOR EXISTS
    # =================================================
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    # =================================================
    # ✅ FETCH ACTIVE AVAILABILITY
    # =================================================
    slots = db.query(Availability).filter(
        Availability.doctor_id == doctor_id,
        Availability.is_active == True
    ).order_by(
        Availability.day_of_week,
        Availability.start_time
    ).all()

    # =================================================
    # ✅ DEBUG LOGS
    # =================================================
    print(
        f"\n📅 Availability fetched for doctor {doctor_id}"
    )

    for slot in slots:

        print({
            "id": slot.id,
            "doctor_id": slot.doctor_id,
            "day_of_week": slot.day_of_week,
            "start_time": str(slot.start_time),
            "end_time": str(slot.end_time),
            "slot_duration": slot.slot_duration,
            "slot_capacity": slot.slot_capacity,
            "buffer_time": slot.buffer_time,
            "is_active": slot.is_active,
        })

    return slots


# =====================================================
# ✅ GENERATE AVAILABLE APPOINTMENT SLOTS
# =====================================================
@router.get(
    "/{doctor_id}/slots"
)
def get_generated_slots(

    doctor_id: int,

    selected_date: date,

    db: Session = Depends(get_db)
):

    # =================================================
    # ✅ VERIFY DOCTOR EXISTS
    # =================================================
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    # =================================================
    # ✅ GENERATE SLOTS
    # =================================================
    slots = generate_slots(
        db,
        doctor_id,
        selected_date
    )

    return {
        "doctor_id": doctor_id,
        "date": selected_date,
        "total_slots": len(slots),
        "slots": slots
    }