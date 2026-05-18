from pydantic import (
    BaseModel,
    EmailStr,
    Field
)

from typing import Optional
from typing import Literal


# =========================================================
# 🚀 REGISTER USER
# =========================================================

class UserCreate(BaseModel):

    name: str

    email: EmailStr

    password: str

    role: str

    city: Optional[str] = None

    # =====================================================
    # 🔥 DOCTOR EXTRA FIELDS
    # =====================================================

    specialization: Optional[str] = None

    experience: Optional[int] = 0

    consultation_fee: Optional[float] = 0

    qualification: Optional[str] = None

    hospital_name: Optional[str] = None

    license_number: Optional[str] = None

    bio: Optional[str] = None

    mail_email: Optional[EmailStr] = None

    mail_password: Optional[str] = None


# =========================================================
# 🚀 LOGIN USER
# =========================================================

class UserLogin(BaseModel):

    email: EmailStr

    password: str


# =========================================================
# 🚀 USER RESPONSE
# =========================================================

class UserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    role: str

    city: Optional[str] = None

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    role: str

    city: Optional[str] = None

    phone: Optional[str] = None

    address: Optional[str] = None

    profile_image: Optional[str] = None

    specialization: Optional[str] = None

    experience: Optional[int] = None

    consultation_fee: Optional[float] = None

    qualification: Optional[str] = None

    hospital_name: Optional[str] = None

    license_number: Optional[str] = None

    bio: Optional[str] = None

    mail_email: Optional[EmailStr] = None

    is_online: Optional[bool] = None

    accepts_emergency: Optional[bool] = None

    status: Optional[str] = None

    moderation_note: Optional[str] = None

    age: Optional[int] = None

    gender: Optional[str] = None

    blood_group: Optional[str] = None

    emergency_contact: Optional[str] = None

    medical_history: Optional[str] = None

    allergies: Optional[str] = None


class UserProfileUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    email: Optional[EmailStr] = None

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

    is_online: Optional[bool] = None

    accepts_emergency: Optional[bool] = None

    age: Optional[int] = Field(
        default=None,
        ge=0,
        le=120
    )

    gender: Optional[Literal[
        "MALE",
        "FEMALE",
        "OTHER"
    ]] = None

    blood_group: Optional[str] = Field(
        default=None,
        max_length=10
    )

    emergency_contact: Optional[str] = Field(
        default=None,
        max_length=20
    )

    medical_history: Optional[str] = Field(
        default=None,
        max_length=1000
    )

    allergies: Optional[str] = Field(
        default=None,
        max_length=500
    )


class PasswordUpdateRequest(BaseModel):

    current_password: str = Field(
        ...,
        min_length=6,
        max_length=128
    )

    new_password: str = Field(
        ...,
        min_length=6,
        max_length=128
    )


# =========================================================
# 🚀 AUTH RESPONSE
# =========================================================

class AuthResponse(BaseModel):

    message: str

    access_token: Optional[str] = None

    token_type: Optional[str] = None

    user: Optional[UserResponse] = None


# =========================================================
# ✅ ADD THIS TO app/schemas/user_schema.py
# =========================================================


# =========================================================
# ✅ UPDATED USER RESPONSE
# =========================================================

class UserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    role: str

    city: Optional[str] = None

    is_active: bool

    class Config:
        from_attributes = True


# =========================================================
# ✅ ADMIN USER UPDATE
# =========================================================

class AdminUserUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    is_active: Optional[bool] = None
