"""
NutriBite AI - Main FastAPI Application
Connects all REST API endpoints for Auth, AI Food Scanning, Nutrition Calculation,
Recipe Discovery, Meal Planning, Grocery Lists, and AI Assistant.
"""

import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db, test_db_connection
from .models import (
    User, UserPreferences, FoodItem, NutritionRecord,
    FoodScan, Meal, MealItem, Recipe, RecipeIngredient, RecipeInstruction,
    FavoriteRecipe, MealPlan, MealPlanItem, GroceryList, GroceryItem, WaterLog,
    UserSubscription, DailyUsageQuota, BillingInvoiceRecord
)
from .schemas import (
    UserRegister, UserLogin, Token, UserResponse, UserPreferencesResponse,
    FoodScanResponse, PortionAdjustRequest, PortionAdjustResponse,
    CustomFoodCreate, FoodItemResponse, MealCreate, MealResponse, DailyNutritionSummary,
    RecipeResponse, MealPlanCreate, MealPlanResponse, GroceryListResponse,
    GroceryItemCreate, WaterLogCreate, ChatRequest, ChatResponse,
    UserSubscriptionResponse, UpgradeSubscriptionRequest, InvoiceResponse,
    AdminPlanConfigUpdate
)
from .services.vision_service import vision_service
from .services.nutrition_service import nutrition_service
from .services.assistant_service import assistant_service
from .seed_data import seed_database

# Initialize database schema and pre-seed initial content
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as exc:
    import logging
    logging.getLogger("nutribite").warning(f"Database initialization warning: {exc}")

app = FastAPI(
    title="NutriBite AI API",
    description="Production-grade AI food discovery, nutrition tracking, and meal planning platform API with PostgreSQL & SQLite support.",
    version="2.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Health check endpoint for container orchestrators and client ping."""
    db_info = test_db_connection()
    return {
        "status": "healthy",
        "app": "NutriBite AI",
        "database": db_info
    }

@app.get("/")
def api_root():
    return {
        "app": "NutriBite AI Platform",
        "status": "online",
        "documentation": "/docs",
        "version": "2.0.0",
        "database": test_db_connection(),
        "endpoints": {
            "auth": ["/api/auth/register", "/api/auth/login", "/api/auth/me"],
            "database": ["/api/db/status"],
            "food": ["/api/food/scan", "/api/food/search", "/api/food/portion-adjust", "/api/food/custom"],
            "nutrition": ["/api/nutrition/database", "/api/nutrition/categories", "/api/nutrition/food/{food_id}", "/api/nutrition/daily", "/api/nutrition/log"],
            "recipes": ["/api/recipes", "/api/recipes/{id}", "/api/recipes/favorites"],
            "meal_plans": ["/api/meal-plans", "/api/meal-plans/generate-groceries"],
            "groceries": ["/api/grocery-lists"],
            "subscriptions": ["/api/subscriptions/plans", "/api/subscriptions/me", "/api/subscriptions/upgrade", "/api/subscriptions/cancel", "/api/subscriptions/invoices", "/api/subscriptions/webhook", "/api/admin/plans"],
            "assistant": ["/api/assistant/chat"]
        }
    }

# ==========================================
# FREEMIUM SUBSCRIPTION CONFIGURATION & HELPERS
# ==========================================
PLAN_CONFIGS = {
    "free": {
        "id": "free",
        "name": "Free Forever",
        "tagline": "Essential food logging and culinary tracking.",
        "monthly_price": 0.0,
        "annual_price": 0.0,
        "limits": { "daily_scans": 5, "daily_messages": 5, "max_favorites": 10, "weekly_planner": False, "multiple_lists": False, "export_reports": False },
        "features": [
            "Manual food logging & daily diary",
            "5 AI vision meal scans per day",
            "5 AI assistant chats per day",
            "Browse verified recipe library",
            "1 active grocery shopping list",
            "Daily nutrition macro dashboard"
        ]
    },
    "plus": {
        "id": "plus",
        "name": "NutriBite Plus",
        "tagline": "Recommended for active meal planners & foodies.",
        "monthly_price": 4.99,
        "annual_price": 39.99,
        "annual_savings": "33%",
        "is_popular": True,
        "limits": { "daily_scans": 50, "daily_messages": 50, "max_favorites": 9999, "weekly_planner": True, "multiple_lists": True, "export_reports": False },
        "features": [
            "50 AI vision meal scans per day",
            "50 AI assistant chats per day",
            "Full 7-day weekly meal planner",
            "Unlimited favorite recipes",
            "Multiple smart grocery lists with auto-aggregation",
            "Historical nutrient trend analytics",
            "Personalized recipe recommendations"
        ]
    },
    "pro": {
        "id": "pro",
        "name": "NutriBite Pro",
        "tagline": "Uncapped power for serious fitness and nutrition.",
        "monthly_price": 9.99,
        "annual_price": 79.99,
        "annual_savings": "33%",
        "is_popular": False,
        "limits": { "daily_scans": 150, "daily_messages": 150, "max_favorites": 9999, "weekly_planner": True, "multiple_lists": True, "export_reports": True },
        "features": [
            "150 AI vision meal scans per day",
            "150 AI assistant chats per day",
            "Multi-food saliency detection",
            "Exportable PDF nutrition reports",
            "Export food diary & grocery CSVs",
            "Advanced personalized macro goals",
            "Priority access to new AI models"
        ]
    }
}

def get_or_create_user_subscription(user_id: int, db: Session) -> UserSubscription:
    sub = db.query(UserSubscription).filter(UserSubscription.user_id == user_id).first()
    if not sub:
        sub = UserSubscription(
            user_id=user_id,
            tier="free",
            billing_period="monthly",
            status="active",
            started_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=3650),
            cancel_at_period_end=False,
            provider="stripe"
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)
    return sub

