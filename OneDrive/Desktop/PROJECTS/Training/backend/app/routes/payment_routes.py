# =====================================================
# app/routes/payment_routes.py
# =====================================================

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.db.database import get_db

from app.services.payment_service import (
    create_payment,
    complete_payment,
    refund_payment,
)

from app.core.dependencies import (
    get_current_user,
)

from app.models.user import User


# =====================================================
# ✅ ROUTER
# =====================================================

router = APIRouter(

    prefix="/payment",

    tags=["Payment"],
)


# =====================================================
# ✅ REQUEST SCHEMAS
# =====================================================

class CreatePaymentRequest(BaseModel):

    appointment_id: int

    amount: float


class CompletePaymentRequest(BaseModel):

    payment_id: int


# =====================================================
# ✅ CREATE PAYMENT
# =====================================================

@router.post("/create")
def create(

    payload: CreatePaymentRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),
):

    try:

        print(
            "💳 PAYMENT CREATE REQUEST:",
            payload.model_dump()
        )

        payment = create_payment(

            db=db,

            appointment_id=
                payload.appointment_id,

            amount=
                payload.amount,

            current_user=
                current_user,
        )

        return {

            "success": True,

            "message":
                "Payment created successfully",

            "data":
                payment,
        }

    except HTTPException as e:

        print(
            "❌ PAYMENT CREATE ERROR:",
            str(e.detail)
        )

        raise e

    except Exception as e:

        print(
            "❌ PAYMENT CREATE ERROR:",
            str(e)
        )

        raise HTTPException(

            status_code=500,

            detail=
                "Internal payment error"
        )


# =====================================================
# ✅ COMPLETE PAYMENT
# =====================================================

@router.post("/pay")
def pay(

    payload: CompletePaymentRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),
):

    try:

        print(
            "💰 COMPLETE PAYMENT REQUEST:",
            payload.model_dump()
        )

        payment = complete_payment(

            db=db,

            payment_id=
                payload.payment_id,
        )

        return {

            "success": True,

            "message":
                "Payment completed successfully",

            "data":
                payment,
        }

    except HTTPException as e:

        print(
            "❌ PAYMENT COMPLETE ERROR:",
            str(e.detail)
        )

        raise e

    except Exception as e:

        print(
            "❌ PAYMENT COMPLETE ERROR:",
            str(e)
        )

        raise HTTPException(

            status_code=500,

            detail=
                "Internal payment completion error"
        )


# =====================================================
# ✅ REFUND PAYMENT
# =====================================================

@router.post("/refund/{payment_id}")
def refund(

    payment_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    ),
):

    try:

        print(
            "💸 REFUND REQUEST:",
            payment_id
        )

        payment = refund_payment(

            db=db,

            payment_id=payment_id,
        )

        return {

            "success": True,

            "message":
                "Payment refunded successfully",

            "data":
                payment,
        }

    except HTTPException as e:

        print(
            "❌ PAYMENT REFUND ERROR:",
            str(e.detail)
        )

        raise e

    except Exception as e:

        print(
            "❌ PAYMENT REFUND ERROR:",
            str(e)
        )

        raise HTTPException(

            status_code=500,

            detail=
                "Internal refund error"
        )