# =========================================================
# FILE: backend/app/api/routes/doctor_routes.py
# =========================================================

from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy.orm import (
    Session,
    joinedload,
)

from sqlalchemy import or_

from typing import Optional

from app.db.database import get_db

from app.schemas.doctor_schema import (
    DoctorCreate,
    DoctorUpdate
)

from app.core.dependencies import (
    require_role
)

from app.models.user import User
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.availability import Availability

from app.services.doctor_service import (
    create_doctor_profile,
    update_doctor_profile,
    delete_doctor_profile
)

router = APIRouter(
    prefix="/doctor",
    tags=["Doctor"]
)


# =========================================================
# ✅ ENTERPRISE AVAILABILITY ENGINE
# =========================================================

def calculate_doctor_availability(
    db: Session,
    doctor_id: int,
):

    try:

        # =====================================================
        # ✅ TODAY INFO
        # =====================================================

        today = date.today()

        today_name = today.strftime(
            "%A"
        ).capitalize()

        # =====================================================
        # ✅ FETCH TODAY AVAILABILITY
        # =====================================================

        availability_list = (

            db.query(Availability)

            .filter(
                Availability.doctor_id == doctor_id,

                Availability.day_of_week == today_name,

                Availability.is_active == True,
            )

            .order_by(
                Availability.start_time.asc()
            )

            .all()
        )

        # =====================================================
        # ✅ NO AVAILABILITY
        # =====================================================

        if not availability_list:

            return {

                "availability_status":
                    "OFFLINE",

                "availability_badge":
                    "Unavailable Today",

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
                    True,

                "is_online":
                    False,
            }

        # =====================================================
        # ✅ TODAY BOOKINGS
        # =====================================================

        booked_appointments = (

            db.query(Appointment)

            .filter(
                Appointment.doctor_id == doctor_id,

                Appointment.date == today,

                Appointment.status.in_([
                    "PENDING",
                    "CONFIRMED",
                    "BOOKED",
                ])
            )

            .count()
        )

        # =====================================================
        # ✅ SLOT ENGINE
        # =====================================================

        total_capacity = 0

        next_available_slot = None

        doctor_online = False

        for availability in availability_list:

            if (
                not availability.start_time
                or
                not availability.end_time
            ):
                continue

            if availability.is_online:
                doctor_online = True

            start_minutes = (
                availability.start_time.hour * 60
                +
                availability.start_time.minute
            )

            end_minutes = (
                availability.end_time.hour * 60
                +
                availability.end_time.minute
            )

            total_minutes = max(
                end_minutes - start_minutes,
                0
            )

            slot_duration = (
                availability.slot_duration
                or 15
            )

            if slot_duration <= 0:
                slot_duration = 15

            slot_capacity = (
                availability.slot_capacity
                or 1
            )

            if slot_capacity <= 0:
                slot_capacity = 1

            buffer_time = (
                availability.buffer_time
                or 0
            )

            effective_duration = (
                slot_duration +
                buffer_time
            )

            if effective_duration <= 0:
                effective_duration = 15

            slots = (
                total_minutes //
                effective_duration
            )

            total_capacity += (
                slots *
                slot_capacity
            )

            if (
                not next_available_slot
                and
                availability.start_time
            ):

                next_available_slot = (
                    availability.start_time.strftime(
                        "%H:%M"
                    )
                )

        # =====================================================
        # ✅ REMAINING SLOTS
        # =====================================================

        remaining_slots = max(
            total_capacity -
            booked_appointments,
            0
        )

        # =====================================================
        # ✅ WORKLOAD
        # =====================================================

        workload_percentage = 0

        if total_capacity > 0:

            workload_percentage = int(

                (
                    booked_appointments
                    /
                    total_capacity
                )

                * 100
            )

        # =====================================================
        # ✅ STATUS ENGINE
        # =====================================================

        if not doctor_online:

            status = "OFFLINE"

            badge = "Doctor Offline"

        elif remaining_slots <= 0:

            status = "FULL"

            badge = "Fully Booked"

        elif workload_percentage >= 80:

            status = "LIMITED"

            badge = "Limited Availability"

        else:

            status = "AVAILABLE"

            badge = "Available Today"

        # =====================================================
        # ✅ RESPONSE
        # =====================================================

        return {

            "availability_status":
                status,

            "availability_badge":
                badge,

            "next_available_slot":
                next_available_slot,

            "today_slots":
                total_capacity,

            "booked_slots":
                booked_appointments,

            "remaining_slots":
                remaining_slots,

            "workload_percentage":
                workload_percentage,

            "is_fully_booked":
                remaining_slots <= 0,

            "is_online":
                doctor_online,
        }

    except Exception as e:

        print(
            f"\n❌ Availability Engine Error: {e}"
        )

        return {

            "availability_status":
                "OFFLINE",

            "availability_badge":
                "System Error",

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
                True,

            "is_online":
                False,
        }