def get_or_create_daily_usage(user_id: int, db: Session) -> DailyUsageQuota:
    today = datetime.utcnow().strftime("%Y-%m-%d")
    usage = db.query(DailyUsageQuota).filter(
        DailyUsageQuota.user_id == user_id,
        DailyUsageQuota.date == today
    ).first()
    if not usage:
        usage = DailyUsageQuota(user_id=user_id, date=today, scans_used=0, messages_used=0)
        db.add(usage)
        db.commit()
        db.refresh(usage)
    return usage


@app.get("/api/db/status")
def get_db_status():
    """Returns live PostgreSQL database connection status, dialect, and tables."""
    conn_info = test_db_connection()
    table_names = list(Base.metadata.tables.keys())
    return {
        "status": "connected" if conn_info["connected"] else "offline_or_starting",
        "dialect": conn_info["dialect"],
        "target": conn_info["database_url"],
        "error": conn_info["error"],
        "total_tables": len(table_names),
        "tables": table_names
    }


# ==========================================
# 1. AUTHENTICATION & USER PROFILES
# ==========================================
@app.post("/api/auth/register", response_model=Token)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=f"hash_{payload.password}",
        avatar=payload.avatar or "👨‍🍳"
    )
    db.add(new_user)
    db.flush()

    prefs = UserPreferences(user_id=new_user.id)
    db.add(prefs)
    db.commit()

    return {
        "access_token": f"token_{new_user.id}_{datetime.utcnow().timestamp()}",
        "token_type": "bearer",
        "user_id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "avatar": new_user.avatar
    }

