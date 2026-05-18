# =========================================================
# ✅ admin_routes.py
# =========================================================

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import (
    Session,
    joinedload
)

from sqlalchemy import func

from app.db.database import get_db

from app.schemas.user_schema import AdminUserUpdate

from app.models.user import User

from app.models.doctor import Doctor

from app.models.appointment import Appointment

from app.models.payment import Payment

from app.core.dependencies import get_current_user

from app.core.security import hash_password

from app.schemas.doctor_schema import (
    AdminDoctorCreate,
    AdminDoctorUpdate,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


def serialize_admin_appointment(appointment):

    return {

        "id":
            appointment.id,

        "patient_id":
            appointment.patient_id,

        "patient_name":
            (
                appointment.patient.name
                if appointment.patient
                else "Patient"
            ),

        "doctor_id":
            appointment.doctor_id,

        "doctor_name":
            (
                appointment.doctor.user.name
                if appointment.doctor
                and appointment.doctor.user
                else "Doctor"
            ),

        "doctor_specialization":
            (
                appointment.doctor.specialization
                if appointment.doctor
                else "General"
            ),

        "date":
            str(appointment.date),

        "time":
            appointment.time.strftime("%H:%M"),

        "status":
            appointment.status,

        "priority":
            appointment.priority,

        "symptoms":
            appointment.symptoms,

        "notes":
            appointment.notes,
    }


def serialize_admin_doctor(doctor: Doctor):

    data = doctor.to_dict()

    data["appointments_count"] = len(
        doctor.appointments or []
    )

    data["appointmentsCount"] = data[
        "appointments_count"
    ]

    data["profileImage"] = data[
        "profile_image"
    ]

    data["consultationFee"] = data[
        "consultation_fee"
    ]

    return data


def get_admin_doctor_or_404(
    db: Session,
    doctor_id: int
):

    doctor = (
        db.query(Doctor)
        .options(
            joinedload(Doctor.user),
            joinedload(Doctor.appointments),
        )
        .filter(Doctor.id == doctor_id)
        .first()
    )

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    return doctor


# =========================================================
# ✅ ADMIN ACCESS CHECK
# =========================================================

def verify_admin(user: User):

    if user.role != "ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return True


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    total_patients = (
        db.query(User)
        .filter(User.role == "PATIENT")
        .count()
    )

    total_doctors = db.query(Doctor).count()

    total_appointments = db.query(Appointment).count()

    paid_revenue = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0
            )
        )
        .filter(Payment.status == "PAID")
        .scalar()
    )

    return {
        "success": True,
        "totalPatients": total_patients,
        "totalDoctors": total_doctors,
        "totalAppointments": total_appointments,
        "revenue": f"₹{float(paid_revenue):,.2f}",
    }


# =========================================================
# ✅ GET ALL USERS
# =========================================================

@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    users = db.query(User).all()

    return {
        "success": True,
        "count": len(users),
        "data": users
    }

# =========================================================
# ✅ UPDATE USER
# =========================================================

@router.put("/users/{user_id}")
def update_user_by_admin(
    user_id: int,
    payload: AdminUserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # =====================================================
    # ✅ VERIFY ADMIN
    # =====================================================

    verify_admin(current_user)

    # =====================================================
    # ✅ FIND USER
    # =====================================================

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # =====================================================
    # 🚫 BLOCK ADMIN MODIFICATION
    # =====================================================

    if user.role == "ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Admin users cannot be modified"
        )

    # =====================================================
    # ✅ UPDATE USER DATA
    # =====================================================

    update_data = payload.model_dump(
        exclude_unset=True
    )

    if "name" in update_data:

        user.name = update_data["name"]

    if "is_active" in update_data:

        user.is_active = (
            update_data["is_active"]
        )

    # =====================================================
    # ✅ SAVE CHANGES
    # =====================================================

    db.commit()

    db.refresh(user)

    # =====================================================
    # ✅ RESPONSE
    # =====================================================

    return {

        "success": True,

        "message":
            "User updated successfully",

        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        }
    }



# =========================================================
# GET ALL PATIENTS
# =========================================================

