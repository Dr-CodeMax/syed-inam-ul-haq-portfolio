# =====================================================
# app/services/payment_service.py
# =====================================================

from sqlalchemy.orm import Session

from fastapi import HTTPException

from datetime import datetime

import uuid

from app.models.payment import Payment
from app.models.appointment import Appointment

from app.services.payment_gateway import (
    process_payment
)

from app.services.payment_log_service import (
    log_payment_event
)


# =====================================================
# ✅ CREATE PAYMENT
# =====================================================

def create_payment(

    db: Session,

    appointment_id: int,

    amount: float,

    current_user
):

    # =================================================
    # ✅ VALIDATE APPOINTMENT
    # =================================================

    appointment = db.query(
        Appointment
    ).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:

        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    # =================================================
    # ✅ DEBUG LOGS
    # =================================================

    print(
        "👤 CURRENT USER ID:",
        current_user.id
    )

    print(
        "🩺 APPOINTMENT PATIENT ID:",
        appointment.patient_id
    )

    # =================================================
    # ✅ SECURITY CHECK
    # =================================================

    # 🔥 FIX:
    # Some databases return strings while
    # others return integers

    if str(appointment.patient_id) != str(current_user.id):

        raise HTTPException(
            status_code=403,
            detail="Unauthorized access"
        )

    # =================================================
    # ✅ BLOCK INVALID STATES
    # =================================================

    if appointment.status == "CANCELLED":

        raise HTTPException(
            status_code=400,
            detail="Cancelled appointments cannot be paid"
        )

    if appointment.status == "COMPLETED":

        raise HTTPException(
            status_code=400,
            detail="Completed appointments cannot be paid"
        )

    # =================================================
    # ✅ VALIDATE AMOUNT
    # =================================================

    if amount <= 0:

        raise HTTPException(
            status_code=400,
            detail="Invalid payment amount"
        )

    # =================================================
    # ✅ PREVENT DUPLICATE PAID PAYMENT
    # =================================================

    existing_paid = db.query(
        Payment
    ).filter(
        Payment.appointment_id == appointment_id,
        Payment.status == "PAID"
    ).first()

    if existing_paid:

        return {

            "id":
                existing_paid.id,

            "payment_id":
                existing_paid.id,

            "appointment_id":
                existing_paid.appointment_id,

            "amount":
                float(existing_paid.amount),

            "status":
                existing_paid.status,

            "provider":
                existing_paid.provider,

            "message":
                "Appointment already paid"
        }

    # =================================================
    # ✅ REUSE EXISTING PENDING PAYMENT
    # =================================================

    existing_pending = db.query(
        Payment
    ).filter(
        Payment.appointment_id == appointment_id,
        Payment.status == "PENDING"
    ).first()

    if existing_pending:

        return {

            "id":
                existing_pending.id,

            "payment_id":
                existing_pending.id,

            "appointment_id":
                existing_pending.appointment_id,

            "amount":
                float(existing_pending.amount),

            "status":
                existing_pending.status,

            "provider":
                existing_pending.provider,

            "message":
                "Payment already initiated"
        }

    # =================================================
    # ✅ CREATE PAYMENT
    # =================================================

    payment = Payment(

        appointment_id=appointment_id,

        amount=amount,

        status="PENDING",

        provider="SIMULATED",

        payment_method="SIMULATED",

        idempotency_key=str(
            uuid.uuid4()
        )
    )

    db.add(payment)

    db.commit()

    db.refresh(payment)

    # =================================================
    # ✅ LOG EVENT
    # =================================================

    try:

        log_payment_event(

            db,

            payment.id,

            "CREATED",

            "Payment initiated"
        )

    except Exception as e:

        print(
            "⚠️ PAYMENT LOG ERROR:",
            str(e)
        )

    # =================================================
    # ✅ RESPONSE
    # =================================================

    return {

        "id":
            payment.id,

        "payment_id":
            payment.id,

        "appointment_id":
            payment.appointment_id,

        "amount":
            float(payment.amount),

        "status":
            payment.status,

        "provider":
            payment.provider,

        "created_at":
            str(payment.created_at)
    }


