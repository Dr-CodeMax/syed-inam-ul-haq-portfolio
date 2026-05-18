from datetime import date

from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import (
    Session,
    joinedload,
)

from app.core.dependencies import require_role
from app.db.database import get_db
from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.user import User


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/patient")
def patient_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("PATIENT")
    ),
):

    today = date.today()

    appointment_count = (
        db.query(Appointment)
        .filter(
            Appointment.patient_id == current_user.id,
            Appointment.date >= today,
            Appointment.status.in_([
                "PENDING",
                "CONFIRMED",
                "BOOKED",
            ]),
        )
        .count()
    )

    upcoming = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.doctor)
            .joinedload(Doctor.user)
        )
        .filter(
            Appointment.patient_id == current_user.id,
            Appointment.date >= today,
            Appointment.status.in_([
                "PENDING",
                "CONFIRMED",
                "BOOKED",
            ]),
        )
        .order_by(
            Appointment.date.asc(),
            Appointment.time.asc(),
        )
        .limit(5)
        .all()
    )

    return {
        "success": True,
        "appointmentCount": appointment_count,
        "reportCount": 0,
        "favoriteDoctors": 0,
        "healthScore": "0%",
        "upcomingAppointments": [
            {
                "id": appointment.id,
                "doctorName": (
                    appointment.doctor.user.name
                    if appointment.doctor
                    and appointment.doctor.user
                    else "Doctor"
                ),
                "specialization": (
                    appointment.doctor.specialization
                    if appointment.doctor
                    else "General"
                ),
                "date": str(appointment.date),
                "time": appointment.time.strftime("%H:%M"),
                "status": appointment.status,
            }
            for appointment in upcoming
        ],
    }