@router.get("/patients")
def get_all_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    patients = (
        db.query(User)
        .filter(User.role == "PATIENT")
        .all()
    )

    return {
        "success": True,
        "count": len(patients),
        "data": [
            {
                "id": patient.id,
                "name": patient.name,
                "email": patient.email,
                "role": patient.role,
                "city": patient.city,
                "phone": patient.phone,
                "profile_image": patient.profile_image,
                "address": patient.address,
            }
            for patient in patients
        ]
    }


# =========================================================
# ✅ GET ALL DOCTORS
# =========================================================

@router.get("/doctors")
def get_all_doctors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    doctors = (

        db.query(Doctor)

        .options(
            joinedload(Doctor.user),
            joinedload(Doctor.appointments),
        )

        .order_by(Doctor.created_at.desc())

        .all()
    )

    return {

        "success": True,

        "count":
            len(doctors),

        "data":
            [
                serialize_admin_doctor(doctor)
                for doctor in doctors
            ]
    }

    result = []

    for doctor in doctors:

        status = (
            doctor.status.upper()
            if doctor.status
            else "PENDING"
        )

        result.append({

            # =================================================
            # ✅ BASIC INFO
            # =================================================

            "id":
                doctor.id,

            "user_id":
                doctor.user_id,

            "name":
                (
                    doctor.user.name
                    if doctor.user
                    and doctor.user.name
                    else "N/A"
                ),

            "email":
                (
                    doctor.user.email
                    if doctor.user
                    else "N/A"
                ),

            "role":
                (
                    doctor.user.role
                    if doctor.user
                    else "DOCTOR"
                ),

            # =================================================
            # ✅ PROFESSIONAL INFO
            # =================================================

            "specialization":
                doctor.specialization,

            "experience":
                doctor.experience or 0,

            "consultation_fee":
                float(
                    doctor.consultation_fee or 0
                ),

            # =================================================
            # ✅ VERIFICATION SYSTEM
            # =================================================

            "is_verified":
                doctor.is_verified,

            "verification_status":
                (
                    "VERIFIED"
                    if doctor.is_verified
                    else "PENDING"
                ),

            # =================================================
            # ✅ MODERATION SYSTEM
            # =================================================

            "status":
                status,

            "moderation":
                status,

            "moderation_note":
                doctor.moderation_note,

            # =================================================
            # ✅ TIMESTAMPS
            # =================================================

            "created_at":
                doctor.created_at,

            "updated_at":
                doctor.updated_at,
        })

    return {

        "success": True,

        "count":
            len(result),

        "data":
            result
    }


# =========================================================
# ✅ GET ALL APPOINTMENTS
# =========================================================


# =========================================================
# CREATE DOCTOR ACCOUNT
# =========================================================

