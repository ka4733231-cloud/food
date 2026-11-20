"""
SQLAlchemy ORM Data Models for NutriBite AI.
Implements the complete relational schema: Users, Food Items, Nutrition Records,
Scans, Meals, Recipes, Meal Plans, Grocery Lists, Water Logs, and Chat.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar = Column(String(50), default="👨‍🍳")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    preferences = relationship("UserPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
    scans = relationship("FoodScan", back_populates="user", cascade="all, delete-orphan")
    meals = relationship("Meal", back_populates="user", cascade="all, delete-orphan")
    favorite_recipes = relationship("FavoriteRecipe", back_populates="user", cascade="all, delete-orphan")
    meal_plans = relationship("MealPlan", back_populates="user", cascade="all, delete-orphan")
    grocery_lists = relationship("GroceryList", back_populates="user", cascade="all, delete-orphan")
    water_logs = relationship("WaterLog", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("UserSubscription", back_populates="user", uselist=False, cascade="all, delete-orphan")
    daily_usages = relationship("DailyUsageQuota", back_populates="user", cascade="all, delete-orphan")
    invoices = relationship("BillingInvoiceRecord", back_populates="user", cascade="all, delete-orphan")


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    goal = Column(String(60), default="Maintain Weight")  # Weight Loss, Maintain, Muscle Gain
    daily_calorie_target = Column(Float, default=2000.0)
    protein_target_g = Column(Float, default=120.0)
    carbs_target_g = Column(Float, default=220.0)
    fat_target_g = Column(Float, default=65.0)
    fiber_target_g = Column(Float, default=30.0)
    water_target_ml = Column(Float, default=2500.0)
    dietary_preferences = Column(Text, default="Balanced")  # JSON or comma-separated: Keto, Vegetarian, Halal, etc.
    food_allergies = Column(Text, default="")  # Peanuts, Dairy, Gluten, etc.
    cuisine_preferences = Column(Text, default="International, Pakistani")

    user = relationship("User", back_populates="preferences")


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(180), index=True, nullable=False)
    category = Column(String(100), default="General")
    cuisine = Column(String(100), default="International")
    serving_unit = Column(String(60), default="100g")
    standard_weight_grams = Column(Float, default=100.0)
    is_custom = Column(Boolean, default=False)
    fdc_id = Column(String(60), nullable=True)  # USDA FoodData Central ID

    nutrition = relationship("NutritionRecord", back_populates="food_item", uselist=False, cascade="all, delete-orphan")


class NutritionRecord(Base):
    __tablename__ = "nutrition_records"

    id = Column(Integer, primary_key=True, index=True)
    food_item_id = Column(Integer, ForeignKey("food_items.id", ondelete="CASCADE"), nullable=False, unique=True)
    calories = Column(Float, nullable=False, default=0.0)
    protein = Column(Float, nullable=False, default=0.0)
    carbohydrates = Column(Float, nullable=False, default=0.0)
    total_fat = Column(Float, nullable=False, default=0.0)
    fiber = Column(Float, default=0.0)
    sugar = Column(Float, default=0.0)
    sodium_mg = Column(Float, default=0.0)

    food_item = relationship("FoodItem", back_populates="nutrition")


class FoodScan(Base):
    __tablename__ = "food_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    image_url = Column(String(500), nullable=True)
    predicted_food_name = Column(String(180), nullable=False)
    confidence_score = Column(Float, nullable=False)
    detected_items = Column(Text, nullable=True)  # JSON-encoded array of detected items
    estimated_portion_grams = Column(Float, default=200.0)
    scanned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scans")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    meal_type = Column(String(50), nullable=False)  # Breakfast, Lunch, Dinner, Snack
    logged_at = Column(DateTime, default=datetime.utcnow)
    total_calories = Column(Float, default=0.0)
    total_protein = Column(Float, default=0.0)
    total_carbs = Column(Float, default=0.0)
    total_fat = Column(Float, default=0.0)
    total_fiber = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="meals")
    items = relationship("MealItem", back_populates="meal", cascade="all, delete-orphan")


class MealItem(Base):
    __tablename__ = "meal_items"

    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id", ondelete="CASCADE"), nullable=False)
    food_name = Column(String(180), nullable=False)
    portion_grams = Column(Float, nullable=False, default=100.0)
    calories = Column(Float, nullable=False)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    fiber = Column(Float, default=0.0)

    meal = relationship("Meal", back_populates="items")


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(60), default="Dinner")
    cuisine = Column(String(60), default="International")
    image_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    prep_time_minutes = Column(Integer, default=15)
    cook_time_minutes = Column(Integer, default=25)
    servings = Column(Integer, default=4)
    difficulty = Column(String(30), default="Medium")  # Easy, Medium, Hard
    calories_per_serving = Column(Float, default=350.0)
    protein_per_serving = Column(Float, default=20.0)
    carbs_per_serving = Column(Float, default=40.0)
    fat_per_serving = Column(Float, default=12.0)
    rating = Column(Float, default=4.8)
    created_at = Column(DateTime, default=datetime.utcnow)

    ingredients = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")
    instructions = relationship("RecipeInstruction", back_populates="recipe", cascade="all, delete-orphan")


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(140), nullable=False)
    quantity = Column(Float, nullable=False, default=1.0)
    unit = Column(String(40), default="serving")
    category = Column(String(60), default="Other")  # Produce, Meat, Dairy, Spices, Grains

    recipe = relationship("Recipe", back_populates="ingredients")


class RecipeInstruction(Base):
    __tablename__ = "recipe_instructions"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)
    instruction = Column(Text, nullable=False)

    recipe = relationship("Recipe", back_populates="instructions")


class FavoriteRecipe(Base):
    __tablename__ = "favorite_recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favorite_recipes")
    recipe = relationship("Recipe")


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(120), default="Weekly Balance")
    start_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="meal_plans")
    items = relationship("MealPlanItem", back_populates="meal_plan", cascade="all, delete-orphan")


class MealPlanItem(Base):
    __tablename__ = "meal_plan_items"

    id = Column(Integer, primary_key=True, index=True)
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(String(20), nullable=False)  # Monday - Sunday
    meal_type = Column(String(30), nullable=False)    # Breakfast, Lunch, Dinner, Snack
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=True)
    custom_meal_name = Column(String(180), nullable=True)
    calories = Column(Float, default=300.0)

    meal_plan = relationship("MealPlan", back_populates="items")
    recipe = relationship("Recipe")


class GroceryList(Base):
    __tablename__ = "grocery_lists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(120), default="Weekly Market List")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="grocery_lists")
    items = relationship("GroceryItem", back_populates="grocery_list", cascade="all, delete-orphan")


class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    grocery_list_id = Column(Integer, ForeignKey("grocery_lists.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(160), nullable=False)
    quantity = Column(String(60), default="1")
    category = Column(String(60), default="Other")  # Fruits, Vegetables, Dairy, Meat, Grains, Spices, Other
    is_checked = Column(Boolean, default=False)

    grocery_list = relationship("GroceryList", back_populates="items")


class WaterLog(Base):
    __tablename__ = "water_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount_ml = Column(Float, nullable=False)
    logged_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="water_logs")


class NutritionHistory(Base):
    __tablename__ = "nutrition_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(String(20), index=True, nullable=False)  # YYYY-MM-DD
    total_calories = Column(Float, default=0.0)
    total_protein = Column(Float, default=0.0)
    total_carbs = Column(Float, default=0.0)
    total_fat = Column(Float, default=0.0)
    total_fiber = Column(Float, default=0.0)
    total_water_ml = Column(Float, default=0.0)
    total_steps = Column(Integer, default=0)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(20), nullable=False)  # user, assistant
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")


# --- FREEMIUM SUBSCRIPTION & SAAS QUOTA MODELS ---

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    tier = Column(String(20), default="free")  # free, plus, pro
    billing_period = Column(String(20), default="monthly")  # monthly, annual
    status = Column(String(20), default="active")  # active, cancelled, past_due
    started_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    provider = Column(String(50), default="stripe")  # stripe, revenuecat, apple, google
    customer_id = Column(String(100), nullable=True)
    subscription_id = Column(String(100), nullable=True)

    user = relationship("User", back_populates="subscription")


class DailyUsageQuota(Base):
    __tablename__ = "user_daily_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(String(20), index=True, nullable=False)  # YYYY-MM-DD
    scans_used = Column(Integer, default=0)
    messages_used = Column(Integer, default=0)

    user = relationship("User", back_populates="daily_usages")


class BillingInvoiceRecord(Base):
    __tablename__ = "billing_invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    plan_name = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(30), default="Paid")
    provider = Column(String(50), default="Stripe")
    receipt_url = Column(String(255), nullable=True)

    user = relationship("User", back_populates="invoices")

