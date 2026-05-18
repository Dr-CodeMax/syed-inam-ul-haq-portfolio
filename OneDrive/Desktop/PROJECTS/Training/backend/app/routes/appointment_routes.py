from datetime import datetime

from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import (
    Session,
    joinedload,
)

from app.core.dependencies import (
    get_current_user,
    require_role,
)

from app.core.socket_events import (
    appointment_created,
    appointment_cancelled,
    appointment_updated,
)

from app.db.database import get_db

from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.user import User

from app.schemas.appointment_schema import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentStatusUpdate,
)

from app.services.appointment_service import (
    create_appointment,
)

from app.services.slot_service import (
    generate_slots,
)

router = APIRouter(
    prefix="/appointment",
    tags=["Appointments"],
)


# =========================================================
# 🔥 SERIALIZER HELPER
# =========================================================
def serialize_appointment(appointment):

    return {

        "id":
            appointment.id,

        "patient_id":
            appointment.patient_id,

        "patient_name":
            appointment.patient.name,

        "doctor_id":
            appointment.doctor_id,

        "doctor_name":
            appointment.doctor.user.name,

        "doctor_specialization":
            appointment.doctor.specialization,

        "date":
            str(appointment.date),

        "time":
            str(appointment.time),

        "status":
            appointment.status,

        "priority":
            appointment.priority,

        "symptoms":
            appointment.symptoms,

        "notes":
            appointment.notes,

        "booking_position":
            getattr(
                appointment,
                "booking_position",
                1
            ),

        "slot_capacity":
            getattr(
                appointment,
                "slot_capacity",
                1
            ),

        "transferred_to":
            appointment.transferred_to,
    }


# =========================================================
# VIEW ALL APPOINTMENTS (ADMIN)
# =========================================================
@router.get(
    "/all",
    response_model=List[AppointmentResponse],
)
def get_all_appointments(

    db: Session = Depends(get_db),

    user: User = Depends(
        require_role("ADMIN")
    ),
):

    appointments = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),

            joinedload(Appointment.doctor)
            .joinedload(Doctor.user),
        )
        .order_by(
            Appointment.date.desc(),
            Appointment.time.desc(),
        )
        .all()
    )

    return [
        serialize_appointment(
            appointment
        )
        for appointment in appointments
    ]


# =========================================================
# 🔥 BOOK APPOINTMENT
# =========================================================
@router.post("/book")
async def book_appointment(

    data: AppointmentCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),
):

    try:

        appointment = await create_appointment(
            db,
            current_user.id,
            data,
        )

        if not appointment:

            raise HTTPException(
                status_code=400,
                detail="Slot fully booked",
            )

        appointment = (
            db.query(Appointment)
            .options(
                joinedload(Appointment.patient),

                joinedload(Appointment.doctor)
                .joinedload(Doctor.user),
            )
            .filter(
                Appointment.id == appointment.id
            )
            .first()
        )

        serialized = serialize_appointment(
            appointment
        )

        # =================================================
        # 🔥 REALTIME EVENT
        # =================================================
        await appointment_created(
            serialized
        )

        return {

            "message":
                "Appointment booked successfully",

            "data":
                serialized,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"\n❌ BOOK APPOINTMENT ERROR: {str(e)}"
        )

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# =========================================================
# 🔥 GET AVAILABLE SLOTS
# =========================================================
@router.get("/slots/{doctor_id}")
def get_slots(

    doctor_id: int,

    date: str,

    db: Session = Depends(get_db),
):

    try:

        # =================================================
        # ✅ VALIDATE DATE FORMAT
        # =================================================
        parsed_date = datetime.strptime(
            date,
            "%Y-%m-%d",
        ).date()

        # =================================================
        # ✅ VERIFY DOCTOR EXISTS
        # =================================================
        doctor = (
            db.query(Doctor)
            .filter(
                Doctor.id == doctor_id
            )
            .first()
        )

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found",
            )

        print(
            f"\n📅 SLOT REQUEST:"
            f"\nDoctor ID: {doctor_id}"
            f"\nDate: {parsed_date}"
        )

        # =================================================
        # ✅ GENERATE SLOTS
        # =================================================
        slots = generate_slots(
            db,
            doctor_id,
            parsed_date,
        )

        print(
            f"✅ Generated Slots: {len(slots)}"
        )

        return {

            "success": True,

            "doctor_id": doctor_id,

            "date": str(parsed_date),

            "count": len(slots),

            "slots": slots or [],
        }

    except ValueError:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid date format. "
                "Use YYYY-MM-DD"
            ),
        )

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"\n❌ SLOT FETCH ERROR: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =========================================================
# 🔥 VIEW PATIENT APPOINTMENTS
# =========================================================
@router.get(
    "/my",
    response_model=List[AppointmentResponse],
)
def get_my_appointments(

    db: Session = Depends(get_db),

    user: User = Depends(
        require_role("PATIENT")
    ),
):

    appointments = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),

            joinedload(Appointment.doctor)
            .joinedload(Doctor.user),
        )
        .filter(
            Appointment.patient_id == user.id
        )
        .order_by(
            Appointment.date.desc(),
            Appointment.time.desc(),
        )
        .all()
    )

    return [
        serialize_appointment(
            appointment
        )
        for appointment in appointments
    ]


