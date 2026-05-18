from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.availability import Availability


# =====================================================
# ✅ VALID WEEKDAYS
# =====================================================
VALID_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]


# =====================================================
# ✅ NORMALIZE DAY
# =====================================================
def normalize_day(day: str):

    return day.strip().capitalize()


# =====================================================
# ✅ CHECK SLOT OVERLAP
# =====================================================
def validate_slot_overlap(

    db: Session,

    doctor_id: int,

    day_of_week: str,

    start_time,

    end_time
):

    existing_slots = db.query(
        Availability
    ).filter(
        Availability.doctor_id == doctor_id,
        Availability.day_of_week == day_of_week,
        Availability.is_active == True
    ).all()

    for slot in existing_slots:

        # =============================================
        # ✅ OVERLAP DETECTION
        # =============================================
        overlap = (

            start_time < slot.end_time
            and
            end_time > slot.start_time
        )

        if overlap:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Time slot overlaps with "
                    "existing availability"
                )
            )


# =====================================================
# ✅ VALIDATE SLOT DATA
# =====================================================
def validate_slot_data(data):

    # =============================================
    # ✅ START/END VALIDATION
    # =============================================
    if data.start_time >= data.end_time:

        raise HTTPException(
            status_code=400,
            detail=(
                "Start time must be "
                "before end time"
            )
        )

    # =============================================
    # ✅ SLOT DURATION
    # =============================================
    if hasattr(data, "slot_duration"):

        if data.slot_duration <= 0:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Slot duration must "
                    "be greater than 0"
                )
            )

    # =============================================
    # ✅ SLOT CAPACITY
    # =============================================
    if hasattr(data, "slot_capacity"):

        if data.slot_capacity <= 0:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Slot capacity must "
                    "be greater than 0"
                )
            )

    # =============================================
    # ✅ BUFFER TIME
    # =============================================
    if hasattr(data, "buffer_time"):

        if data.buffer_time < 0:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Buffer time cannot "
                    "be negative"
                )
            )


# =====================================================
# ✅ CREATE SINGLE AVAILABILITY
# =====================================================
def create_availability(

    db: Session,

    doctor_id: int,

    data
):

    # =============================================
    # ✅ NORMALIZE DAY
    # =============================================
    day = normalize_day(
        data.day_of_week
    )

    # =============================================
    # ✅ VALIDATE DAY
    # =============================================
    if day not in VALID_DAYS:

        raise HTTPException(
            status_code=400,
            detail="Invalid day of week"
        )

    # =============================================
    # ✅ VALIDATE SLOT DATA
    # =============================================
    validate_slot_data(data)

    # =============================================
    # ✅ CHECK OVERLAP
    # =============================================
    validate_slot_overlap(
        db,
        doctor_id,
        day,
        data.start_time,
        data.end_time
    )

    # =============================================
    # ✅ CREATE SLOT
    # =============================================
    availability = Availability(

        doctor_id=doctor_id,

        day_of_week=day,

        start_time=data.start_time,

        end_time=data.end_time,

        slot_duration=getattr(
            data,
            "slot_duration",
            15
        ),

        slot_capacity=getattr(
            data,
            "slot_capacity",
            1
        ),

        buffer_time=getattr(
            data,
            "buffer_time",
            0
        ),

        is_online=getattr(
            data,
            "is_online",
            True
        ),

        accepts_emergency=getattr(
            data,
            "accepts_emergency",
            False
        ),

        is_active=True
    )

    db.add(availability)

    db.commit()

    db.refresh(availability)

    return availability


# =====================================================
# ✅ BULK CREATE AVAILABILITY
# =====================================================
def bulk_create_availability(

    db: Session,

    doctor_id: int,

    availability_list
):

    created_slots = []

    for item in availability_list:

        # =========================================
        # ✅ NORMALIZE DAY
        # =========================================
        day = normalize_day(
            item.day_of_week
        )

        # =========================================
        # ✅ VALIDATE DAY
        # =========================================
        if day not in VALID_DAYS:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Invalid day: {day}"
                )
            )

        # =========================================
        # ✅ VALIDATE SLOT DATA
        # =========================================
        validate_slot_data(item)

        # =========================================
        # ✅ CHECK OVERLAP
        # =========================================
        validate_slot_overlap(
            db,
            doctor_id,
            day,
            item.start_time,
            item.end_time
        )

        # =========================================
        # ✅ CREATE SLOT
        # =========================================
        availability = Availability(

            doctor_id=doctor_id,

            day_of_week=day,

            start_time=item.start_time,

            end_time=item.end_time,

            slot_duration=getattr(
                item,
                "slot_duration",
                15
            ),

            slot_capacity=getattr(
                item,
                "slot_capacity",
                1
            ),

            buffer_time=getattr(
                item,
                "buffer_time",
                0
            ),

            is_online=getattr(
                item,
                "is_online",
                True
            ),

            accepts_emergency=getattr(
                item,
                "accepts_emergency",
                False
            ),

            is_active=True
        )

        db.add(availability)

        created_slots.append(
            availability
        )

    db.commit()

    for slot in created_slots:
        db.refresh(slot)

    return created_slots