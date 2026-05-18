from sqlalchemy import Column, Integer, ForeignKey, String, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from app.db.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    appointment_id = Column(
        Integer,
        ForeignKey("appointments.id"),
        nullable=False,
        index=True
    )

    amount = Column(
        DECIMAL(10, 2),
        nullable=False
    )

    status = Column(
        String(20),
        default="PENDING",
        index=True
    )
    # PENDING / PAID / FAILED / REFUNDED

    payment_method = Column(String(50), nullable=True)
    transaction_id = Column(String(255), nullable=True)

    # 🔥 ADVANCED FIELDS
    provider = Column(
        String(50),
        nullable=True
    )  # razorpay / stripe / simulated

    idempotency_key = Column(
        String(255),
        unique=True,
        nullable=True,
        index=True
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    paid_at = Column(
        TIMESTAMP,
        nullable=True
    )