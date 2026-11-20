/**
 * NutriBite AI Mobile - Screen 10: Recipe Details & Dynamic Scaler
 * Part 11 Master Prompt: Food photograph, title, ingredients, prep/cook time,
 * step-by-step cooking instructions, dynamic serving-size adjustments, and grocery sync.
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNutriBiteStore } from "../../src/store/useNutriBiteStore";
import { colors } from "../../src/theme/colors";

const RECIPE_DATA: Record<number, any> = {
  1: {
    id: 1,
    title: "Karachi Chicken Biryani",
    category: "Dinner",
    cuisine: "Pakistani",
    prepTime: "25 min",
    cookTime: "40 min",
    difficulty: "Medium",
    baseServings: 4,
    caloriesPerServing: 480,
    protein: 34,
    carbs: 62,
    fat: 14,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    ingredients: [
      { name: "Aged Basmati Rice", baseAmount: 500, unit: "g", category: "Grains" },
      { name: "Chicken Thighs/Bone-in", baseAmount: 800, unit: "g", category: "Meat & Protein" },
      { name: "Thinly Sliced Golden Onions", baseAmount: 3, unit: "medium", category: "Vegetables" },
      { name: "Whole Milk Plain Yogurt", baseAmount: 200, unit: "g", category: "Dairy" },
      { name: "Fresh Ginger-Garlic Paste", baseAmount: 2, unit: "tbsp", category: "Spices" },
      { name: "Pure Saffron soaked in Milk", baseAmount: 1, unit: "pinch", category: "Spices" },
      { name: "Pure Desi Ghee", baseAmount: 3, unit: "tbsp", category: "Dairy" }
    ],
    instructions: [
      "Wash basmati rice until water runs clear; soak in cold water for 30 minutes.",
      "In a heavy-bottomed pot, fry sliced onions in ghee until deeply caramelized and crisp; reserve half for garnish.",
      "Add chicken, ginger-garlic paste, ground spices, and whisked yogurt. Bhunno (sear) on medium-high heat for 12 minutes until aromatic oil separates.",
      "Boil soaked rice in heavily salted water with whole spices until 70% cooked (firm core). Drain completely.",
      "Layer cooked chicken gravy, drained rice, fried onions, fresh mint leaves, and saffron milk.",
      "Seal lid with foil or dough; cook on Dum (gentle steam) over low heat for 20 minutes. Rest 5 minutes before gently fluffing."
    ]
  }
};

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addGroceryItem, favorites, toggleFavorite } = useNutriBiteStore();

  const recipeId = Number(id) || 1;
  const recipe = RECIPE_DATA[recipeId] || RECIPE_DATA[1];
  const [servings, setServings] = useState(recipe.baseServings);

  const scaleFactor = servings / recipe.baseServings;
  const isFav = favorites.includes(recipe.id);

  const handleAddAllToGroceries = () => {
    recipe.ingredients.forEach((ing: any) => {
      const scaledAmount = Math.round(ing.baseAmount * scaleFactor * 10) / 10;
      addGroceryItem({
        name: ing.name,
        quantity: `${scaledAmount} ${ing.unit}`,
        category: ing.category
      });
    });
    Alert.alert("Ingredients Added", `Added ${recipe.ingredients.length} items to your Smart Grocery List!`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
      {/* Hero Image */}
      <View style={styles.heroWrapper}>
        <Image source={{ uri: recipe.image }} style={styles.heroImg} />
        <TouchableOpacity style={styles.favFloatingBtn} onPress={() => toggleFavorite(recipe.id)}>
          <Text style={{ fontSize: 20 }}>{isFav ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.tagsRow}>
          <Text style={styles.cuisineTag}>{recipe.cuisine}</Text>
          <Text style={styles.timeTag}>⏱ {recipe.prepTime} prep • {recipe.cookTime} cook</Text>
        </View>

        <Text style={styles.title}>{recipe.title}</Text>

        {/* Dynamic Servings Adjuster */}
        <View style={styles.servingsAdjusterCard}>
          <View>
            <Text style={styles.servingsTitle}>Serving Size</Text>
            <Text style={styles.servingsSub}>Scale ingredients dynamically</Text>
          </View>
          <View style={styles.counterRow}>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setServings(Math.max(1, servings - 1))}
            >
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{servings} portions</Text>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setServings(servings + 1)}
            >
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nutritional Facts Summary */}
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionBadge}>
            <Text style={styles.nutrValue}>{recipe.caloriesPerServing}</Text>
            <Text style={styles.nutrLabel}>kcal / serving</Text>
          </View>
          <View style={styles.nutritionBadge}>
            <Text style={styles.nutrValue}>{recipe.protein}g</Text>
            <Text style={styles.nutrLabel}>Protein</Text>
          </View>
          <View style={styles.nutritionBadge}>
            <Text style={styles.nutrValue}>{recipe.carbs}g</Text>
            <Text style={styles.nutrLabel}>Carbs</Text>
          </View>
          <View style={styles.nutritionBadge}>
            <Text style={styles.nutrValue}>{recipe.fat}g</Text>
            <Text style={styles.nutrLabel}>Fat</Text>
          </View>
        </View>

        {/* Ingredients Checklist */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity onPress={handleAddAllToGroceries}>
              <Text style={styles.addGroceriesText}>+ Add to Grocery List</Text>
            </TouchableOpacity>
          </View>

          {recipe.ingredients.map((ing: any, idx: number) => {
            const scaled = Math.round(ing.baseAmount * scaleFactor * 10) / 10;
            return (
              <View key={idx} style={styles.ingredientRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.ingName}>{ing.name}</Text>
                <Text style={styles.ingAmount}>{scaled} {ing.unit}</Text>
              </View>
            );
          })}
        </View>

        {/* Step-by-Step Cooking Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
          {recipe.instructions.map((step: string, idx: number) => (
            <View key={idx} style={styles.instructionStep}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    paddingBottom: 40,
  },
  heroWrapper: {
    position: "relative",
    height: 240,
  },
  heroImg: {
    width: "100%",
    height: "100%",
  },
  favFloatingBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 999,
  },
  body: {
    padding: 18,
  },
  tagsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cuisineTag: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    textTransform: "uppercase",
  },
  timeTag: {
    fontSize: 11,
    color: colors.charcoalMuted,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.charcoal,
    marginBottom: 16,
  },
  servingsAdjusterCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.creamCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    marginBottom: 16,
  },
  servingsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.charcoal,
  },
  servingsSub: {
    fontSize: 11,
    color: colors.charcoalMuted,
    marginTop: 2,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  counterValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.charcoal,
  },
  nutritionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  nutritionBadge: {
    flex: 1,
    backgroundColor: colors.creamCard,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  nutrValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  nutrLabel: {
    fontSize: 9,
    color: colors.charcoalMuted,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.charcoal,
    marginBottom: 12,
  },
  addGroceriesText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamBorder,
  },
  bullet: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
  },
  ingName: {
    flex: 1,
    fontSize: 13,
    color: colors.charcoal,
  },
  ingAmount: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.charcoalMuted,
  },
  instructionStep: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: colors.charcoal,
    lineHeight: 19,
  },
});