@router.post("/doctors")
def create_admin_doctor(
    payload: AdminDoctorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    email = payload.email.lower()

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    try:

        user = User(
            name=payload.name,
            email=email,
            password_hash=hash_password(
                payload.password
            ),
            role="DOCTOR",
            city=payload.city,
            phone=payload.phone,
            address=payload.address,
            profile_image=payload.profile_image,
        )

        db.add(user)

        db.flush()

        doctor = Doctor(
            user_id=user.id,
            specialization=payload.specialization,
            experience=payload.experience,
            consultation_fee=payload.consultation_fee,
            qualification=payload.qualification,
            hospital_name=payload.hospital_name,
            license_number=payload.license_number,
            bio=payload.bio,
            city=payload.city,
            profile_image=payload.profile_image,
            mail_email=payload.mail_email,
            mail_password=payload.mail_password,
            status=payload.status,
            is_verified=payload.status == "APPROVED",
            is_online=payload.is_online,
            accepts_emergency=payload.accepts_emergency,
            moderation_note=payload.moderation_note,
        )

        db.add(doctor)

        db.commit()

        db.refresh(doctor)

        doctor = get_admin_doctor_or_404(
            db,
            doctor.id
        )

        return {
            "success": True,
            "message": "Doctor created successfully",
            "data": serialize_admin_doctor(doctor),
        }

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET SINGLE DOCTOR
# =========================================================

@router.get("/doctors/{doctor_id}")
def get_admin_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    doctor = get_admin_doctor_or_404(
        db,
        doctor_id
    )

    return {
        "success": True,
        "data": serialize_admin_doctor(doctor),
    }


# =========================================================
# UPDATE DOCTOR ACCOUNT
# =========================================================

@router.put("/doctors/{doctor_id}")
def update_admin_doctor(
    doctor_id: int,
    payload: AdminDoctorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    doctor = get_admin_doctor_or_404(
        db,
        doctor_id
    )

    user = doctor.user

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Doctor user account not found"
        )

    update_data = payload.model_dump(
        exclude_unset=True
    )

    if "email" in update_data:

        email = update_data["email"].lower()

        existing_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != user.id,
            )
            .first()
        )

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        user.email = email

    if "password" in update_data:
        user.password_hash = hash_password(
            update_data["password"]
        )

    for field in [
        "name",
        "city",
        "phone",
        "address",
        "profile_image",
    ]:

        if field in update_data:
            setattr(user, field, update_data[field])

    for field in [
        "specialization",
        "experience",
        "consultation_fee",
        "qualification",
        "hospital_name",
        "license_number",
        "bio",
        "city",
        "profile_image",
        "mail_email",
        "mail_password",
        "status",
        "is_online",
        "accepts_emergency",
        "moderation_note",
    ]:

        if field in update_data:
            setattr(doctor, field, update_data[field])

    if "status" in update_data:
        doctor.is_verified = (
            update_data["status"] == "APPROVED"
        )

    db.commit()

    doctor = get_admin_doctor_or_404(
        db,
        doctor_id
    )

    return {
        "success": True,
        "message": "Doctor updated successfully",
        "data": serialize_admin_doctor(doctor),
    }


# =========================================================
# DELETE DOCTOR ACCOUNT
# =========================================================

@router.delete("/doctors/{doctor_id}")
def delete_admin_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    doctor = get_admin_doctor_or_404(
        db,
        doctor_id
    )

    user = doctor.user

    db.delete(doctor)

    if user:
        db.delete(user)

    db.commit()

    return {
        "success": True,
        "message": "Doctor deleted successfully",
        "doctor_id": doctor_id,
    }


# =========================================================
# GET ALL APPOINTMENTS
# =========================================================

@router.get("/appointments")
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

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

    return {
        "success": True,
        "count": len(appointments),
        "data": [
            serialize_admin_appointment(
                appointment
            )
            for appointment in appointments
        ]
    }


# =========================================================
# 🔥 APPROVE DOCTOR
# =========================================================

@router.put("/doctor/{doctor_id}/approve")
def approve_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    doctor.status = "APPROVED"

    doctor.is_verified = True

    db.commit()

    db.refresh(doctor)

    return {

        "success": True,

        "message":
            "Doctor approved successfully",

        "doctor_id":
            doctor.id,

        "status":
            doctor.status,

        "is_verified":
            doctor.is_verified
    }


# =========================================================
# 🔥 REJECT DOCTOR
# =========================================================

@router.put("/doctor/{doctor_id}/reject")
def reject_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    doctor.status = "REJECTED"

    doctor.is_verified = False

    db.commit()

    db.refresh(doctor)

    return {

        "success": True,

        "message":
            "Doctor rejected successfully",

        "doctor_id":
            doctor.id,

        "status":
            doctor.status,

        "is_verified":
            doctor.is_verified
    }


# =========================================================
# 🔥 SUSPEND DOCTOR
# =========================================================

@router.put("/doctor/{doctor_id}/suspend")
def suspend_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    doctor.status = "SUSPENDED"

    db.commit()

    db.refresh(doctor)

    return {

        "success": True,

        "message":
            "Doctor suspended successfully",

        "doctor_id":
            doctor.id,

        "status":
            doctor.status
    }


# =========================================================
# 🔥 REACTIVATE DOCTOR
# =========================================================

@router.put("/doctor/{doctor_id}/reactivate")
def reactivate_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    verify_admin(current_user)

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:

        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    doctor.status = "APPROVED"

    doctor.is_verified = True

    db.commit()

    db.refresh(doctor)

    return {

        "success": True,

        "message":
            "Doctor reactivated successfully",

        "doctor_id":
            doctor.id,

        "status":
            doctor.status,

        "is_verified":
            doctor.is_verified
    }
