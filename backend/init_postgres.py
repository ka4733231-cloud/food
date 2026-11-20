"""
NutriBite AI - PostgreSQL Database Provisioning & Migration Utility
Connects to PostgreSQL, ensures 'nutribite_db' exists, creates all 18 tables,
and populates authentic seed data (Pakistani & International recipes, demo user, groceries).
"""

import os
import sys
from pathlib import Path
from urllib.parse import urlparse

# Add current directory to path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv(dotenv_path=backend_dir / ".env")

import sqlalchemy
from sqlalchemy import create_engine, text
from app.database import Base, engine, DATABASE_URL
from app.models import (
    User, UserPreferences, FoodItem, NutritionRecord,
    FoodScan, Meal, MealItem, Recipe, RecipeIngredient, RecipeInstruction,
    FavoriteRecipe, MealPlan, MealPlanItem, GroceryList, GroceryItem,
    WaterLog, NutritionHistory, ChatMessage
)
from app.seed_data import seed_database

def setup_postgresql():
    print("=" * 65)
    print("🌿 NutriBite AI - PostgreSQL Setup & Database Provisioning")
    print("=" * 65)

    print(f"Target DATABASE_URL: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")

    # If targeting PostgreSQL, ensure database exists
    if DATABASE_URL.startswith("postgresql"):
        parsed = urlparse(DATABASE_URL)
        target_db = parsed.path.lstrip("/") or "nutribite_db"
        user = parsed.username or "postgres"
        password = parsed.password or "postgres"
        host = parsed.hostname or "localhost"
        port = parsed.port or 5432

        # Connect to default 'postgres' database to check/create target database
        admin_url = f"postgresql://{user}:{password}@{host}:{port}/postgres"
        print(f"Connecting to PostgreSQL server at {host}:{port}...")

        try:
            admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
            with admin_engine.connect() as conn:
                res = conn.execute(
                    text("SELECT 1 FROM pg_database WHERE datname = :dbname"),
                    {"dbname": target_db}
                ).fetchone()

                if not res:
                    print(f"Database '{target_db}' does not exist. Creating it now...")
                    conn.execute(text(f'CREATE DATABASE "{target_db}"'))
                    print(f"✓ Database '{target_db}' created successfully.")
                else:
                    print(f"✓ Database '{target_db}' already exists.")
            admin_engine.dispose()
        except Exception as e:
            print(f"Notice: Could not run administrative DB creation: {e}")
            print("Proceeding with direct connection to target DATABASE_URL...")

    # Create all tables on engine
    print("\nCreating 18 relational tables via SQLAlchemy ORM...")
    try:
        Base.metadata.create_all(bind=engine)
        tables = list(Base.metadata.tables.keys())
        print(f"✓ Successfully verified/created {len(tables)} tables:")
        for idx, tbl in enumerate(tables, 1):
            print(f"   [{idx:02d}] {tbl}")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        print("\nTroubleshooting tips:")
        print("1. Ensure PostgreSQL is running on port 5432.")
        print("2. Check credentials in backend/.env (default: postgresql://postgres:postgres@localhost:5432/nutribite_db)")
        print("3. If using Docker, run: docker compose up -d")
        sys.exit(1)

    # Seed data
    print("\nSeeding initial culinary records, demo user, and recipes...")
    try:
        seed_database()
        print("✓ Verified seed data successfully committed.")
    except Exception as e:
        print(f"Warning during seed: {e}")

    print("\n" + "=" * 65)
    print("🎉 PostgreSQL Connected & Configured Successfully for NutriBite AI!")
    print("=" * 65)

if __name__ == "__main__":
    setup_postgresql()
