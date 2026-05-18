# =========================================================
# FILE: backend/app/schemas/doctor_schema.py
# =========================================================

from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    ConfigDict,
)

from typing import Literal, Optional


# =========================================================
# ✅ CREATE DOCTOR PROFILE
# =========================================================
class DoctorCreate(BaseModel):

    specialization: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    experience: int = Field(
        ...,
        ge=0,
        le=60
    )

    consultation_fee: float = Field(
        ...,
        ge=0
    )

    qualification: str = Field(
        ...,
        min_length=2,
        max_length=255
    )

    hospital_name: Optional[str] = Field(
        default=None,
        max_length=255
    )

    license_number: str = Field(
        ...,
        min_length=3,
        max_length=100
    )

    bio: Optional[str] = Field(
        default=None,
        max_length=2000
    )

    mail_email: Optional[EmailStr] = None

    mail_password: Optional[str] = Field(
        default=None,
        min_length=6
    )


# =========================================================
# ✅ UPDATE DOCTOR PROFILE
# =========================================================
class DoctorUpdate(BaseModel):

    # =====================================================
    # ✅ USER INFO
    # =====================================================
    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    city: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    phone: Optional[str] = Field(
        default=None,
        min_length=8,
        max_length=20
    )

    address: Optional[str] = Field(
        default=None,
        max_length=500
    )

    profile_image: Optional[str] = None

    # =====================================================
    # ✅ DOCTOR INFO
    # =====================================================
    specialization: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    experience: Optional[int] = Field(
        default=None,
        ge=0,
        le=60
    )

    consultation_fee: Optional[float] = Field(
        default=None,
        ge=0
    )

    qualification: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=255
    )

    hospital_name: Optional[str] = Field(
        default=None,
        max_length=255
    )

    license_number: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=100
    )

    bio: Optional[str] = Field(
        default=None,
        max_length=2000
    )

    mail_email: Optional[EmailStr] = None

    mail_password: Optional[str] = Field(
        default=None,
        min_length=6
    )

    # =====================================================
    # ✅ ENTERPRISE FLAGS
    # =====================================================
    is_online: Optional[bool] = None

    accepts_emergency: Optional[bool] = None


# =========================================================
# ADMIN CREATE DOCTOR ACCOUNT
# =========================================================
class AdminDoctorCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=128
    )

    city: Optional[str] = Field(
        default=None,
        max_length=100
    )

    phone: Optional[str] = Field(
        default=None,
        max_length=20
    )

    address: Optional[str] = Field(
        default=None,
        max_length=500
    )

    profile_image: Optional[str] = Field(
        default=None,
        max_length=500
    )

    specialization: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    experience: int = Field(
        default=0,
        ge=0,
        le=60
    )

    consultation_fee: float = Field(
        default=0,
        ge=0
    )

    qualification: str = Field(
        ...,
        min_length=2,
        max_length=255
    )

    hospital_name: Optional[str] = Field(
        default=None,
        max_length=255
    )

    license_number: str = Field(
        ...,
        min_length=3,
        max_length=100
    )

    bio: Optional[str] = Field(
        default=None,
        max_length=1000
    )

    mail_email: Optional[EmailStr] = None

    mail_password: Optional[str] = Field(
        default=None,
        min_length=6,
        max_length=128
    )

    status: Literal[
        "PENDING",
        "APPROVED",
        "REJECTED",
        "SUSPENDED"
    ] = "APPROVED"

    is_online: bool = False

    accepts_emergency: bool = False

    moderation_note: Optional[str] = Field(
        default=None,
        max_length=255
    )


# =========================================================
# ADMIN UPDATE DOCTOR ACCOUNT
# =========================================================
class AdminDoctorUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    email: Optional[EmailStr] = None

    password: Optional[str] = Field(
        default=None,
        min_length=6,
        max_length=128
    )

    city: Optional[str] = Field(
        default=None,
        max_length=100
    )

    phone: Optional[str] = Field(
        default=None,
        max_length=20
    )

    address: Optional[str] = Field(
        default=None,
        max_length=500
    )

    profile_image: Optional[str] = Field(
        default=None,
        max_length=500
    )

    specialization: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    experience: Optional[int] = Field(
        default=None,
        ge=0,
        le=60
    )

    consultation_fee: Optional[float] = Field(
        default=None,
        ge=0
    )

    qualification: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=255
    )

    hospital_name: Optional[str] = Field(
        default=None,
        max_length=255
    )

    license_number: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=100
    )

    bio: Optional[str] = Field(
        default=None,
        max_length=1000
    )

    mail_email: Optional[EmailStr] = None

    mail_password: Optional[str] = Field(
        default=None,
        min_length=6,
        max_length=128
    )

    status: Optional[
        Literal[
            "PENDING",
            "APPROVED",
            "REJECTED",
            "SUSPENDED"
        ]
    ] = None

    is_online: Optional[bool] = None

    accepts_emergency: Optional[bool] = None

    moderation_note: Optional[str] = Field(
        default=None,
        max_length=255
    )


# =========================================================
# ✅ RESPONSE
# =========================================================
class DoctorResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    # =====================================================
    # ✅ IDS
    # =====================================================
    id: int

    user_id: int

    # =====================================================
    # ✅ USER INFO
    # =====================================================
    name: Optional[str]

    email: Optional[str]

    city: Optional[str]

    phone: Optional[str]

    address: Optional[str]

    profile_image: Optional[str]

    # =====================================================
    # ✅ DOCTOR INFO
    # =====================================================
    specialization: str

    experience: int

    consultation_fee: float

    qualification: str

    hospital_name: Optional[str]

    license_number: str

    bio: Optional[str]

    mail_email: Optional[str]

    # =====================================================
    # ✅ STATUS
    # =====================================================
    status: str

    is_verified: bool

    is_online: Optional[bool]

    accepts_emergency: Optional[bool]

    # =====================================================
    # ✅ ANALYTICS
    # =====================================================
    availability_status: Optional[str] = None

    workload_percentage: Optional[float] = 0

    total_slots: Optional[int] = 0

    booked_slots: Optional[int] = 0

    remaining_slots: Optional[int] = 0
