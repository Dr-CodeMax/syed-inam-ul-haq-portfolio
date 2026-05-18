from sqlalchemy.orm import Session

from app.models.doctor import Doctor
from app.models.appointment import Appointment


# ✅ CREATE DOCTOR PROFILE
def create_doctor_profile(
    db: Session,
    user_id: int,
    data
):

    # CHECK EXISTING PROFILE
    existing_doctor = db.query(Doctor).filter(
        Doctor.user_id == user_id
    ).first()

    if existing_doctor:
        raise Exception(
            "Doctor profile already exists"
        )

    # CREATE PROFILE
    doctor = Doctor(

        user_id=user_id,

        specialization=data.specialization,

        experience=data.experience,

        # 🔥 FIXED
        consultation_fee=data.consultation_fee
    )

    db.add(doctor)

    db.commit()

    db.refresh(doctor)

    return doctor


# ✅ GET ALL DOCTORS
def get_all_doctors(db: Session):

    doctors = db.query(Doctor).all()

    return doctors


# ✅ GET SINGLE DOCTOR
def get_doctor_by_id(
    db: Session,
    doctor_id: int
):

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    return doctor


# ✅ UPDATE DOCTOR PROFILE
def update_doctor_profile(
    db: Session,
    doctor_id: int,
    data
):

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        raise Exception(
            "Doctor not found"
        )

    # UPDATE FIELDS
    if data.specialization is not None:
        doctor.specialization = data.specialization

    if data.experience is not None:
        doctor.experience = data.experience

    if data.consultation_fee is not None:
        doctor.consultation_fee = data.consultation_fee

    db.commit()

    db.refresh(doctor)

    return doctor


# ✅ DELETE DOCTOR PROFILE
def delete_doctor_profile(
    db: Session,
    doctor_id: int
):

    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        raise Exception(
            "Doctor not found"
        )

    db.delete(doctor)

    db.commit()

    return True


# ✅ TRANSFER APPOINTMENT
def transfer_appointment(

    db: Session,

    appointment_id: int,

    new_doctor_id: int,

    reason: str
):

    # FIND APPOINTMENT
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise Exception(
            "Appointment not found"
        )

    # CHECK NEW DOCTOR EXISTS
    new_doctor = db.query(Doctor).filter(
        Doctor.id == new_doctor_id
    ).first()

    if not new_doctor:
        raise Exception(
            "Target doctor not found"
        )

    # PREVENT SAME TRANSFER
    if appointment.doctor_id == new_doctor_id:
        raise Exception(
            "Appointment already assigned to this doctor"
        )

    # 🔥 TRANSFER LOGIC
    appointment.is_transferred = True

    appointment.transferred_from = appointment.doctor_id

    appointment.transferred_to = new_doctor_id

    appointment.doctor_id = new_doctor_id

    appointment.transfer_reason = reason

    db.commit()

    db.refresh(appointment)

    return appointment