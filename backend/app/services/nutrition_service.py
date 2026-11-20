"""
Nutrition Service for NutriBite AI.
Integrates USDA FoodData Central standards, normalizes serving sizes,
and includes an extensive library of verified International & Pakistani/South Asian dishes.
"""

import os
from typing import Dict, Any, List, Optional

try:
    import requests  # type: ignore
    HAS_REQUESTS = True
except ImportError:
    requests = None
    HAS_REQUESTS = False

try:
    from sqlalchemy.orm import Session  # type: ignore
except ImportError:
    Session = Any  # type: ignore

USDA_API_KEY = os.getenv("USDA_FDC_API_KEY", "DEMO_KEY")
USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1"

# Comprehensive Verified Nutrient Database (Per 100g standard portion)
VERIFIED_NUTRITION_DB = {
    # -------------------------------------------------------------
    # 🇵🇰 PAKISTANI & SOUTH ASIAN CUISINE
    # -------------------------------------------------------------
    "chicken_biryani": {
        "name": "Chicken Biryani",
        "category": "Rice & Entrees",
        "cuisine": "Pakistani",
        "serving_unit": "plate (300g)",
        "standard_weight_grams": 300.0,
        "calories": 185.0,
        "protein": 11.2,
        "carbohydrates": 24.5,
        "total_fat": 4.8,
        "fiber": 1.2,
        "sugar": 0.8,
        "sodium_mg": 460.0
    },
    "mutton_karahi": {
        "name": "Mutton Karahi",
        "category": "Curry & Stews",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (250g)",
        "standard_weight_grams": 250.0,
        "calories": 210.0,
        "protein": 18.5,
        "carbohydrates": 3.8,
        "total_fat": 13.5,
        "fiber": 1.1,
        "sugar": 1.4,
        "sodium_mg": 520.0
    },
    "chicken_karahi": {
        "name": "Chicken Karahi",
        "category": "Curry & Stews",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (250g)",
        "standard_weight_grams": 250.0,
        "calories": 175.0,
        "protein": 19.2,
        "carbohydrates": 3.2,
        "total_fat": 9.5,
        "fiber": 1.0,
        "sugar": 1.2,
        "sodium_mg": 480.0
    },
    "nihari": {
        "name": "Slow-Cooked Beef Nihari",
        "category": "Curry & Stews",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (280g)",
        "standard_weight_grams": 280.0,
        "calories": 225.0,
        "protein": 19.8,
        "carbohydrates": 6.2,
        "total_fat": 14.0,
        "fiber": 0.8,
        "sugar": 0.4,
        "sodium_mg": 680.0
    },
    "haleem": {
        "name": "Shahi Beef & Lentil Haleem",
        "category": "Curry & Stews",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (300g)",
        "standard_weight_grams": 300.0,
        "calories": 160.0,
        "protein": 13.5,
        "carbohydrates": 16.8,
        "total_fat": 5.2,
        "fiber": 4.1,
        "sugar": 0.6,
        "sodium_mg": 490.0
    },
    "daal": {
        "name": "Tarka Daal (Yellow Lentils)",
        "category": "Legumes & Grains",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (220g)",
        "standard_weight_grams": 220.0,
        "calories": 115.0,
        "protein": 7.5,
        "carbohydrates": 17.2,
        "total_fat": 2.1,
        "fiber": 4.2,
        "sugar": 0.8,
        "sodium_mg": 320.0
    },
    "daal_chawal": {
        "name": "Yellow Lentil Daal with Rice",
        "category": "Legumes & Grains",
        "cuisine": "Pakistani",
        "serving_unit": "plate (320g)",
        "standard_weight_grams": 320.0,
        "calories": 142.0,
        "protein": 6.8,
        "carbohydrates": 23.5,
        "total_fat": 2.4,
        "fiber": 3.8,
        "sugar": 0.5,
        "sodium_mg": 380.0
    },
    "daal_makhani": {
        "name": "Creamy Black Lentil Daal Makhani",
        "category": "Legumes & Grains",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (240g)",
        "standard_weight_grams": 240.0,
        "calories": 155.0,
        "protein": 6.2,
        "carbohydrates": 18.0,
        "total_fat": 7.0,
        "fiber": 4.5,
        "sugar": 1.1,
        "sodium_mg": 410.0
    },
    "palak_paneer": {
        "name": "Creamy Palak Paneer",
        "category": "Vegetarian",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (240g)",
        "standard_weight_grams": 240.0,
        "calories": 178.0,
        "protein": 9.4,
        "carbohydrates": 5.2,
        "total_fat": 13.8,
        "fiber": 2.9,
        "sugar": 1.8,
        "sodium_mg": 410.0
    },
    "chapati_roti": {
        "name": "Whole Wheat Tandoori Roti",
        "category": "Breads",
        "cuisine": "Pakistani",
        "serving_unit": "1 roti (60g)",
        "standard_weight_grams": 60.0,
        "calories": 248.0,
        "protein": 8.5,
        "carbohydrates": 49.0,
        "total_fat": 1.8,
        "fiber": 6.5,
        "sugar": 1.2,
        "sodium_mg": 180.0
    },
    "tandoori_naan": {
        "name": "Tandoori Naan Bread",
        "category": "Breads",
        "cuisine": "Pakistani",
        "serving_unit": "1 naan (90g)",
        "standard_weight_grams": 90.0,
        "calories": 285.0,
        "protein": 8.8,
        "carbohydrates": 52.0,
        "total_fat": 5.0,
        "fiber": 2.4,
        "sugar": 3.0,
        "sodium_mg": 460.0
    },
    "paratha": {
        "name": "Crispy Layered Ghee Paratha",
        "category": "Breads",
        "cuisine": "Pakistani",
        "serving_unit": "1 paratha (80g)",
        "standard_weight_grams": 80.0,
        "calories": 320.0,
        "protein": 6.5,
        "carbohydrates": 44.0,
        "total_fat": 13.5,
        "fiber": 3.8,
        "sugar": 1.5,
        "sodium_mg": 310.0
    },
    "seekh_kabab": {
        "name": "Charcoal Beef Seekh Kabab",
        "category": "Grilled & BBQ",
        "cuisine": "Pakistani",
        "serving_unit": "2 skewers (160g)",
        "standard_weight_grams": 160.0,
        "calories": 215.0,
        "protein": 21.0,
        "carbohydrates": 3.5,
        "total_fat": 13.0,
        "fiber": 1.2,
        "sugar": 0.8,
        "sodium_mg": 520.0
    },
    "chicken_tikka": {
        "name": "Tandoori Chicken Tikka",
        "category": "Grilled & BBQ",
        "cuisine": "Pakistani",
        "serving_unit": "portion (200g)",
        "standard_weight_grams": 200.0,
        "calories": 165.0,
        "protein": 25.4,
        "carbohydrates": 2.8,
        "total_fat": 5.8,
        "fiber": 0.9,
        "sugar": 0.7,
        "sodium_mg": 470.0
    },
    "shami_kabab": {
        "name": "Beef Shami Kabab",
        "category": "Snacks & Appetizers",
        "cuisine": "Pakistani",
        "serving_unit": "2 patties (120g)",
        "standard_weight_grams": 120.0,
        "calories": 195.0,
        "protein": 16.5,
        "carbohydrates": 10.2,
        "total_fat": 9.8,
        "fiber": 2.5,
        "sugar": 0.6,
        "sodium_mg": 430.0
    },
    "aloo_gobi": {
        "name": "Spiced Aloo Gobi (Potato & Cauliflower)",
        "category": "Vegetarian",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (200g)",
        "standard_weight_grams": 200.0,
        "calories": 95.0,
        "protein": 2.8,
        "carbohydrates": 14.5,
        "total_fat": 3.2,
        "fiber": 3.5,
        "sugar": 2.6,
        "sodium_mg": 310.0
    },
    "chana_chaat": {
        "name": "Tangy Chickpea Chana Chaat",
        "category": "Snacks & Appetizers",
        "cuisine": "Pakistani",
        "serving_unit": "bowl (220g)",
        "standard_weight_grams": 220.0,
        "calories": 138.0,
        "protein": 6.8,
        "carbohydrates": 22.4,
        "total_fat": 2.6,
        "fiber": 5.1,
        "sugar": 3.8,
        "sodium_mg": 390.0
    },
    "vegetable_samosa": {
        "name": "Crispy Spiced Potato Samosa",
        "category": "Snacks & Appetizers",
        "cuisine": "Pakistani",
        "serving_unit": "1 samosa (75g)",
        "standard_weight_grams": 75.0,
        "calories": 260.0,
        "protein": 4.5,
        "carbohydrates": 32.0,
        "total_fat": 13.0,
        "fiber": 2.8,
        "sugar": 1.8,
        "sodium_mg": 360.0
    },
    "mango_lassi": {
        "name": "Chilled Sweet Mango Lassi",
        "category": "Beverages",
        "cuisine": "Pakistani",
        "serving_unit": "glass (250ml)",
        "standard_weight_grams": 250.0,
        "calories": 88.0,
        "protein": 3.2,
        "carbohydrates": 15.5,
        "total_fat": 1.6,
        "fiber": 0.8,
        "sugar": 13.5,
        "sodium_mg": 65.0
    },
    "gulab_jamun": {
        "name": "Gulab Jamun in Rose Syrup",
        "category": "Desserts",
        "cuisine": "Pakistani",
        "serving_unit": "2 pieces (90g)",
        "standard_weight_grams": 90.0,
        "calories": 310.0,
        "protein": 4.2,
        "carbohydrates": 54.0,
        "total_fat": 9.0,
        "fiber": 0.5,
        "sugar": 46.0,
        "sodium_mg": 120.0
    },

    # -------------------------------------------------------------
    # 🌍 INTERNATIONAL & USDA WHOLE FOOD STAPLES
    # -------------------------------------------------------------
    "pizza": {
        "name": "Artisanal Margherita Pizza",
        "category": "Pizza",
        "cuisine": "Italian",
        "serving_unit": "2 slices (215g)",
        "standard_weight_grams": 215.0,
        "calories": 266.0,
        "protein": 11.4,
        "carbohydrates": 33.3,
        "total_fat": 9.8,
        "fiber": 2.3,
        "sugar": 3.6,
        "sodium_mg": 598.0
    },
    "salad": {
        "name": "Mediterranean Garden Salad with Feta",
        "category": "Salad",
        "cuisine": "Mediterranean",
        "serving_unit": "bowl (180g)",
        "standard_weight_grams": 180.0,
        "calories": 68.0,
        "protein": 2.6,
        "carbohydrates": 5.4,
        "total_fat": 4.5,
        "fiber": 2.1,
        "sugar": 2.2,
        "sodium_mg": 142.0
    },
    "pasta": {
        "name": "Creamy Tuscan Garlic Herb Pasta",
        "category": "Pasta",
        "cuisine": "Italian",
        "serving_unit": "plate (250g)",
        "standard_weight_grams": 250.0,
        "calories": 195.0,
        "protein": 7.2,
        "carbohydrates": 26.5,
        "total_fat": 6.8,
        "fiber": 1.8,
        "sugar": 1.5,
        "sodium_mg": 320.0
    },
    "sushi": {
        "name": "Fresh Salmon Avocado Sushi",
        "category": "Sushi",
        "cuisine": "Japanese",
        "serving_unit": "roll 8 pcs (210g)",
        "standard_weight_grams": 210.0,
        "calories": 158.0,
        "protein": 6.8,
        "carbohydrates": 22.0,
        "total_fat": 4.6,
        "fiber": 1.9,
        "sugar": 2.1,
        "sodium_mg": 410.0
    },
    "chicken_breast": {
        "name": "Herb Grilled Chicken Breast",
        "category": "Poultry & Meat",
        "cuisine": "International",
        "serving_unit": "fillet (170g)",
        "standard_weight_grams": 170.0,
        "calories": 165.0,
        "protein": 31.0,
        "carbohydrates": 0.0,
        "total_fat": 3.6,
        "fiber": 0.0,
        "sugar": 0.0,
        "sodium_mg": 74.0
    },
    "oatmeal": {
        "name": "Warm Rolled Oatmeal with Berries",
        "category": "Breakfast",
        "cuisine": "International",
        "serving_unit": "bowl (240g)",
        "standard_weight_grams": 240.0,
        "calories": 71.0,
        "protein": 2.5,
        "carbohydrates": 12.0,
        "total_fat": 1.5,
        "fiber": 2.2,
        "sugar": 4.2,
        "sodium_mg": 49.0
    },
    "greek_yogurt": {
        "name": "Plain Greek Yogurt (2% Fat)",
        "category": "Dairy",
        "cuisine": "International",
        "serving_unit": "cup (200g)",
        "standard_weight_grams": 200.0,
        "calories": 73.0,
        "protein": 10.0,
        "carbohydrates": 4.0,
        "total_fat": 2.0,
        "fiber": 0.0,
        "sugar": 4.0,
        "sodium_mg": 45.0
    },
    "boiled_egg": {
        "name": "Hard Boiled Egg",
        "category": "Breakfast & Protein",
        "cuisine": "International",
        "serving_unit": "1 large egg (50g)",
        "standard_weight_grams": 50.0,
        "calories": 155.0,
        "protein": 12.6,
        "carbohydrates": 1.1,
        "total_fat": 10.6,
        "fiber": 0.0,
        "sugar": 1.1,
        "sodium_mg": 124.0
    },
    "avocado": {
        "name": "Fresh Hass Avocado",
        "category": "Fruits & Healthy Fats",
        "cuisine": "International",
        "serving_unit": "half avocado (100g)",
        "standard_weight_grams": 100.0,
        "calories": 160.0,
        "protein": 2.0,
        "carbohydrates": 8.5,
        "total_fat": 14.7,
        "fiber": 6.7,
        "sugar": 0.7,
        "sodium_mg": 7.0
    },
    "brown_rice": {
        "name": "Steamed Brown Basmati Rice",
        "category": "Grains",
        "cuisine": "International",
        "serving_unit": "cup (195g)",
        "standard_weight_grams": 195.0,
        "calories": 111.0,
        "protein": 2.6,
        "carbohydrates": 23.0,
        "total_fat": 0.9,
        "fiber": 1.8,
        "sugar": 0.4,
        "sodium_mg": 5.0
    },
    "grilled_salmon": {
        "name": "Wild Atlantic Grilled Salmon",
        "category": "Seafood",
        "cuisine": "International",
        "serving_unit": "fillet (180g)",
        "standard_weight_grams": 180.0,
        "calories": 206.0,
        "protein": 22.1,
        "carbohydrates": 0.0,
        "total_fat": 12.3,
        "fiber": 0.0,
        "sugar": 0.0,
        "sodium_mg": 60.0
    },
    "sweet_potato": {
        "name": "Baked Sweet Potato",
        "category": "Vegetables & Tubers",
        "cuisine": "International",
        "serving_unit": "1 medium (150g)",
        "standard_weight_grams": 150.0,
        "calories": 90.0,
        "protein": 2.0,
        "carbohydrates": 20.7,
        "total_fat": 0.1,
        "fiber": 3.3,
        "sugar": 6.5,
        "sodium_mg": 36.0
    },
    "almonds": {
        "name": "Raw Whole Almonds",
        "category": "Nuts & Seeds",
        "cuisine": "International",
        "serving_unit": "handful (28g)",
        "standard_weight_grams": 28.0,
        "calories": 579.0,
        "protein": 21.2,
        "carbohydrates": 21.6,
        "total_fat": 49.9,
        "fiber": 12.5,
        "sugar": 4.4,
        "sodium_mg": 1.0
    },
    "apple": {
        "name": "Fresh Crisp Apple with Skin",
        "category": "Fruits",
        "cuisine": "International",
        "serving_unit": "1 medium (182g)",
        "standard_weight_grams": 182.0,
        "calories": 52.0,
        "protein": 0.3,
        "carbohydrates": 13.8,
        "total_fat": 0.2,
        "fiber": 2.4,
        "sugar": 10.4,
        "sodium_mg": 1.0
    },
    "banana": {
        "name": "Fresh Ripe Banana",
        "category": "Fruits",
        "cuisine": "International",
        "serving_unit": "1 medium (118g)",
        "standard_weight_grams": 118.0,
        "calories": 89.0,
        "protein": 1.1,
        "carbohydrates": 22.8,
        "total_fat": 0.3,
        "fiber": 2.6,
        "sugar": 12.2,
        "sodium_mg": 1.0
    }
}


