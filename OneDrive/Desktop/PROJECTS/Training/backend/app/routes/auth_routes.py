from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.user_schema import (
    PasswordUpdateRequest,
    UserCreate,
    UserLogin,
    UserProfileUpdate,
)

from app.services.auth_service import (
    login_user,
    register_user
)

from app.core.dependencies import (
    get_current_user,
    require_role
)

from app.core.security import (
    hash_password,
    verify_password,
)

from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def serialize_current_user(
    current_user: User,
    doctor: Doctor = None,
    patient: Patient = None,
):

    data = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "city": current_user.city,
        "phone": current_user.phone,
        "address": current_user.address,
        "profile_image": current_user.profile_image,
    }

    if doctor:

        data.update({
            "specialization": doctor.specialization,
            "experience": doctor.experience,
            "consultation_fee": float(
                doctor.consultation_fee or 0
            ),
            "qualification": doctor.qualification,
            "hospital_name": doctor.hospital_name,
            "license_number": doctor.license_number,
            "bio": doctor.bio,
            "mail_email": doctor.mail_email,
            "is_online": doctor.is_online,
            "accepts_emergency": doctor.accepts_emergency,
            "status": doctor.status,
            "moderation_note": doctor.moderation_note,
        })

    if patient:

        data.update({
            "age": patient.age,
            "gender": patient.gender,
            "blood_group": patient.blood_group,
            "emergency_contact": patient.emergency_contact,
            "medical_history": patient.medical_history,
            "allergies": patient.allergies,
        })

    return data


def get_doctor_profile(
    db: Session,
    user_id: int,
):

    return (
        db.query(Doctor)
        .filter(Doctor.user_id == user_id)
        .first()
    )


def get_patient_profile(
    db: Session,
    user_id: int,
):

    return (
        db.query(Patient)
        .filter(Patient.user_id == user_id)
        .first()
    )


@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    return register_user(db, user)


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    return login_user(
        db,
        user.email,
        user.password
    )


@router.post("/logout")
def logout():

    return {
        "success": True,
        "message": "Logout successful"
    }


@router.get("/me")
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    doctor = None
    patient = None

    if current_user.role == "DOCTOR":

        doctor = get_doctor_profile(
            db,
            current_user.id
        )

    if current_user.role == "PATIENT":

        patient = get_patient_profile(
            db,
            current_user.id
        )

    return serialize_current_user(
        current_user,
        doctor,
        patient,
    )


@router.put("/me")
def update_profile(
    payload: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    update_data = payload.model_dump(
        exclude_unset=True
    )

    if "email" in update_data:

        email = update_data["email"].lower()

        existing_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != current_user.id,
            )
            .first()
        )

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        current_user.email = email

    for field in [
        "name",
        "city",
        "phone",
        "address",
        "profile_image",
    ]:

        if field in update_data:
            setattr(
                current_user,
                field,
                update_data[field]
            )

    doctor = None
    patient = None

    if current_user.role == "DOCTOR":

        doctor = get_doctor_profile(
            db,
            current_user.id
        )

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor profile not found"
            )

        for field in [
            "city",
            "profile_image",
            "specialization",
            "experience",
            "consultation_fee",
            "qualification",
            "hospital_name",
            "license_number",
            "bio",
            "mail_email",
            "mail_password",
            "is_online",
            "accepts_emergency",
        ]:

            if field in update_data:
                setattr(
                    doctor,
                    field,
                    update_data[field]
                )

    if current_user.role == "PATIENT":

        patient = get_patient_profile(
            db,
            current_user.id
        )

        if not patient:

            raise HTTPException(
                status_code=404,
                detail="Patient profile not found"
            )

        for field in [
            "age",
            "gender",
            "blood_group",
            "emergency_contact",
            "medical_history",
            "allergies",
        ]:

            if field in update_data:
                setattr(
                    patient,
                    field,
                    update_data[field]
                )

    db.commit()

    db.refresh(current_user)

    if doctor:
        db.refresh(doctor)

    if patient:
        db.refresh(patient)

    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": serialize_current_user(
            current_user,
            doctor,
            patient,
        ),
    }


@router.put("/me/password")
def update_password(
    payload: PasswordUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    if not verify_password(
        payload.current_password,
        current_user.password_hash
    ):

        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    if payload.current_password == payload.new_password:

        raise HTTPException(
            status_code=400,
            detail="New password must be different"
        )

    current_user.password_hash = hash_password(
        payload.new_password
    )

    db.commit()

    return {
        "success": True,
        "message": "Password updated successfully",
    }


@router.get("/doctor-only")
def doctor_only_route(
    current_user: User = Depends(
        require_role("DOCTOR")
    )
):

    return {
        "message":
            f"Welcome Doctor {current_user.name}"
    }


@router.get("/admin-only")
def admin_only_route(
    current_user: User = Depends(
        require_role("ADMIN")
    )
):

    return {
        "message":
            f"Welcome Admin {current_user.name}"
    }
# =====================================================
# FILE: backend/app/routes/auth_routes.py
# =====================================================


# =====================================================
# UPDATE CURRENT USER PROFILE
# =====================================================

@router.put("/me")
def update_me(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    allowed_fields = [

        "name",

        "phone",

        "city",

        "address",

        "gender",

        "bio",
    ]

    for field in allowed_fields:

        if field in payload:

            setattr(
                current_user,
                field,
                payload[field]
            )

    db.commit()

    db.refresh(current_user)

    return {
        "success": True,
        "message":
            "Profile updated successfully",
        "user": {
            "id":
                current_user.id,

            "name":
                current_user.name,

            "email":
                current_user.email,

            "phone":
                current_user.phone,

            "city":
                current_user.city,

            "address":
                current_user.address,

            "gender":
                current_user.gender,

            "bio":
                current_user.bio,

            "role":
                current_user.role,
        },
    }