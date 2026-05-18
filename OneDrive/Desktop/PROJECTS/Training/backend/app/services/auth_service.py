from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.doctor import Doctor
from app.models.patient import Patient

from app.schemas.user_schema import (
    AuthResponse,
    UserResponse
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

VALID_ROLES = [
    "PATIENT",
    "DOCTOR",
    "ADMIN"
]


# =========================================================
# 🚀 REGISTER USER
# =========================================================

def register_user(db: Session, user_data):

    email = user_data.email.lower()

    role = user_data.role.upper()

    if role not in VALID_ROLES:

        raise HTTPException(
            status_code=400,
            detail="Invalid role selected"
        )

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # =====================================================
    # ✅ CREATE USER
    # =====================================================

    new_user = User(
        name=user_data.name,
        email=email,
        city=user_data.city,
        password_hash=hash_password(
            user_data.password
        ),
        role=role
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    # =====================================================
    # ✅ PATIENT
    # =====================================================

    if role == "PATIENT":

        patient_profile = Patient(
            user_id=new_user.id
        )

        db.add(patient_profile)

        db.commit()

        access_token = create_access_token(
            data={
                "sub": str(new_user.id),
                "role": new_user.role
            }
        )

        return AuthResponse(
            message="Patient registered successfully",
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(
                new_user
            )
        )

    # =====================================================
    # ✅ DOCTOR
    # =====================================================

    elif role == "DOCTOR":

        doctor_profile = Doctor(

            user_id=new_user.id,

            specialization=user_data.specialization,

            experience=user_data.experience,

            consultation_fee=user_data.consultation_fee,

            qualification=user_data.qualification,

            hospital_name=user_data.hospital_name,

            license_number=user_data.license_number,

            bio=user_data.bio,

            mail_email=user_data.mail_email,

            mail_password=user_data.mail_password,

            status="PENDING",

            is_verified=False
        )

        db.add(doctor_profile)

        db.commit()

        return AuthResponse(
            message="Doctor registration submitted for admin approval"
        )


# =========================================================
# 🚀 LOGIN USER
# =========================================================

def login_user(
    db: Session,
    email: str,
    password: str
):

    email = email.lower()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # =====================================================
    # 🔥 DOCTOR APPROVAL CHECK
    # =====================================================

    if user.role == "DOCTOR":

        doctor = db.query(Doctor).filter(
            Doctor.user_id == user.id
        ).first()

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor profile not found"
            )

        if doctor.status != "APPROVED":

            raise HTTPException(
                status_code=403,
                detail=f"Doctor account is {doctor.status}"
            )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role
        }
    )

    return AuthResponse(
        message="Login successful",
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(
            user
        )
    )