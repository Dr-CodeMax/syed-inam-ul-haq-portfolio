from sqlalchemy.orm import Session
from datetime import date as dt_date
from app.models.appointment import Appointment
from app.models.availability import Availability
from app.core.socket_manager import manager
from app.services.priority_service import calculate_priority


async def create_appointment(db: Session, patient_id: int, data):

    # 🔥 STEP 0: PREVENT PAST BOOKINGS
    if data.date < dt_date.today():
        raise Exception("Cannot book past dates")

    # 🔥 STEP 1: CHECK AVAILABILITY
    day = data.date.strftime("%A").upper()

    availability = db.query(Availability).filter(
        Availability.doctor_id == data.doctor_id,
        Availability.day_of_week == day
    ).all()

    valid = False

    for slot in availability:
        if slot.start_time <= data.time < slot.end_time:
            valid = True
            break

    if not valid:
        raise Exception("Doctor not available at this time")

    # 🔥 STEP 2: PREVENT DOUBLE BOOKING (FIXED)
    existing = db.query(Appointment).filter(
        Appointment.doctor_id == data.doctor_id,
        Appointment.date == data.date,
        Appointment.time == data.time,
        Appointment.status.in_(["PENDING", "BOOKED", "CONFIRMED"])  # ✅ FIX
    ).first()

    if existing:
        return None

    # 🔥 STEP 3: PRIORITY AUTO CALCULATION
    priority, score = calculate_priority(data.symptoms)

    # 🔥 STEP 4: CREATE APPOINTMENT
    appointment = Appointment(
        patient_id=patient_id,  # ✅ CRITICAL
        doctor_id=data.doctor_id,
        date=data.date,
        time=data.time,
        status="PENDING",
        symptoms=data.symptoms,
        priority=priority,
        priority_score=score
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    # 🔥 STEP 5: REALTIME BROADCAST
    await manager.broadcast({
        "type": "SLOT_BOOKED",
        "doctor_id": appointment.doctor_id,
        "date": str(appointment.date),
        "time": str(appointment.time)
    })

    return appointment