# =====================================================
# ✅ COMPLETE PAYMENT
# =====================================================

def complete_payment(

    db: Session,

    payment_id: int
):

    # =================================================
    # ✅ GET PAYMENT
    # =================================================

    payment = db.query(
        Payment
    ).filter(
        Payment.id == payment_id
    ).first()

    if not payment:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    # =================================================
    # ✅ IDEMPOTENCY
    # =================================================

    if payment.status == "PAID":

        return {

            "message":
                "Payment already completed",

            "payment_id":
                payment.id,

            "payment_status":
                payment.status,

            "transaction_id":
                payment.transaction_id
        }

    # =================================================
    # ✅ GET APPOINTMENT
    # =================================================

    appointment = db.query(
        Appointment
    ).filter(
        Appointment.id ==
        payment.appointment_id
    ).first()

    if not appointment:

        raise HTTPException(
            status_code=404,
            detail="Linked appointment not found"
        )

    # =================================================
    # ✅ PROCESS PAYMENT
    # =================================================

    result = process_payment()

    # =================================================
    # ❌ FAILED
    # =================================================

    if result == "FAILED":

        payment.status = "FAILED"

        db.commit()

        try:

            log_payment_event(

                db,

                payment.id,

                "FAILED",

                "Payment failed"
            )

        except Exception as e:

            print(
                "⚠️ PAYMENT LOG ERROR:",
                str(e)
            )

        raise HTTPException(

            status_code=400,

            detail="Payment failed"
        )

    # =================================================
    # ✅ SUCCESS
    # =================================================

    payment.status = "PAID"

    payment.payment_method = "SIMULATED"

    payment.transaction_id = (
        f"SIM-{payment.id}"
    )

    payment.paid_at = datetime.utcnow()

    # =================================================
    # ✅ UPDATE APPOINTMENT
    # =================================================

    appointment.status = "CONFIRMED"

    db.commit()

    db.refresh(payment)

    # =================================================
    # ✅ LOG SUCCESS
    # =================================================

    try:

        log_payment_event(

            db,

            payment.id,

            "SUCCESS",

            "Payment successful"
        )

    except Exception as e:

        print(
            "⚠️ PAYMENT LOG ERROR:",
            str(e)
        )

    # =================================================
    # ✅ RESPONSE
    # =================================================

    return {

        "message":
            "Payment successful",

        "payment_id":
            payment.id,

        "appointment_id":
            payment.appointment_id,

        "transaction_id":
            payment.transaction_id,

        "payment_status":
            payment.status,

        "appointment_status":
            appointment.status,

        "paid_at":
            str(payment.paid_at)
    }


# =====================================================
# ✅ REFUND PAYMENT
# =====================================================

def refund_payment(

    db: Session,

    payment_id: int
):

    payment = db.query(
        Payment
    ).filter(
        Payment.id == payment_id
    ).first()

    if not payment:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    if payment.status != "PAID":

        raise HTTPException(
            status_code=400,
            detail="Only paid payments can be refunded"
        )

    payment.status = "REFUNDED"

    appointment = db.query(
        Appointment
    ).filter(
        Appointment.id ==
        payment.appointment_id
    ).first()

    if appointment:

        appointment.status = "CANCELLED"

    db.commit()

    db.refresh(payment)

    try:

        log_payment_event(

            db,

            payment.id,

            "REFUND",

            "Payment refunded"
        )

    except Exception as e:

        print(
            "⚠️ PAYMENT LOG ERROR:",
            str(e)
        )

    return {

        "message":
            "Refund successful",

        "payment_id":
            payment.id,

        "appointment_id":
            payment.appointment_id,

        "payment_status":
            payment.status,

        "appointment_status":
            appointment.status
            if appointment
            else None
    }