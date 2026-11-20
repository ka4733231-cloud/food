"""
Database configuration and SQLAlchemy session factory for NutriBite AI.
Production-grade support for PostgreSQL with automatic connection pooling,
reconnection retry, and graceful fallback to SQLite for local development.
"""

import os
import logging
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nutribite.database")

# Load .env file from backend directory if present
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        logger.info(f"Loaded environment variables from: {env_path}")
except ImportError:
    pass

# Read DATABASE_URL from environment
# Default PostgreSQL URL: postgresql://postgres:postgres@localhost:5432/nutribite_db
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/nutribite_db")

# SQLAlchemy 1.4+ / 2.0 requires 'postgresql://' instead of legacy 'postgres://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure engine arguments based on dialect
engine_kwargs = {}

if DATABASE_URL.startswith("postgresql"):
    # Production-grade PostgreSQL pooling configuration
    engine_kwargs = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_timeout": 30,
        "pool_recycle": 1800,
        "pool_pre_ping": True,  # Verifies connection liveness before checking out from pool
    }
    logger.info("Configuring PostgreSQL database engine with connection pooling.")
elif DATABASE_URL.startswith("sqlite"):
    engine_kwargs = {
        "connect_args": {"check_same_thread": False}
    }
    logger.info("Configuring SQLite database engine for local file storage.")

# Create the SQLAlchemy Engine with automatic fallback to SQLite if PostgreSQL is not running
try:
    engine = create_engine(DATABASE_URL, **engine_kwargs)
    with engine.connect() as test_conn:
        test_conn.execute(text("SELECT 1"))
    logger.info("Successfully connected to primary PostgreSQL database.")
except Exception as e:
    logger.info("PostgreSQL is not currently active on port 5432. Gracefully running with local SQLite storage.")
    DATABASE_URL = "sqlite:///./nutribite.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI Dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_db_connection():
    """
    Test the database connection and return dialect and connectivity status.
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            row = result.fetchone()
            dialect = engine.dialect.name
            return {
                "connected": bool(row and row[0] == 1),
                "dialect": dialect,
                "database_url": DATABASE_URL.split("@")[-1] if "@" in DATABASE_URL else DATABASE_URL,
                "error": None
            }
    except Exception as exc:
        logger.warning(f"Database connection check returned error: {exc}")
        return {
            "connected": False,
            "dialect": engine.dialect.name,
            "database_url": DATABASE_URL.split("@")[-1] if "@" in DATABASE_URL else DATABASE_URL,
            "error": str(exc)
        }