# =========================================================
# ✅ CREATE DOCTOR PROFILE
# =========================================================

@router.post("/create")
def create_doctor(

    data: DoctorCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role("DOCTOR")
    )
):

    try:

        existing_doctor = db.query(Doctor).filter(
            Doctor.user_id == current_user.id
        ).first()

        if existing_doctor:

            raise HTTPException(
                status_code=400,
                detail="Doctor profile already exists"
            )

        doctor = create_doctor_profile(
            db,
            current_user.id,
            data
        )

        return {

            "success": True,

            "message":
                "Doctor profile created successfully",

            "data": {

                "doctor_id":
                    doctor.id,

                "specialization":
                    doctor.specialization,

                "experience":
                    doctor.experience or 0,

                "consultation_fee":
                    float(
                        doctor.consultation_fee or 0
                    )
            }
        }

    except HTTPException:
        raise

    except Exception as e:

        print(f"❌ CREATE DOCTOR ERROR: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# ✅ LIST ALL DOCTORS
# =========================================================

@router.get("/list")
def get_doctors(

    db: Session = Depends(get_db),

    search: Optional[str] = Query(
        default=None
    ),

    city: Optional[str] = Query(
        default=None
    ),

    specialization: Optional[str] = Query(
        default=None
    ),

    experience: Optional[int] = Query(
        default=None
    ),

    fee: Optional[float] = Query(
        default=None
    )
):

    try:

        query = (

            db.query(Doctor)

            .options(
                joinedload(Doctor.user)
            )

            .filter(
                Doctor.status == "APPROVED"
            )
        )

        # =====================================================
        # ✅ GLOBAL SEARCH
        # =====================================================

        if search:

            query = query.filter(

                or_(

                    Doctor.specialization.ilike(
                        f"%{search}%"
                    ),

                    Doctor.qualification.ilike(
                        f"%{search}%"
                    ),

                    Doctor.hospital_name.ilike(
                        f"%{search}%"
                    ),

                    Doctor.bio.ilike(
                        f"%{search}%"
                    ),

                    Doctor.user.has(
                        User.name.ilike(
                            f"%{search}%"
                        )
                    ),

                    Doctor.user.has(
                        User.city.ilike(
                            f"%{search}%"
                        )
                    ),
                )
            )

        # =====================================================
        # ✅ CITY FILTER
        # =====================================================

        if city:

            query = query.filter(

                Doctor.user.has(
                    User.city.ilike(
                        f"%{city}%"
                    )
                )
            )

        # =====================================================
        # ✅ SPECIALIZATION FILTER
        # =====================================================

        if specialization:

            query = query.filter(

                Doctor.specialization.ilike(
                    f"%{specialization}%"
                )
            )

        # =====================================================
        # ✅ EXPERIENCE FILTER
        # =====================================================

        if experience is not None:

            query = query.filter(
                Doctor.experience >= experience
            )

        # =====================================================
        # ✅ FEE FILTER
        # =====================================================

        if fee is not None:

            query = query.filter(
                Doctor.consultation_fee <= fee
            )

        doctors = query.all()

        result = []

        for doc in doctors:

            availability_data = (
                calculate_doctor_availability(
                    db,
                    doc.id
                )
            )

            result.append({

                "id":
                    doc.id,

                "user_id":
                    doc.user_id,

                "name":
                    (
                        doc.user.name
                        if doc.user
                        and doc.user.name
                        else "Doctor"
                    ),

                "email":
                    (
                        doc.user.email
                        if doc.user
                        else None
                    ),

                "city":
                    (
                        getattr(
                            doc.user,
                            "city",
                            "City Not Updated"
                        )
                        if doc.user
                        else "City Not Updated"
                    ),

                "role":
                    (
                        doc.user.role
                        if doc.user
                        else "DOCTOR"
                    ),

                "specialization":
                    doc.specialization,

                "experience":
                    doc.experience or 0,

                "consultation_fee":
                    float(
                        doc.consultation_fee or 0
                    ),

                "qualification":
                    doc.qualification,

                "hospital_name":
                    doc.hospital_name,

                "bio":
                    doc.bio,

                "profile_image":
                    getattr(
                        doc,
                        "profile_image",
                        None
                    ),

                "accepts_emergency":
                    getattr(
                        doc,
                        "accepts_emergency",
                        False
                    ),

                # =================================================
                # ✅ ENTERPRISE AVAILABILITY
                # =================================================

                "availability_status":
                    availability_data[
                        "availability_status"
                    ],

                "availability_badge":
                    availability_data[
                        "availability_badge"
                    ],

                "next_available_slot":
                    availability_data[
                        "next_available_slot"
                    ],

                "today_slots":
                    availability_data[
                        "today_slots"
                    ],

                "booked_slots":
                    availability_data[
                        "booked_slots"
                    ],

                "remaining_slots":
                    availability_data[
                        "remaining_slots"
                    ],

                "workload_percentage":
                    availability_data[
                        "workload_percentage"
                    ],

                "is_fully_booked":
                    availability_data[
                        "is_fully_booked"
                    ],

                "is_online":
                    availability_data[
                        "is_online"
                    ],

                "active_appointments":

                    availability_data[
                        "booked_slots"
                    ],

                "created_at":
                    (
                        str(doc.created_at)
                        if doc.created_at
                        else None
                    )
            })

        return {

            "success": True,

            "message":
                "Doctors fetched successfully",

            "count":
                len(result),

            "data":
                result
        }

    except Exception as e:

        print(f"❌ GET DOCTORS ERROR: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET CURRENT DOCTOR PROFILE
# =========================================================

@router.get("/me")
def get_my_doctor_profile(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role("DOCTOR")
    )
):

    doctor = (
        db.query(Doctor)
        .options(
            joinedload(Doctor.user)
        )
        .filter(
            Doctor.user_id == current_user.id
        )
        .first()
    )

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    return {

        "success": True,

        "data": {

            "id":
                doctor.id,

            "user_id":
                doctor.user_id,

            "name":
                current_user.name,

            "email":
                current_user.email,

            "city":
                current_user.city,

            "specialization":
                doctor.specialization,

            "experience":
                doctor.experience or 0,

            "consultation_fee":
                float(
                    doctor.consultation_fee or 0
                ),

            "qualification":
                doctor.qualification,

            "hospital_name":
                doctor.hospital_name,

            "bio":
                doctor.bio,

            "status":
                doctor.status,
        }
    }


# =========================================================
# GET DOCTOR PATIENTS
# =========================================================

@router.get("/patients")
def get_doctor_patients(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role("DOCTOR")
    )
):

    doctor = (
        db.query(Doctor)
        .filter(
            Doctor.user_id == current_user.id
        )
        .first()
    )

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    appointments = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient)
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

    patients_by_id = {}

    for appointment in appointments:

        patient = appointment.patient

        if not patient:
            continue

        existing = patients_by_id.get(
            patient.id
        )

        if existing:

            existing["total_appointments"] += 1

            if not existing["last_appointment"]:

                existing["last_appointment"] = str(
                    appointment.date
                )

            continue

        patients_by_id[patient.id] = {

            "id":
                patient.id,

            "name":
                patient.name,

            "email":
                patient.email,

            "phone":
                patient.phone,

            "city":
                patient.city,

            "last_appointment":
                str(appointment.date),

            "total_appointments":
                1,
        }

    return {

        "success": True,

        "count":
            len(patients_by_id),

        "data":
            list(
                patients_by_id.values()
            ),
    }


