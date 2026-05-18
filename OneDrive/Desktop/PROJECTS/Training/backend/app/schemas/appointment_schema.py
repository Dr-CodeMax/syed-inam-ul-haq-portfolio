from pydantic import BaseModel
from datetime import date, time
from typing import Optional, Literal


# =========================================================
# 🔥 CREATE REQUEST
# =========================================================
class AppointmentCreate(BaseModel):

    doctor_id: int
    date: date
    time: time

    symptoms: Optional[str] = None

    priority: Optional[
        Literal[
            "LOW",
            "NORMAL",
            "HIGH",
            "EMERGENCY"
        ]
    ] = "NORMAL"


# =========================================================
# 🔥 STATUS UPDATE
# =========================================================
class AppointmentStatusUpdate(BaseModel):

    status: Literal[
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED"
    ]


# =========================================================
# 🔥 ENRICHED RESPONSE
# =========================================================
class AppointmentResponse(BaseModel):

    id: int

    patient_id: int
    patient_name: str

    doctor_id: int
    doctor_name: str
    doctor_specialization: Optional[str]

    date: date
    time: time

    status: str
    priority: str

    symptoms: Optional[str]
    notes: Optional[str]

    transferred_to: Optional[int]

    class Config:
        from_attributes = True