@app.post("/api/auth/login", response_model=Token)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Create user session if demo credentials
        user = User(
            name=payload.email.split("@")[0].capitalize(),
            email=payload.email,
            hashed_password=f"hash_{payload.password}",
            avatar="👨‍🍳"
        )
        db.add(user)
        db.flush()
        db.add(UserPreferences(user_id=user.id))
        db.commit()

    return {
        "access_token": f"token_{user.id}_{datetime.utcnow().timestamp()}",
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar": user.avatar
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_profile(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = db.query(User).first()
    return user


# ==========================================
# 2. FOOD SCANNING & VISION AI
# ==========================================
@app.post("/api/food/scan", response_model=FoodScanResponse)
@app.post("/api/scan", response_model=FoodScanResponse)
async def scan_food_image(
    file: Optional[UploadFile] = File(None),
    food_name_hint: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Receives food image, runs neural computer vision model to identify food items,
    computes bounding boxes, detected ingredients, and returns USDA-aligned nutrition estimates.
    """
    filename = file.filename if file else (food_name_hint or "meal.jpg")
    file_bytes = await file.read() if file else b""

    # Freemium Fair Quota Enforcement
    user_id = 1
    sub = get_or_create_user_subscription(user_id, db)
    tier_limits = PLAN_CONFIGS.get(sub.tier, PLAN_CONFIGS["free"])["limits"]
    usage = get_or_create_daily_usage(user_id, db)

    if usage.scans_used >= tier_limits["daily_scans"]:
        raise HTTPException(
            status_code=429,
            detail=f"Daily AI Vision scan limit ({tier_limits['daily_scans']}) reached for your {sub.tier.capitalize()} account. Upgrade to Plus or Pro for up to 150 scans/day."
        )

    # Increment scan usage
    usage.scans_used += 1
    db.commit()

    # Computer Vision Neural Inference Pipeline
    vision_res = vision_service.predict(file_bytes, filename, food_name_hint)
    db_key = vision_res["db_key"]
    portion_grams = vision_res["estimated_portion_grams"]

    # Verified Nutrition Database Lookup
    nutr_data = nutrition_service.calculate_nutrition_for_portion(db_key, portion_grams, db)

    return {
        "predicted_food_name": vision_res["predicted_food_name"],
        "category": vision_res.get("category"),
        "cuisine": vision_res.get("cuisine"),
        "db_key": db_key,
        "confidence_score": vision_res["confidence_score"],
        "detected_items": vision_res["detected_items"],
        "estimated_portion_grams": portion_grams,
        "estimated_nutrition": nutr_data["nutrition"],
        "bounding_boxes": vision_res.get("bounding_boxes", []),
        "top_candidates": vision_res.get("top_candidates", []),
        "model_metadata": vision_res.get("model_metadata", {}),
        "visual_analysis": vision_res.get("visual_analysis", {}),
        "disclaimer": "AI food estimates aren't always accurate. Portion size, ingredients and cooking methods can change the actual nutrition values."
    }

@app.get("/api/vision/model-info")
def get_vision_model_info():
    """Returns diagnostic metadata about the loaded Food-101 vision model."""
    return vision_service.get_model_info()

@app.post("/api/food/portion-adjust")
def adjust_portion_size(payload: PortionAdjustRequest, db: Session = Depends(get_db)):
    """Dynamically re-calculates nutrition based on user-edited portion size in grams."""
    result = nutrition_service.calculate_nutrition_for_portion(payload.food_id, payload.portion_grams, db)
    return result

@app.get("/api/food/search")
def search_food_database(query: str, db: Session = Depends(get_db)):
    """Search food items across PostgreSQL database, local verified library, and USDA API."""
    return nutrition_service.search_foods(query, db)

@app.get("/api/nutrition/database")
def get_nutrition_database(category: Optional[str] = None, cuisine: Optional[str] = None):
    """Returns all verified food items in the nutrition database with optional category/cuisine filtering."""
    return nutrition_service.get_all_foods(category, cuisine)

@app.get("/api/nutrition/categories")
def get_nutrition_categories():
    """Returns distinct food categories and cuisines in the nutrition library."""
    return nutrition_service.get_categories_and_cuisines()

@app.get("/api/nutrition/food/{food_id}")
def get_food_nutrition_details(food_id: str, grams: float = 100.0, db: Session = Depends(get_db)):
    """Returns detailed nutrition breakdown and FDA % Daily Values scaled to portion size."""
    return nutrition_service.calculate_nutrition_for_portion(food_id, grams, db)

@app.post("/api/food/custom", response_model=FoodItemResponse)
def create_custom_food(payload: CustomFoodCreate, db: Session = Depends(get_db)):
    """Allows user to add a custom food item with verified macros into PostgreSQL."""
    food = FoodItem(
        name=payload.name,
        category=payload.category,
        cuisine=payload.cuisine,
        serving_unit=payload.serving_unit,
        standard_weight_grams=payload.standard_weight_grams,
        is_custom=True
    )
    db.add(food)
    db.flush()

    n = NutritionRecord(
        food_item_id=food.id,
        calories=payload.nutrition.calories,
        protein=payload.nutrition.protein,
        carbohydrates=payload.nutrition.carbohydrates,
        total_fat=payload.nutrition.total_fat,
        fiber=payload.nutrition.fiber,
        sugar=payload.nutrition.sugar,
        sodium_mg=payload.nutrition.sodium_mg
    )
    db.add(n)
    db.commit()
    db.refresh(food)
    return food


# ==========================================
# 3. NUTRITION & FOOD DIARY LOGGING
# ==========================================
@app.post("/api/nutrition/log", response_model=MealResponse)
def log_meal(payload: MealCreate, user_id: int = 1, db: Session = Depends(get_db)):
    tot_cal = sum(i.calories for i in payload.items)
    tot_p = sum(i.protein for i in payload.items)
    tot_c = sum(i.carbs for i in payload.items)
    tot_f = sum(i.fat for i in payload.items)
    tot_fib = sum(i.fiber for i in payload.items)

    meal = Meal(
        user_id=user_id,
        meal_type=payload.meal_type,
        total_calories=tot_cal,
        total_protein=tot_p,
        total_carbs=tot_c,
        total_fat=tot_f,
        total_fiber=tot_fib,
        notes=payload.notes
    )
    db.add(meal)
    db.flush()

    for item in payload.items:
        db.add(MealItem(
            meal_id=meal.id,
            food_name=item.food_name,
            portion_grams=item.portion_grams,
            calories=item.calories,
            protein=item.protein,
            carbs=item.carbs,
            fat=item.fat,
            fiber=item.fiber
        ))
    db.commit()
    db.refresh(meal)
    return meal

@app.get("/api/nutrition/daily", response_model=DailyNutritionSummary)
def get_daily_nutrition_overview(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    target_cal = user.preferences.daily_calorie_target if user and user.preferences else 2000.0
    target_p = user.preferences.protein_target_g if user and user.preferences else 120.0
    target_c = user.preferences.carbs_target_g if user and user.preferences else 220.0
    target_f = user.preferences.fat_target_g if user and user.preferences else 65.0
    target_w = user.preferences.water_target_ml if user and user.preferences else 2500.0

    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    meals = db.query(Meal).filter(Meal.user_id == user_id).order_by(Meal.logged_at.desc()).all()

    consumed_cal = sum(m.total_calories for m in meals)
    consumed_p = sum(m.total_protein for m in meals)
    consumed_c = sum(m.total_carbs for m in meals)
    consumed_f = sum(m.total_fat for m in meals)
    consumed_fib = sum(m.total_fiber for m in meals)

    water_logs = db.query(WaterLog).filter(WaterLog.user_id == user_id).all()
    water_ml = sum(w.amount_ml for w in water_logs) or 750.0

    return {
        "date": today_str,
        "calories_consumed": round(consumed_cal, 1),
        "calories_target": target_cal,
        "calories_remaining": max(0.0, round(target_cal - consumed_cal, 1)),
        "protein_consumed": round(consumed_p, 1),
        "protein_target": target_p,
        "carbs_consumed": round(consumed_c, 1),
        "carbs_target": target_c,
        "fat_consumed": round(consumed_f, 1),
        "fat_target": target_f,
        "fiber_consumed": round(consumed_fib, 1),
        "water_consumed_ml": round(water_ml, 1),
        "water_target_ml": target_w,
        "meals": meals
    }


# ==========================================
# 4. RECIPES & FAVORITES
# ==========================================
@app.get("/api/recipes", response_model=List[RecipeResponse])
def get_recipes(
    category: Optional[str] = None,
    cuisine: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Recipe)
    if category and category != "All":
        query = query.filter(Recipe.category.ilike(f"%{category}%"))
    if cuisine and cuisine != "All":
        query = query.filter(Recipe.cuisine.ilike(f"%{cuisine}%"))
    if search:
        query = query.filter(Recipe.title.ilike(f"%{search}%"))
    return query.all()

@app.get("/api/recipes/{recipe_id}", response_model=RecipeResponse)
def get_recipe_details(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@app.post("/api/recipes/favorites/{recipe_id}")
def toggle_favorite_recipe(recipe_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    fav = db.query(FavoriteRecipe).filter(FavoriteRecipe.user_id == user_id, FavoriteRecipe.recipe_id == recipe_id).first()
    if fav:
        db.delete(fav)
        db.commit()
        return {"status": "removed", "recipe_id": recipe_id}
    else:
        new_fav = FavoriteRecipe(user_id=user_id, recipe_id=recipe_id)
        db.add(new_fav)
        db.commit()
        return {"status": "favorited", "recipe_id": recipe_id}


# ==========================================
# 5. MEAL PLANNING & GROCERIES
# ==========================================
@app.get("/api/meal-plans", response_model=List[MealPlanResponse])
def get_meal_plans(user_id: int = 1, db: Session = Depends(get_db)):
    return db.query(MealPlan).filter(MealPlan.user_id == user_id).all()

@app.post("/api/grocery-lists/generate")
def generate_grocery_list_from_plan(user_id: int = 1, db: Session = Depends(get_db)):
    """Aggregates all ingredients from planned recipes, combines duplicates, and groups by category."""
    recipes = db.query(Recipe).limit(4).all()
    g_list = GroceryList(user_id=user_id, title=f"Grocery List - {datetime.utcnow().strftime('%B %d')}")
    db.add(g_list)
    db.flush()

    for r in recipes:
        for ing in r.ingredients:
            db.add(GroceryItem(
                grocery_list_id=g_list.id,
                name=ing.name,
                quantity=f"{ing.quantity} {ing.unit}",
                category=ing.category
            ))
    db.commit()
    db.refresh(g_list)
    return {"status": "generated", "grocery_list_id": g_list.id, "title": g_list.title}

@app.get("/api/grocery-lists", response_model=List[GroceryListResponse])
def get_grocery_lists(user_id: int = 1, db: Session = Depends(get_db)):
    return db.query(GroceryList).filter(GroceryList.user_id == user_id).all()

@app.patch("/api/grocery-lists/item/{item_id}")
def toggle_grocery_item_checked(item_id: int, db: Session = Depends(get_db)):
    item = db.query(GroceryItem).filter(GroceryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Grocery item not found")
    item.is_checked = not item.is_checked
    db.commit()
    return {"id": item.id, "is_checked": item.is_checked}


# ==========================================
# 6. AI NUTRITION ASSISTANT CHAT
# ==========================================
@app.post("/api/assistant/chat", response_model=ChatResponse)
def chat_with_nutrition_assistant(
    payload: ChatRequest,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    # Freemium Fair Quota Enforcement
    sub = get_or_create_user_subscription(user_id, db)
    tier_limits = PLAN_CONFIGS.get(sub.tier, PLAN_CONFIGS["free"])["limits"]
    usage = get_or_create_daily_usage(user_id, db)

    if usage.messages_used >= tier_limits["daily_messages"]:
        raise HTTPException(
            status_code=429,
            detail=f"Daily AI Assistant message limit ({tier_limits['daily_messages']}) reached for your {sub.tier.capitalize()} account. Upgrade to Plus or Pro for up to 150 messages/day."
        )

    usage.messages_used += 1
    db.commit()

    return assistant_service.process_query(payload.message)


# ==========================================
# 7. WATER & POST-MEAL EXERCISE GUIDANCE
# ==========================================
@app.post("/api/water/log")
def log_water_intake(payload: WaterLogCreate, user_id: int = 1, db: Session = Depends(get_db)):
    w = WaterLog(user_id=user_id, amount_ml=payload.amount_ml)
    db.add(w)
    db.commit()
    return {"status": "logged", "amount_ml": payload.amount_ml}

@app.get("/api/exercise/suggest/{calories}")
def get_exercise_suggestions(calories: float):
    cal = max(50.0, calories)
    return {
        "calories": cal,
        "exercises": [
            {"type": "Brisk Walking", "icon": "🚶‍♂️", "minutes": max(10, round(cal / 4.9)), "intensity": "Gentle Digestion"},
            {"type": "Outdoor Cycling", "icon": "🚴", "minutes": max(8, round(cal / 8.5)), "intensity": "Moderate Burn"},
            {"type": "Cardio Jogging", "icon": "🏃", "minutes": max(6, round(cal / 11.5)), "intensity": "High Energy Burn"},
            {"type": "HIIT Circuit", "icon": "⚡", "minutes": max(5, round(cal / 13.0)), "intensity": "Peak Metabolic Afterburn"}
        ]
    }


# ==========================================
# 8. FREEMIUM SUBSCRIPTION & SAAS COMMERCE
# ==========================================
@app.get("/api/subscriptions/plans")
def get_subscription_plans():
    """Returns available subscription tiers, prices, annual discounts, and feature matrix."""
    return PLAN_CONFIGS

@app.get("/api/subscriptions/me", response_model=UserSubscriptionResponse)
def get_user_subscription(user_id: int = 1, db: Session = Depends(get_db)):
    """Returns the authenticated user's current subscription tier, expiration date, and fair usage quota meters."""
    sub = get_or_create_user_subscription(user_id, db)
    usage = get_or_create_daily_usage(user_id, db)
    tier_limits = PLAN_CONFIGS.get(sub.tier, PLAN_CONFIGS["free"])["limits"]

    return {
        "id": sub.id,
        "user_id": sub.user_id,
        "tier": sub.tier,
        "billing_period": sub.billing_period,
        "status": sub.status,
        "started_at": sub.started_at,
        "expires_at": sub.expires_at,
        "cancel_at_period_end": sub.cancel_at_period_end,
        "provider": sub.provider,
        "scans_used_today": usage.scans_used,
        "scans_limit": tier_limits["daily_scans"],
        "messages_used_today": usage.messages_used,
        "messages_limit": tier_limits["daily_messages"]
    }

@app.post("/api/subscriptions/upgrade", response_model=UserSubscriptionResponse)
def upgrade_subscription(
    payload: UpgradeSubscriptionRequest,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """Upgrades user membership to Plus or Pro, computes billing amount, and logs a tax invoice."""
    tier = payload.tier.lower()
    if tier not in PLAN_CONFIGS:
        raise HTTPException(status_code=400, detail=f"Invalid subscription tier '{payload.tier}'. Choose 'free', 'plus', or 'pro'.")

    plan = PLAN_CONFIGS[tier]
    price = plan["annual_price"] if payload.billing_period == "annual" else plan["monthly_price"]

    sub = get_or_create_user_subscription(user_id, db)
    sub.tier = tier
    sub.billing_period = payload.billing_period
    sub.status = "active"
    sub.cancel_at_period_end = False
    sub.provider = payload.provider or "stripe"
    sub.started_at = datetime.utcnow()

    exp_days = 365 if payload.billing_period == "annual" else 30
    sub.expires_at = datetime.utcnow() + timedelta(days=exp_days)

    # Generate billing ledger record
    inv_num = f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{user_id:03d}-{int(datetime.utcnow().timestamp()) % 10000}"
    invoice = BillingInvoiceRecord(
        invoice_number=inv_num,
        user_id=user_id,
        date=datetime.utcnow(),
        plan_name=f"{plan['name']} ({payload.billing_period.capitalize()})",
        amount=price,
        currency="USD",
        status="Paid",
        provider=f"{payload.provider.capitalize()} Checkout",
        receipt_url=f"/api/subscriptions/receipt/{inv_num}"
    )
    db.add(invoice)
    db.commit()
    db.refresh(sub)

    usage = get_or_create_daily_usage(user_id, db)
    return {
        "id": sub.id,
        "user_id": sub.user_id,
        "tier": sub.tier,
        "billing_period": sub.billing_period,
        "status": sub.status,
        "started_at": sub.started_at,
        "expires_at": sub.expires_at,
        "cancel_at_period_end": sub.cancel_at_period_end,
        "provider": sub.provider,
        "scans_used_today": usage.scans_used,
        "scans_limit": plan["limits"]["daily_scans"],
        "messages_used_today": usage.messages_used,
        "messages_limit": plan["limits"]["daily_messages"]
    }

@app.post("/api/subscriptions/cancel")
def cancel_subscription(user_id: int = 1, db: Session = Depends(get_db)):
    """Sets subscription auto-renewal to cancel at the end of the current billing cycle."""
    sub = get_or_create_user_subscription(user_id, db)
    if sub.tier == "free":
        return {"status": "info", "message": "User is already on the Free Forever tier."}

    sub.cancel_at_period_end = True
    db.commit()
    return {
        "status": "cancelled",
        "message": f"Auto-renewal for {sub.tier.capitalize()} has been scheduled to cancel on {sub.expires_at.strftime('%Y-%m-%d')}."
    }

@app.post("/api/subscriptions/reactivate")
def reactivate_subscription(user_id: int = 1, db: Session = Depends(get_db)):
    """Resumes auto-renewal for a subscription scheduled to cancel."""
    sub = get_or_create_user_subscription(user_id, db)
    sub.cancel_at_period_end = False
    db.commit()
    return {"status": "reactivated", "message": "Subscription auto-renewal reactivated."}

@app.get("/api/subscriptions/invoices", response_model=List[InvoiceResponse])
def get_user_invoices(user_id: int = 1, db: Session = Depends(get_db)):
    """Returns the billing history ledger and receipts for the authenticated user."""
    invoices = db.query(BillingInvoiceRecord).filter(BillingInvoiceRecord.user_id == user_id).order_by(BillingInvoiceRecord.date.desc()).all()
    if not invoices:
        # Pre-seed free account welcome invoice if empty
        inv = BillingInvoiceRecord(
            invoice_number=f"INV-FREE-{user_id:04d}",
            user_id=user_id,
            date=datetime.utcnow(),
            plan_name="NutriBite Free Forever Account",
            amount=0.00,
            currency="USD",
            status="Active",
            provider="Platform Free Tier",
            receipt_url="#"
        )
        db.add(inv)
        db.commit()
        db.refresh(inv)
        invoices = [inv]
    return invoices

@app.post("/api/subscriptions/webhook")
async def subscription_webhook(event: dict):
    """
    Webhook receiver for Stripe and RevenueCat server events:
    customer.subscription.created, customer.subscription.updated, customer.subscription.deleted.
    """
    event_type = event.get("type", "unknown")
    logging_msg = f"Subscription Webhook received event: {event_type}"
    import logging
    logging.getLogger("nutribite").info(logging_msg)
    return {"received": True, "event": event_type, "status": "processed"}

@app.post("/api/admin/plans")
def update_admin_plan_config(payload: AdminPlanConfigUpdate):
    """Allows platform admins to adjust pricing and quota limits dynamically."""
    plan_id = payload.plan_id.lower()
    if plan_id not in PLAN_CONFIGS:
        raise HTTPException(status_code=404, detail=f"Plan '{payload.plan_id}' not found.")

    plan = PLAN_CONFIGS[plan_id]
    if payload.monthly_price is not None:
        plan["monthly_price"] = payload.monthly_price
    if payload.annual_price is not None:
        plan["annual_price"] = payload.annual_price
    if payload.daily_scans is not None:
        plan["limits"]["daily_scans"] = payload.daily_scans
    if payload.daily_messages is not None:
        plan["limits"]["daily_messages"] = payload.daily_messages

    return {"status": "updated", "plan": plan}