# =========================================================
# ✅ UPDATE DOCTOR PROFILE
# =========================================================

@router.put("/update/{doctor_id}")
def update_doctor(

    doctor_id: int,

    data: DoctorUpdate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role("DOCTOR")
    )
):

    try:

        doctor = db.query(Doctor).filter(
            Doctor.id == doctor_id
        ).first()

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found"
            )

        if doctor.user_id != current_user.id:

            raise HTTPException(
                status_code=403,
                detail="Unauthorized"
            )

        updated_doctor = update_doctor_profile(
            db,
            doctor_id,
            data
        )

        return {

            "success": True,

            "message":
                "Doctor updated successfully",

            "data": {

                "doctor_id":
                    updated_doctor.id
            }
        }

    except HTTPException:
        raise

    except Exception as e:

        print(f"❌ UPDATE DOCTOR ERROR: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# ✅ DELETE DOCTOR PROFILE
# =========================================================

@router.delete("/delete/{doctor_id}")
def delete_doctor(

    doctor_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role("DOCTOR")
    )
):

    try:

        doctor = db.query(Doctor).filter(
            Doctor.id == doctor_id
        ).first()

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found"
            )

        if doctor.user_id != current_user.id:

            raise HTTPException(
                status_code=403,
                detail="Unauthorized"
            )

        delete_doctor_profile(
            db,
            doctor_id
        )

        return {

            "success": True,

            "message":
                "Doctor deleted successfully"
        }

    except HTTPException:
        raise

    except Exception as e:

        print(f"❌ DELETE DOCTOR ERROR: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# ✅ DOCTOR DASHBOARD
# =========================================================

@router.get("/dashboard")
def doctor_dashboard(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role("DOCTOR")
    )
):

    try:

        doctor = db.query(Doctor).filter(
            Doctor.user_id == current_user.id
        ).first()

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor profile not found"
            )

        total_appointments = db.query(
            Appointment
        ).filter(
            Appointment.doctor_id == doctor.id
        ).count()

        completed_appointments = db.query(
            Appointment
        ).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.status == "COMPLETED"
        ).count()

        pending_appointments = db.query(
            Appointment
        ).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.status == "PENDING"
        ).count()

        cancelled_appointments = db.query(
            Appointment
        ).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.status == "CANCELLED"
        ).count()

        availability_data = (
            calculate_doctor_availability(
                db,
                doctor.id
            )
        )

        return {

            "success": True,

            "doctor_id":
                doctor.id,

            "doctor_name":
                current_user.name,

            "email":
                current_user.email,

            "city":
                getattr(
                    current_user,
                    "city",
                    None
                ),

            "specialization":
                doctor.specialization,

            "experience":
                doctor.experience or 0,

            "consultation_fee":
                float(
                    doctor.consultation_fee or 0
                ),

            "total_appointments":
                total_appointments,

            "completed_appointments":
                completed_appointments,

            "pending_appointments":
                pending_appointments,

            "cancelled_appointments":
                cancelled_appointments,

            "availability_status":
                availability_data[
                    "availability_status"
                ],

            "workload_percentage":
                availability_data[
                    "workload_percentage"
                ],

            "remaining_slots":
                availability_data[
                    "remaining_slots"
                ],

            "today_slots":
                availability_data[
                    "today_slots"
                ],

            "next_available_slot":
                availability_data[
                    "next_available_slot"
                ],
        }

    except HTTPException:
        raise

    except Exception as e:

        print(f"❌ DASHBOARD ERROR: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# ✅ GET SINGLE DOCTOR
# =========================================================

@router.get("/{doctor_id}")
def get_doctor_by_id(

    doctor_id: int,

    db: Session = Depends(get_db)
):

    try:

        doctor = (

            db.query(Doctor)

            .options(
                joinedload(Doctor.user)
            )

            .filter(
                Doctor.id == doctor_id
            )

            .first()
        )

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found"
            )

        availability_data = (
            calculate_doctor_availability(
                db,
                doctor.id
            )
        )

        return {

            "success": True,

            "message":
                "Doctor fetched successfully",

            "data": {

                "id":
                    doctor.id,

                "user_id":
                    doctor.user_id,

                "name":
                    (
                        doctor.user.name
                        if doctor.user
                        else None
                    ),

                "email":
                    (
                        doctor.user.email
                        if doctor.user
                        else None
                    ),

                "city":
                    (
                        getattr(
                            doctor.user,
                            "city",
                            None
                        )
                        if doctor.user
                        else None
                    ),

                "role":
                    (
                        doctor.user.role
                        if doctor.user
                        else None
                    ),

                "specialization":
                    doctor.specialization,

                "experience":
                    doctor.experience or 0,

                "consultation_fee":
                    float(
                        doctor.consultation_fee or 0
                    ),

                "qualification":
                    doctor.qualification,

                "hospital_name":
                    doctor.hospital_name,

                "bio":
                    doctor.bio,

                "profile_image":
                    getattr(
                        doctor,
                        "profile_image",
                        None
                    ),

                "accepts_emergency":
                    getattr(
                        doctor,
                        "accepts_emergency",
                        False
                    ),

                "availability_status":
                    availability_data[
                        "availability_status"
                    ],

                "availability_badge":
                    availability_data[
                        "availability_badge"
                    ],

                "next_available_slot":
                    availability_data[
                        "next_available_slot"
                    ],

                "today_slots":
                    availability_data[
                        "today_slots"
                    ],

                "booked_slots":
                    availability_data[
                        "booked_slots"
                    ],

                "remaining_slots":
                    availability_data[
                        "remaining_slots"
                    ],

                "workload_percentage":
                    availability_data[
                        "workload_percentage"
                    ],

                "is_fully_booked":
                    availability_data[
                        "is_fully_booked"
                    ],

                "is_online":
                    availability_data[
                        "is_online"
                    ],

                "created_at":
                    (
                        str(doctor.created_at)
                        if doctor.created_at
                        else None
                    )
            }
        }

    except HTTPException:
        raise

    except Exception as e:

        print(f"❌ GET SINGLE DOCTOR ERROR: {e}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
