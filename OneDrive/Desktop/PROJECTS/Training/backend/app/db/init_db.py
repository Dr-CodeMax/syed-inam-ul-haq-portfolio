from app.db.database import engine, Base
from app.db.database import Base  # 🔥 loads all models (important)

# (optional but safe to keep explicit imports)
from app.models.user import User
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.availability import Availability
from app.models.patient import Patient


def init_db():
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")