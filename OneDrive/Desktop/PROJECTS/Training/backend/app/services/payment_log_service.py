from sqlalchemy.orm import Session
from app.models.payment_log import PaymentLog


def log_payment_event(db: Session, payment_id: int, event: str, message: str):
    log = PaymentLog(
        payment_id=payment_id,
        event=event,
        message=message
    )
    db.add(log)
    db.commit()