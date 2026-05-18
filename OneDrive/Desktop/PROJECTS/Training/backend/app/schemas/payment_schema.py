from pydantic import BaseModel


class PaymentCreate(BaseModel):
    appointment_id: int
    amount: float


class PaymentResponse(BaseModel):
    id: int
    appointment_id: int
    amount: float
    status: str

    class Config:
        from_attributes = True