# =========================================================
# 🔥 IMPORT ALL MODELS FIRST
# =========================================================

import app.models


from sqlalchemy.orm import Session

from passlib.context import CryptContext

from app.db.database import SessionLocal

from app.models.user import User


# =========================================================
# 🔥 PASSWORD HASHER
# =========================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================================
# 🔥 ADMIN CONFIG
# =========================================================

ADMIN_NAME = "Super Admin"

ADMIN_EMAIL = "admin@medbook.com"

ADMIN_PASSWORD = "Admin@123"

ADMIN_ROLE = "ADMIN"

ADMIN_CITY = "Head Office"


# =========================================================
# 🔥 CREATE ADMIN
# =========================================================

def create_admin():

    db: Session = SessionLocal()

    try:

        # =================================================
        # CHECK EXISTING ADMIN
        # =================================================

        existing_admin = db.query(User).filter(
            User.email == ADMIN_EMAIL
        ).first()

        if existing_admin:

            print(
                "\n⚠️ Admin already exists.\n"
            )

            return


        # =================================================
        # HASH PASSWORD
        # =================================================

        hashed_password = pwd_context.hash(
            ADMIN_PASSWORD
        )


        # =================================================
        # CREATE ADMIN USER
        # =================================================

        admin_user = User(

            name=ADMIN_NAME,

            email=ADMIN_EMAIL,

            password_hash=hashed_password,

            role=ADMIN_ROLE,

            city=ADMIN_CITY

        )


        # =================================================
        # SAVE TO DATABASE
        # =================================================

        db.add(admin_user)

        db.commit()

        db.refresh(admin_user)


        # =================================================
        # SUCCESS OUTPUT
        # =================================================

        print(
            "\n✅ SUPER ADMIN CREATED SUCCESSFULLY\n"
        )

        print(
            f"📧 Email: {ADMIN_EMAIL}"
        )

        print(
            f"🔑 Password: {ADMIN_PASSWORD}"
        )

        print(
            f"🛡 Role: {ADMIN_ROLE}\n"
        )


    except Exception as e:

        print(
            f"\n❌ ERROR: {str(e)}\n"
        )

    finally:

        db.close()


# =========================================================
# 🔥 RUN SCRIPT
# =========================================================

if __name__ == "__main__":

    create_admin()