# =========================================================
# 🔥 VIEW DOCTOR APPOINTMENTS
# =========================================================
@router.get(
    "/doctor",
    response_model=List[AppointmentResponse],
)
def get_doctor_appointments(

    db: Session = Depends(get_db),

    user: User = Depends(
        require_role("DOCTOR")
    ),
):

    doctor = (
        db.query(Doctor)
        .filter(
            Doctor.user_id == user.id
        )
        .first()
    )

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found",
        )

    appointments = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),

            joinedload(Appointment.doctor)
            .joinedload(Doctor.user),
        )
        .filter(
            Appointment.doctor_id == doctor.id
        )
        .order_by(
            Appointment.date.desc(),
            Appointment.time.desc(),
        )
        .all()
    )

    return [
        serialize_appointment(
            appointment
        )
        for appointment in appointments
    ]


# =========================================================
# 🔥 CANCEL APPOINTMENT
# =========================================================
@router.put("/cancel/{appointment_id}")
async def cancel_appointment(

    appointment_id: int,

    db: Session = Depends(get_db),

    user: User = Depends(
        get_current_user
    ),
):

    appointment = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),

            joinedload(Appointment.doctor)
            .joinedload(Doctor.user),
        )
        .filter(
            Appointment.id == appointment_id
        )
        .first()
    )

    if not appointment:

        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    # =====================================================
    # 🔥 PATIENT AUTHORIZATION
    # =====================================================
    if user.role == "PATIENT":

        if appointment.patient_id != user.id:

            raise HTTPException(
                status_code=403,
                detail="Not authorized",
            )

    # =====================================================
    # 🔥 DOCTOR AUTHORIZATION
    # =====================================================
    if user.role == "DOCTOR":

        doctor = (
            db.query(Doctor)
            .filter(
                Doctor.user_id == user.id
            )
            .first()
        )

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found",
            )

        if doctor.id != appointment.doctor_id:

            raise HTTPException(
                status_code=403,
                detail="Not authorized",
            )

    appointment.status = "CANCELLED"

    db.commit()

    db.refresh(appointment)

    serialized = serialize_appointment(
        appointment
    )

    # =====================================================
    # 🔥 REALTIME EVENT
    # =====================================================
    await appointment_cancelled(
        serialized
    )

    return {

        "message":
            "Appointment cancelled",

        "data":
            serialized,
    }


# =========================================================
# 🔥 UPDATE APPOINTMENT STATUS
# =========================================================
@router.put("/status/{appointment_id}")
async def update_appointment_status(

    appointment_id: int,

    payload: AppointmentStatusUpdate,

    db: Session = Depends(get_db),

    user: User = Depends(
        require_role("DOCTOR")
    ),
):

    appointment = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),

            joinedload(Appointment.doctor)
            .joinedload(Doctor.user),
        )
        .filter(
            Appointment.id == appointment_id
        )
        .first()
    )

    if not appointment:

        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    doctor = (
        db.query(Doctor)
        .filter(
            Doctor.user_id == user.id
        )
        .first()
    )

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor not found",
        )

    if doctor.id != appointment.doctor_id:

        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )

    appointment.status = payload.status

    db.commit()

    db.refresh(appointment)

    serialized = serialize_appointment(
        appointment
    )

    # =====================================================
    # 🔥 REALTIME EVENT
    # =====================================================
    await appointment_updated(
        serialized
    )

    return {

        "message":
            "Appointment status updated",

        "data":
            serialized,
    }


# =========================================================
# GET SINGLE APPOINTMENT
# =========================================================
@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
def get_appointment_by_id(

    appointment_id: int,

    db: Session = Depends(get_db),

    user: User = Depends(
        get_current_user
    ),
):

    appointment = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),

            joinedload(Appointment.doctor)
            .joinedload(Doctor.user),
        )
        .filter(
            Appointment.id == appointment_id
        )
        .first()
    )

    if not appointment:

        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    if user.role == "PATIENT" and appointment.patient_id != user.id:

        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )

    if user.role == "DOCTOR":

        doctor = (
            db.query(Doctor)
            .filter(
                Doctor.user_id == user.id
            )
            .first()
        )

        if not doctor or doctor.id != appointment.doctor_id:

            raise HTTPException(
                status_code=403,
                detail="Not authorized",
            )

    return serialize_appointment(
        appointment
    )


# =========================================================
# DELETE APPOINTMENT (ADMIN)
# =========================================================
@router.delete("/{appointment_id}")
async def delete_appointment(

    appointment_id: int,

    db: Session = Depends(get_db),

    user: User = Depends(
        require_role("ADMIN")
    ),
):

    appointment = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),

            joinedload(Appointment.doctor)
            .joinedload(Doctor.user),
        )
        .filter(
            Appointment.id == appointment_id
        )
        .first()
    )

    if not appointment:

        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    serialized = serialize_appointment(
        appointment
    )

    db.delete(appointment)

    db.commit()

    await appointment_cancelled(
        serialized
    )

    return {

        "success":
            True,

        "message":
            "Appointment deleted",

        "data":
            serialized,
    }
