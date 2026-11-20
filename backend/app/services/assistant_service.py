"""
AI Nutrition Assistant Service for NutriBite AI.
Provides conversational nutritional education, ingredient substitutions,
and meal ideas with strict safety disclaimers (no medical diagnosis or extreme diets).
"""

import os
from typing import Dict, Any, List

LLM_API_KEY = os.getenv("LLM_API_KEY", "")

class AssistantService:
    def __init__(self):
        self.safety_disclaimer = (
            "⚠️ Disclaimer: NutriBite AI provides general educational nutrition insights and culinary tips. "
            "It does not diagnose medical conditions, treat illnesses, or replace advice from a registered dietitian or doctor."
        )

    def process_query(self, user_message: str) -> Dict[str, Any]:
        """Generates safe, intelligent, and context-aware nutrition responses."""
        msg = user_message.lower()

        # Check for medical diagnosis queries
        if any(w in msg for w in ["cure", "disease", "diabetes treatment", "cancer", "prescribe", "medicine", "pill"]):
            return {
                "reply": (
                    "I cannot diagnose health conditions or prescribe clinical treatments. "
                    "For health concerns or managing chronic conditions, please consult a qualified healthcare provider or certified clinical dietitian. "
                    "However, I can share balanced, nutrient-dense whole food recipes that support overall wellness!"
                ),
                "suggested_recipes": ["Mediterranean Garden Salad", "Yellow Lentil Daal with Rice"],
                "disclaimer": self.safety_disclaimer
            }

        # Substitutions
        if "substitute" in msg or "replacement" in msg or "alternative" in msg:
            return {
                "reply": (
                    "Here are popular culinary substitutions:\n"
                    "• **For Heavy Cream:** Greek yogurt or blended silken tofu with a splash of milk for a high-protein, low-fat alternative.\n"
                    "• **For White Rice:** Quinoa, riced cauliflower, or brown basmati for more fiber and sustained energy.\n"
                    "• **For Butter in Baking:** Mashed avocado, applesauce, or extra virgin olive oil in savory pans.\n"
                    "• **For Eggs in Baking:** 1 tbsp ground chia or flaxseed soaked in 3 tbsp warm water."
                ),
                "suggested_recipes": ["Warm Rolled Oatmeal with Berries", "Creamy Palak Paneer"],
                "disclaimer": self.safety_disclaimer
            }

        # High-protein query
        if "protein" in msg or "muscle" in msg:
            return {
                "reply": (
                    "To hit a high-protein goal without excess saturated fat, prioritize lean poultry, Greek yogurt, lentils (daal), "
                    "eggs, and fish. For instance, 170g of grilled chicken breast provides ~52g of high-quality protein with negligible carbs."
                ),
                "suggested_recipes": ["Herb Grilled Chicken Breast", "Mutton Karahi", "Yellow Lentil Daal with Rice"],
                "disclaimer": self.safety_disclaimer
            }

        # Pakistani / South Asian cuisine inquiry
        if any(w in msg for w in ["pakistani", "biryani", "karahi", "nihari", "desi", "south asian"]):
            return {
                "reply": (
                    "South Asian cuisine is packed with antioxidant-rich spices like turmeric, cumin, ginger, and garlic! "
                    "To make Pakistani meals even healthier, use measured ghee or cold-pressed mustard/olive oil, incorporate whole-grain tandoori roti instead of refined naan, "
                    "and pair rich curries like Karahi with fresh cucumber-tomato kachumber salad."
                ),
                "suggested_recipes": ["Chicken Biryani", "Mutton Karahi", "Yellow Lentil Daal with Rice", "Slow-Cooked Beef Nihari"],
                "disclaimer": self.safety_disclaimer
            }

        # General response
        return {
            "reply": (
                f"Great question! In a balanced lifestyle, food should nourish your body and delight your palate. "
                f"Focus on hitting your daily targets for protein, complex carbohydrates, healthy fats, and adequate hydration (aim for 2.5L daily). "
                f"Would you like meal recommendations based on what's currently in your kitchen?"
            ),
            "suggested_recipes": ["Chicken Biryani", "Creamy Tuscan Garlic Pasta", "Mediterranean Garden Salad"],
            "disclaimer": self.safety_disclaimer
        }

assistant_service = AssistantService()
