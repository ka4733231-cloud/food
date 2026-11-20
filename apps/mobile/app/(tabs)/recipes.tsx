/**
 * NutriBite AI Mobile - Screen 9: Recipe Discovery
 * Part 10 Master Prompt: Recipe categories (Breakfast, Lunch, Dinner, Snacks,
 * Pakistani cuisine, International cuisine), search filters, and favorite recipes.
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNutriBiteStore } from "../../src/store/useNutriBiteStore";
import { useDeviceLayout } from "../../src/hooks/useDeviceLayout";
import { colors } from "../../src/theme/colors";

// Verified Recipe Database (MOB & Calz Inspired)
const SAMPLE_RECIPES = [
  {
    id: 1,
    title: "Karachi Chicken Biryani",
    category: "Dinner",
    cuisine: "Pakistani",
    prepTime: "25 min",
    cookTime: "40 min",
    difficulty: "Medium",
    servings: 4,
    calories: 480,
    protein: 34,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80"
  },
  {
    id: 2,
    title: "Lahori Mutton Karahi",
    category: "Dinner",
    cuisine: "Pakistani",
    prepTime: "15 min",
    cookTime: "35 min",
    difficulty: "Medium",
    servings: 4,
    calories: 420,
    protein: 38,
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=500&q=80"
  },
  {
    id: 3,
    title: "Tarka Daal with Jeera Rice",
    category: "Lunch",
    cuisine: "Pakistani",
    prepTime: "10 min",
    cookTime: "25 min",
    difficulty: "Easy",
    servings: 3,
    calories: 310,
    protein: 16,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80"
  },
  {
    id: 4,
    title: "Mediterranean Lemon Herb Salmon",
    category: "Dinner",
    cuisine: "International",
    prepTime: "10 min",
    cookTime: "18 min",
    difficulty: "Easy",
    servings: 2,
    calories: 390,
    protein: 42,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80"
  },
  {
    id: 5,
    title: "Warm Rolled Oatmeal Bowl",
    category: "Breakfast",
    cuisine: "International",
    prepTime: "5 min",
    cookTime: "8 min",
    difficulty: "Easy",
    servings: 1,
    calories: 240,
    protein: 10,
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&q=80"
  },
  {
    id: 6,
    title: "Slow-Cooked Beef Nihari",
    category: "Dinner",
    cuisine: "Pakistani",
    prepTime: "20 min",
    cookTime: "120 min",
    difficulty: "Hard",
    servings: 6,
    calories: 520,
    protein: 45,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80"
  }
];

const CATEGORIES = ["All", "Pakistani", "Breakfast", "Lunch", "Dinner", "International"];

export default function RecipeDiscoveryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isTablet, recipeGridColumns } = useDeviceLayout();
  const { favorites, toggleFavorite } = useNutriBiteStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = SAMPLE_RECIPES.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      r.category === selectedCategory ||
      r.cuisine === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.kicker}>Culinary Library</Text>
      <Text style={styles.title}>Recipe Discovery</Text>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes, Pakistani dishes, ingredients..."
          placeholderTextColor={colors.charcoalMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories Horizontal Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipe Grid / List */}
      <View style={[styles.recipeGrid, { flexDirection: isTablet ? "row" : "column", flexWrap: isTablet ? "wrap" : "nowrap" }]}>
        {filtered.map((r) => {
          const isFav = favorites.includes(r.id);
          return (
            <TouchableOpacity
              key={r.id}
              style={[styles.recipeCard, isTablet && { width: `${Math.floor(100 / recipeGridColumns) - 2}%` }]}
              onPress={() => router.push(`/recipe/${r.id}`)}
            >
              <Image source={{ uri: r.image }} style={styles.recipeImg} />

              <TouchableOpacity
                style={styles.favBadge}
                onPress={() => toggleFavorite(r.id)}
              >
                <Text style={{ fontSize: 16 }}>{isFav ? "❤️" : "🤍"}</Text>
              </TouchableOpacity>

              <View style={styles.recipeInfo}>
                <View style={styles.recipeHeaderRow}>
                  <Text style={styles.recipeCuisineTag}>{r.cuisine}</Text>
                  <Text style={styles.recipeTime}>{r.prepTime} prep</Text>
                </View>

                <Text style={styles.recipeTitle}>{r.title}</Text>

                <View style={styles.recipeNutritionFooter}>
                  <Text style={styles.recipeCal}>{r.calories} kcal</Text>
                  <Text style={styles.recipeProtein}>{r.protein}g protein</Text>
                  <Text style={styles.recipeDiff}>{r.difficulty}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    padding: 16,
    paddingBottom: 40,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.charcoal,
    marginBottom: 14,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.creamCard,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.charcoal,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContent: {
    gap: 8,
  },
  catChip: {
    backgroundColor: colors.creamCard,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  catChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.charcoal,
  },
  catChipTextActive: {
    color: "#fff",
  },
  recipeGrid: {
    gap: 14,
  },
  recipeCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.creamBorder,
    position: "relative",
  },
  recipeImg: {
    width: "100%",
    height: 160,
  },
  favBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 6,
    borderRadius: 999,
  },
  recipeInfo: {
    padding: 14,
  },
  recipeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  recipeCuisineTag: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    textTransform: "uppercase",
  },
  recipeTime: {
    fontSize: 11,
    color: colors.charcoalMuted,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.charcoal,
    marginBottom: 8,
  },
  recipeNutritionFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.creamBorder,
  },
  recipeCal: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.accentOrange,
  },
  recipeProtein: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  recipeDiff: {
    fontSize: 11,
    color: colors.charcoalMuted,
    marginLeft: "auto",
  },
});
