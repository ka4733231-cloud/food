"""
Seed Data Script for NutriBite AI.
Populates SQLite/PostgreSQL with verified initial recipes, nutrition items,
a sample demo user, weekly meal plan, and grocery list.
"""

from .database import SessionLocal, engine, Base
from .models import (
    User, UserPreferences, FoodItem, NutritionRecord,
    Recipe, RecipeIngredient, RecipeInstruction, MealPlan, MealPlanItem,
    GroceryList, GroceryItem, Meal, MealItem
)
from .services.nutrition_service import VERIFIED_NUTRITION_DB

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Food Items & Nutrition Records (if not already seeded)
    if not db.query(FoodItem).first():
        print("Seeding verified nutrition database into PostgreSQL...")
        for key, item in VERIFIED_NUTRITION_DB.items():
            food = FoodItem(
                name=item["name"],
                category=item["category"],
                cuisine=item["cuisine"],
                serving_unit=item["serving_unit"],
                standard_weight_grams=item["standard_weight_grams"],
                is_custom=False
            )
            db.add(food)
            db.flush()

            rec = NutritionRecord(
                food_item_id=food.id,
                calories=item["calories"],
                protein=item["protein"],
                carbohydrates=item["carbohydrates"],
                total_fat=item["total_fat"],
                fiber=item["fiber"],
                sugar=item["sugar"],
                sodium_mg=item["sodium_mg"]
            )
            db.add(rec)
        db.commit()
        print(f"✓ Seeded {len(VERIFIED_NUTRITION_DB)} verified food nutrition items into database.")

    # 2. Check if Recipe data already seeded
    if db.query(Recipe).first():
        db.close()
        return

    print("Seeding NutriBite AI database with initial culinary assets and recipes...")

    # 3. Create Default Demo User
    demo_user = db.query(User).filter(User.email == "alex@nutribite.ai").first()
    if not demo_user:
        demo_user = User(
            name="Chef Alex",
            email="alex@nutribite.ai",
            hashed_password="pbkdf2:sha256:demo_hashed_password",
            avatar="👨‍🍳"
        )
        db.add(demo_user)
        db.flush()

        preferences = UserPreferences(
            user_id=demo_user.id,
            goal="Maintain Vitality & Fitness",
            daily_calorie_target=2100.0,
            protein_target_g=125.0,
            carbs_target_g=230.0,
            fat_target_g=65.0,
            fiber_target_g=32.0,
            water_target_ml=2500.0,
            dietary_preferences="Balanced, High-Protein",
            food_allergies="",
            cuisine_preferences="International, Pakistani, Italian"
        )
        db.add(preferences)

    # 4. Seed Initial Recipes (International & Pakistani Cuisine)
    recipes_data = [
        {
            "title": "Authentic Karachi Chicken Biryani",
            "description": "Fragrant basmati rice layered with spiced chicken, caramelized onions, fresh mint, and aromatic saffron.",
            "category": "Dinner",
            "cuisine": "Pakistani",
            "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
            "video_url": "https://www.youtube.com/watch?v=0kH8fM6-KGE",
            "prep_time": 25,
            "cook_time": 40,
            "servings": 6,
            "difficulty": "Medium",
            "calories": 480.0,
            "protein": 32.0,
            "carbs": 58.0,
            "fat": 14.0,
            "ingredients": [
                ("Aged Basmati Rice", 500, "g", "Grains"),
                ("Chicken Pieces", 750, "g", "Meat"),
                ("Greek Yogurt", 200, "g", "Dairy"),
                ("Onions (Sliced)", 3, "medium", "Produce"),
                ("Ginger Garlic Paste", 2, "tbsp", "Produce"),
                ("Desi Ghee", 3, "tbsp", "Dairy"),
                ("Biryani Spice Blend", 2, "tbsp", "Spices")
            ],
            "steps": [
                "Soak washed basmati rice in water for 30 minutes; parboil with whole spices for 5 minutes.",
                "In a heavy-bottom pot, brown sliced onions in ghee until deeply golden.",
                "Sear chicken with ginger-garlic paste and biryani spices until aromatic.",
                "Stir in yogurt and tomatoes; simmer until gravy is rich and oil surfaces.",
                "Layer rice over chicken gravy, scatter fresh mint and saffron milk, seal pot and steam (Dum) for 15 minutes."
            ]
        },
        {
            "title": "Lahori Mutton Karahi Wok",
            "description": "Succulent mutton wok-seared on high heat with fresh juicy tomatoes, ginger juliennes, and cracked black pepper.",
            "category": "Dinner",
            "cuisine": "Pakistani",
            "image_url": "https://images.unsplash.com/photo-1545247181-516773cae754?w=800&q=80",
            "video_url": "https://www.youtube.com/watch?v=qXPhVYpQLPA",
            "prep_time": 15,
            "cook_time": 45,
            "servings": 4,
            "difficulty": "Medium",
            "calories": 520.0,
            "protein": 42.0,
            "carbs": 10.0,
            "fat": 34.0,
            "ingredients": [
                ("Bone-in Mutton Pieces", 800, "g", "Meat"),
                ("Ripe Red Tomatoes", 5, "medium", "Produce"),
                ("Fresh Ginger (Julienned)", 2, "tbsp", "Produce"),
                ("Green Chilies", 4, "pieces", "Produce"),
                ("Freshly Ground Black Pepper", 1, "tbsp", "Spices"),
                ("Pure Ghee", 3, "tbsp", "Dairy")
            ],
            "steps": [
                "Simmer bone-in mutton with garlic and a cup of water until 80% tender.",
                "Transfer to an iron karahi wok over roaring heat with ghee and halved tomatoes.",
                "Cover to steam off tomato skins, then mash pulp into a rich reduction.",
                "Stir-fry vigorously (Bhunai) until oil separates and coats meat.",
                "Finish with cracked black pepper and fresh ginger juliennes. Serve with tandoori roti."
            ]
        },
        {
            "title": "Classic Neapolitan Margherita Pizza",
            "description": "Fermented artisan crust topped with crushed San Marzano tomatoes, fresh buffalo mozzarella, and fragrant sweet basil.",
            "category": "Dinner",
            "cuisine": "Italian",
            "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
            "video_url": "https://www.youtube.com/watch?v=1-SJGQ2HLp8",
            "prep_time": 20,
            "cook_time": 8,
            "servings": 2,
            "difficulty": "Easy",
            "calories": 570.0,
            "protein": 24.0,
            "carbs": 72.0,
            "fat": 21.0,
            "ingredients": [
                ("00 Pizza Dough", 250, "g", "Grains"),
                ("San Marzano Crushed Tomatoes", 100, "g", "Produce"),
                ("Fresh Mozzarella", 125, "g", "Dairy"),
                ("Sweet Basil Leaves", 8, "leaves", "Produce"),
                ("Extra Virgin Olive Oil", 1, "tbsp", "Other")
            ],
            "steps": [
                "Preheat oven with pizza steel to 250°C (480°F) for 45 minutes.",
                "Stretch dough by hand from center outward, leaving an airy 1-inch crust edge.",
                "Spread crushed tomatoes evenly, tear fresh mozzarella over top, and drizzle olive oil.",
                "Bake for 7-9 minutes until crust blistered and cheese melted. Top with sweet fresh basil."
            ]
        },
        {
            "title": "Tuscan Garlic Herb Chicken & Fettuccine",
            "description": "Golden pan-seared chicken breast tossed in velvety parmesan cream, sun-dried tomatoes, and tender baby spinach.",
            "category": "Dinner",
            "cuisine": "Italian",
            "image_url": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
            "video_url": "https://www.youtube.com/watch?v=bJUiWdM__Qw",
            "prep_time": 10,
            "cook_time": 20,
            "servings": 4,
            "difficulty": "Easy",
            "calories": 540.0,
            "protein": 38.0,
            "carbs": 52.0,
            "fat": 20.0,
            "ingredients": [
                ("Fettuccine Pasta", 300, "g", "Grains"),
                ("Chicken Breast", 400, "g", "Meat"),
                ("Heavy Cream", 200, "ml", "Dairy"),
                ("Parmigiano-Reggiano", 60, "g", "Dairy"),
                ("Baby Spinach", 100, "g", "Produce"),
                ("Garlic Cloves (Minced)", 4, "cloves", "Produce")
            ],
            "steps": [
                "Boil fettuccine in salted water until al dente; reserve 1/2 cup pasta cooking water.",
                "Season chicken with Italian herbs, sear in olive oil until golden brown on both sides, slice and set aside.",
                "In the same pan, saute minced garlic, add cream and simmer gently for 3 minutes.",
                "Stir in freshly grated parmesan and spinach until wilted.",
                "Toss cooked fettuccine and sliced chicken into sauce until luxuriously coated."
            ]
        }
    ]

    for item in recipes_data:
        r = Recipe(
            title=item["title"],
            description=item["description"],
            category=item["category"],
            cuisine=item["cuisine"],
            image_url=item["image_url"],
            video_url=item["video_url"],
            prep_time_minutes=item["prep_time"],
            cook_time_minutes=item["cook_time"],
            servings=item["servings"],
            difficulty=item["difficulty"],
            calories_per_serving=item["calories"],
            protein_per_serving=item["protein"],
            carbs_per_serving=item["carbs"],
            fat_per_serving=item["fat"],
            rating=4.9
        )
        db.add(r)
        db.flush()

        for ing in item["ingredients"]:
            db.add(RecipeIngredient(recipe_id=r.id, name=ing[0], quantity=ing[1], unit=ing[2], category=ing[3]))

        for step_idx, step_text in enumerate(item["steps"]):
            db.add(RecipeInstruction(recipe_id=r.id, step_number=step_idx + 1, instruction=step_text))

    # 5. Seed Sample Grocery List
    g_list = GroceryList(user_id=demo_user.id, title="Weekly Market Run")
    db.add(g_list)
    db.flush()

    grocery_samples = [
        ("Aged Basmati Rice", "1 kg", "Grains", False),
        ("Fresh Chicken Breast", "800g", "Meat", False),
        ("Greek Yogurt", "500g", "Dairy", True),
        ("Fresh Spinach", "250g", "Produce", False),
        ("Garlic & Ginger", "1 bunch", "Produce", True),
        ("Parmigiano-Reggiano", "1 wedge", "Dairy", False),
        ("Mustard Oil / Desi Ghee", "1 jar", "Other", False)
    ]
    for name, qty, cat, checked in grocery_samples:
        db.add(GroceryItem(grocery_list_id=g_list.id, name=name, quantity=qty, category=cat, is_checked=checked))

    db.commit()
    db.close()
    print("Database seeding completed successfully with complete nutrition database!")

if __name__ == "__main__":
    seed_database()
