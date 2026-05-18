from sqlalchemy import Column, Integer, String, TIMESTAMP
from datetime import datetime
from app.db.database import Base


class PaymentLog(Base):
    __tablename__ = "payment_logs"

    id = Column(Integer, primary_key=True, index=True)

    payment_id = Column(Integer)
    event = Column(String(50))
    message = Column(String(255))

    created_at = Column(TIMESTAMP, default=datetime.utcnow)