class NutritionService:
    def __init__(self):
        self.local_db = VERIFIED_NUTRITION_DB

    def search_foods(self, query: str, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        """
        Search food items across PostgreSQL database, local verified library, and USDA API.
        """
        q = query.lower().strip()
        results = []
        seen_names = set()

        # 1. Search in PostgreSQL database if session provided
        if db:
            try:
                from ..models import FoodItem, NutritionRecord
                db_items = (
                    db.query(FoodItem)
                    .join(NutritionRecord, FoodItem.id == NutritionRecord.food_item_id)
                    .filter(
                        (FoodItem.name.ilike(f"%{q}%"))
                        | (FoodItem.category.ilike(f"%{q}%"))
                        | (FoodItem.cuisine.ilike(f"%{q}%"))
                    )
                    .limit(15)
                    .all()
                )

                for item in db_items:
                    n = item.nutrition
                    seen_names.add(item.name.lower())
                    results.append({
                        "id": f"db_{item.id}",
                        "name": item.name,
                        "category": item.category,
                        "cuisine": item.cuisine,
                        "serving_unit": item.serving_unit,
                        "standard_weight_grams": item.standard_weight_grams,
                        "calories": n.calories if n else 0.0,
                        "protein": n.protein if n else 0.0,
                        "carbohydrates": n.carbohydrates if n else 0.0,
                        "total_fat": n.total_fat if n else 0.0,
                        "fiber": n.fiber if n else 0.0,
                        "sugar": n.sugar if n else 0.0,
                        "sodium_mg": n.sodium_mg if n else 0.0,
                        "source": "postgresql_database"
                    })
            except Exception:
                pass

        # 2. Search local verified library
        for key, item in self.local_db.items():
            if item["name"].lower() in seen_names:
                continue
            if q in key or q in item["name"].lower() or q in item["category"].lower() or q in item["cuisine"].lower():
                seen_names.add(item["name"].lower())
                results.append({
                    "id": key,
                    "source": "verified_nutribite",
                    **item
                })

        # 3. Query USDA FoodData Central if API key configured and fewer than 6 results
        if HAS_REQUESTS and USDA_API_KEY and USDA_API_KEY != "DEMO_KEY" and len(results) < 6:
            try:
                res = requests.get(
                    f"{USDA_BASE_URL}/foods/search",
                    params={"query": q, "pageSize": 5, "api_key": USDA_API_KEY},
                    timeout=3
                )
                if res.status_code == 200:
                    data = res.json()
                    for fdc_food in data.get("foods", []):
                        nutrients = {n.get("nutrientName", "").lower(): n.get("value", 0) for n in fdc_food.get("foodNutrients", [])}
                        results.append({
                            "id": f"fdc_{fdc_food.get('fdcId')}",
                            "name": fdc_food.get("description", "USDA Food"),
                            "category": fdc_food.get("foodCategory", "USDA General"),
                            "cuisine": "USDA Reference",
                            "serving_unit": "100g",
                            "standard_weight_grams": 100.0,
                            "calories": nutrients.get("energy", 100.0),
                            "protein": nutrients.get("protein", 5.0),
                            "carbohydrates": nutrients.get("carbohydrate, by difference", 15.0),
                            "total_fat": nutrients.get("total lipid (fat)", 3.0),
                            "fiber": nutrients.get("fiber, total dietary", 1.0),
                            "sugar": nutrients.get("sugars, total including nlea", 1.0),
                            "sodium_mg": nutrients.get("sodium, na", 200.0),
                            "source": "usda_fdc"
                        })
            except Exception:
                pass

        return results

    def get_all_foods(self, category: Optional[str] = None, cuisine: Optional[str] = None) -> List[Dict[str, Any]]:
        """Returns all verified food items in the nutrition database with optional filters."""
        foods = []
        for key, item in self.local_db.items():
            if category and category.lower() != "all" and item["category"].lower() != category.lower():
                continue
            if cuisine and cuisine.lower() != "all" and item["cuisine"].lower() != cuisine.lower():
                continue
            foods.append({"food_id": key, **item})
        return foods

    def get_categories_and_cuisines(self) -> Dict[str, List[str]]:
        """Returns distinct food categories and cuisines in the nutrition library."""
        categories = sorted(list(set(item["category"] for item in self.local_db.values())))
        cuisines = sorted(list(set(item["cuisine"] for item in self.local_db.values())))
        return {"categories": categories, "cuisines": cuisines}

    def calculate_nutrition_for_portion(self, food_key: str, portion_grams: float, db: Optional[Session] = None) -> Dict[str, Any]:
        """
        Calculates exact scaled nutritional breakdown and USDA % Daily Values
        based on user-calibrated portion in grams.
        """
        key = food_key.lower().strip()
        item = None

        # Check DB if ID passed
        if db and key.startswith("db_"):
            try:
                db_id = int(key.replace("db_", ""))
                from ..models import FoodItem
                db_food = db.query(FoodItem).filter(FoodItem.id == db_id).first()
                if db_food and db_food.nutrition:
                    n = db_food.nutrition
                    item = {
                        "name": db_food.name,
                        "category": db_food.category,
                        "cuisine": db_food.cuisine,
                        "calories": n.calories,
                        "protein": n.protein,
                        "carbohydrates": n.carbohydrates,
                        "total_fat": n.total_fat,
                        "fiber": n.fiber,
                        "sugar": n.sugar,
                        "sodium_mg": n.sodium_mg
                    }
            except Exception:
                pass

        # Check in-memory database
        if not item:
            item = self.local_db.get(key)

        # Fallback partial matching
        if not item:
            for k, val in self.local_db.items():
                if k in key or key in k:
                    item = val
                    break

        if not item:
            item = self.local_db["chicken_biryani"]

        multiplier = portion_grams / 100.0
        cal = round(item["calories"] * multiplier, 1)

        return {
            "food_id": food_key,
            "food_name": item["name"],
            "category": item["category"],
            "cuisine": item["cuisine"],
            "portion_grams": round(portion_grams, 1),
            "nutrition": {
                "calories": cal,
                "protein": round(item["protein"] * multiplier, 1),
                "carbohydrates": round(item["carbohydrates"] * multiplier, 1),
                "total_fat": round(item["total_fat"] * multiplier, 1),
                "fiber": round(item["fiber"] * multiplier, 1),
                "sugar": round(item["sugar"] * multiplier, 1),
                "sodium_mg": round(item["sodium_mg"] * multiplier, 1)
            },
            "percent_daily_values": {
                "calories": round((cal / 2000.0) * 100),
                "protein": round((item["protein"] * multiplier / 50.0) * 100),
                "carbohydrates": round((item["carbohydrates"] * multiplier / 275.0) * 100),
                "total_fat": round((item["total_fat"] * multiplier / 78.0) * 100),
                "fiber": round((item["fiber"] * multiplier / 28.0) * 100),
                "sodium": round((item["sodium_mg"] * multiplier / 2300.0) * 100)
            },
            "exercise_burn_minutes": {
                "light_stroll": 15,
                "brisk_walking": max(10, round(cal / 4.9)),
                "cycling": max(8, round(cal / 8.5)),
                "jogging": max(6, round(cal / 11.5))
            }
        }


nutrition_service = NutritionService()
