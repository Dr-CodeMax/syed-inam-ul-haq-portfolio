from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os

from dotenv import load_dotenv


# ✅ LOAD ENV VARIABLES
load_dotenv()


# ✅ DATABASE URL
DATABASE_URL = os.getenv("DATABASE_URL")


# ✅ BASE MODEL
Base = declarative_base()


# ✅ PRODUCTION-SAFE ENGINE
engine = create_engine(
    DATABASE_URL,

    # ❌ DISABLE SQL SPAM LOGGING
    echo=False,

    # ✅ PREVENT STALE CONNECTIONS
    pool_pre_ping=True,

    # ✅ BETTER CONNECTION STABILITY
    pool_recycle=3600
)


# ✅ SESSION FACTORY
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ✅ DATABASE DEPENDENCY
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()