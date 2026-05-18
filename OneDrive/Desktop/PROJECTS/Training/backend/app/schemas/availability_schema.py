from pydantic import BaseModel, Field

from datetime import time, datetime


# =====================================================
# ✅ SINGLE SLOT CREATE
# =====================================================
class AvailabilityCreate(BaseModel):

    day_of_week: str = Field(
        ...,
        min_length=3,
        max_length=20
    )

    start_time: time

    end_time: time


# =====================================================
# ✅ BULK SLOT CREATE
# =====================================================
class BulkAvailabilityCreate(BaseModel):

    day_of_week: str = Field(
        ...,
        min_length=3,
        max_length=20
    )

    start_time: time

    end_time: time


# =====================================================
# ✅ RESPONSE
# =====================================================
class AvailabilityResponse(BaseModel):

    id: int

    doctor_id: int

    day_of_week: str

    start_time: time

    end_time: time

    is_active: bool

    created_at: datetime

    class Config:
        from_attributes = True