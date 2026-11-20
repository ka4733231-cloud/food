"""
Pydantic Request and Response Schemas for NutriBite AI.
Ensures strict validation, serialization, and OpenAPI documentation.
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

# Graceful email validation: uses EmailStr if email-validator package is present,
# otherwise falls back to str to prevent crashes in environments where email-validator isn't installed.
try:
    import email_validator
    from pydantic import EmailStr
except ImportError:
    EmailStr = str

# --- AUTH SCHEMAS ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    avatar: Optional[str] = "👨‍🍳"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str
    avatar: str

class UserPreferencesBase(BaseModel):
    goal: str = "Maintain Weight"
    daily_calorie_target: float = 2000.0
    protein_target_g: float = 120.0
    carbs_target_g: float = 220.0
    fat_target_g: float = 65.0
    fiber_target_g: float = 30.0
    water_target_ml: float = 2500.0
    dietary_preferences: str = "Balanced"
    food_allergies: str = ""
    cuisine_preferences: str = "International, Pakistani"

class UserPreferencesResponse(UserPreferencesBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar: str
    created_at: datetime
    preferences: Optional[UserPreferencesResponse] = None
    class Config:
        from_attributes = True


# --- NUTRITION & FOOD SCHEMAS ---
class NutritionRecordBase(BaseModel):
    calories: float
    protein: float
    carbohydrates: float
    total_fat: float
    fiber: float = 0.0
    sugar: float = 0.0
    sodium_mg: float = 0.0

class NutritionRecordResponse(NutritionRecordBase):
    id: int
    food_item_id: int
    class Config:
        from_attributes = True

class FoodItemBase(BaseModel):
    name: str
    category: str = "General"
    cuisine: str = "International"
    serving_unit: str = "100g"
    standard_weight_grams: float = 100.0
    is_custom: bool = False
    fdc_id: Optional[str] = None

class CustomFoodCreate(FoodItemBase):
    nutrition: NutritionRecordBase

class FoodItemResponse(FoodItemBase):
    id: int
    nutrition: Optional[NutritionRecordResponse] = None
    class Config:
        from_attributes = True

class PortionAdjustRequest(BaseModel):
    food_id: str
    portion_grams: float

class PortionAdjustResponse(BaseModel):
    food_id: str
    food_name: str
    portion_grams: float
    nutrition: NutritionRecordBase


# --- FOOD SCAN SCHEMAS ---
class FoodScanCandidate(BaseModel):
    food_id: str
    name: str
    category: str
    cuisine: Optional[str] = "International"
    confidence: float
    db_key: str
    typical_portion_grams: float

class FoodBoundingBox(BaseModel):
    label: str
    confidence: float
    box_2d: List[float]  # [ymin, xmin, ymax, xmax]

class FoodScanResponse(BaseModel):
    id: Optional[int] = None
    predicted_food_name: str
    category: Optional[str] = None
    cuisine: Optional[str] = None
    db_key: Optional[str] = None
    confidence_score: float
    detected_items: List[str]
    estimated_portion_grams: float
    estimated_nutrition: NutritionRecordBase
    bounding_boxes: Optional[List[FoodBoundingBox]] = []
    top_candidates: Optional[List[FoodScanCandidate]] = []
    model_metadata: Optional[dict] = None
    visual_analysis: Optional[dict] = None
    disclaimer: str = "AI food estimates aren't always accurate. Portion size, ingredients and cooking methods can change the actual nutrition values."


# --- MEAL LOGGING SCHEMAS ---
class MealItemCreate(BaseModel):
    food_name: str
    portion_grams: float = 100.0
    calories: float
    protein: float = 0.0
    carbs: float = 0.0
    fat: float = 0.0
    fiber: float = 0.0

class MealCreate(BaseModel):
    meal_type: str = "Lunch"  # Breakfast, Lunch, Dinner, Snack
    notes: Optional[str] = None
    items: List[MealItemCreate]

class MealItemResponse(MealItemCreate):
    id: int
    class Config:
        from_attributes = True

class MealResponse(BaseModel):
    id: int
    user_id: int
    meal_type: str
    logged_at: datetime
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    notes: Optional[str] = None
    items: List[MealItemResponse] = []
    class Config:
        from_attributes = True

class DailyNutritionSummary(BaseModel):
    date: str
    calories_consumed: float
    calories_target: float
    calories_remaining: float
    protein_consumed: float
    protein_target: float
    carbs_consumed: float
    carbs_target: float
    fat_consumed: float
    fat_target: float
    fiber_consumed: float
    water_consumed_ml: float
    water_target_ml: float
    meals: List[MealResponse] = []


# --- RECIPE SCHEMAS ---
class RecipeIngredientBase(BaseModel):
    name: str
    quantity: float = 1.0
    unit: str = "serving"
    category: str = "Other"

class RecipeInstructionBase(BaseModel):
    step_number: int
    instruction: str

class RecipeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    category: str
    cuisine: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    difficulty: str
    calories_per_serving: float
    protein_per_serving: float
    carbs_per_serving: float
    fat_per_serving: float
    rating: float
    ingredients: List[RecipeIngredientBase] = []
    instructions: List[RecipeInstructionBase] = []
    class Config:
        from_attributes = True


# --- MEAL PLAN & GROCERY SCHEMAS ---
class MealPlanItemCreate(BaseModel):
    day_of_week: str  # Monday - Sunday
    meal_type: str    # Breakfast, Lunch, Dinner, Snack
    recipe_id: Optional[int] = None
    custom_meal_name: Optional[str] = None
    calories: float = 350.0

class MealPlanCreate(BaseModel):
    title: str = "Weekly Balanced Routine"
    items: List[MealPlanItemCreate]

class MealPlanItemResponse(MealPlanItemCreate):
    id: int
    class Config:
        from_attributes = True

class MealPlanResponse(BaseModel):
    id: int
    title: str
    items: List[MealPlanItemResponse] = []
    class Config:
        from_attributes = True

class GroceryItemBase(BaseModel):
    name: str
    quantity: str = "1"
    category: str = "Other"
    is_checked: bool = False

class GroceryItemCreate(GroceryItemBase):
    pass

class GroceryItemResponse(GroceryItemBase):
    id: int
    class Config:
        from_attributes = True

class GroceryListResponse(BaseModel):
    id: int
    title: str
    items: List[GroceryItemResponse] = []
    class Config:
        from_attributes = True


# --- WATER & ASSISTANT SCHEMAS ---
class WaterLogCreate(BaseModel):
    amount_ml: float = 250.0

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    suggested_recipes: Optional[List[str]] = []
    disclaimer: str = "NutriBite AI provides educational nutritional information and culinary suggestions, not clinical medical advice."


# --- FREEMIUM SUBSCRIPTION & SAAS SCHEMAS ---

class PlanLimitsSchema(BaseModel):
    daily_scans: int
    daily_messages: int
    max_favorites: int
    weekly_planner: bool
    multiple_lists: bool
    export_reports: bool = False

class SubscriptionPlanConfigSchema(BaseModel):
    id: str
    name: str
    tagline: str
    monthly_price: float
    annual_price: float
    annual_savings: Optional[str] = None
    is_popular: bool = False
    limits: PlanLimitsSchema
    features: List[str]

class UserSubscriptionResponse(BaseModel):
    id: Optional[int] = None
    user_id: int
    tier: str
    billing_period: str
    status: str
    started_at: datetime
    expires_at: Optional[datetime] = None
    cancel_at_period_end: bool = False
    provider: str
    scans_used_today: int = 0
    scans_limit: int = 5
    messages_used_today: int = 0
    messages_limit: int = 5

    class Config:
        from_attributes = True

class UpgradeSubscriptionRequest(BaseModel):
    tier: str = Field(..., description="'free', 'plus', or 'pro'")
    billing_period: str = Field("annual", description="'monthly' or 'annual'")
    payment_method_id: Optional[str] = "pm_mock_card_4242"
    provider: Optional[str] = "stripe"

class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    date: datetime
    plan_name: str
    amount: float
    currency: str = "USD"
    status: str
    provider: str
    receipt_url: Optional[str] = None

    class Config:
        from_attributes = True

class AdminPlanConfigUpdate(BaseModel):
    plan_id: str
    monthly_price: Optional[float] = None
    annual_price: Optional[float] = None
    daily_scans: Optional[int] = None
    daily_messages: Optional[int] = None

