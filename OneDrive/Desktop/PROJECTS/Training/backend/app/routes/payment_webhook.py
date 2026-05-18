from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.payment import Payment

# ❌ REMOVED prefix
router = APIRouter(tags=["Webhook"])


@router.post("/payment")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    payment_id = data.get("payment_id")
    status = data.get("status")

    if not payment_id or not status:
        raise HTTPException(status_code=400, detail="Invalid webhook payload")

    payment = db.query(Payment).filter(
        Payment.id == payment_id
    ).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment.status = status
    db.commit()

    return {
        "message": "Webhook processed",
        "payment_id": payment_id,
        "status": status
    }