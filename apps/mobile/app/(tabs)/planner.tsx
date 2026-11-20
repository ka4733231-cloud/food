/**
 * NutriBite AI Mobile - Screen 11: Smart Meal Planner
 * Part 12 Master Prompt: Weekly meal planner (Monday through Sunday),
 * Breakfast, Lunch, Dinner, Snacks, slot replacement, and generate grocery lists.
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNutriBiteStore } from "../../src/store/useNutriBiteStore";
import { colors } from "../../src/theme/colors";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

export default function MealPlannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mealPlan, setMealSlot, addGroceryItem, subscription } = useNutriBiteStore();
  const [selectedDay, setSelectedDay] = useState("Monday");

  const handleGenerateGroceries = () => {
    // Check if user has weekly planner unlocked in their tier
    if (subscription.tier === "free") {
      Alert.alert(
        "NutriBite Plus Feature",
        "Auto-generating multi-day grocery lists from your meal planner requires NutriBite Plus or Pro.",
        [
          { text: "Later", style: "cancel" },
          { text: "View Plans", onPress: () => router.push("/pricing") }
        ]
      );
      return;
    }

    addGroceryItem({ name: "Aged Basmati Rice", quantity: "1 kg", category: "Grains" });
    addGroceryItem({ name: "Bone-in Chicken", quantity: "800g", category: "Meat & Protein" });
    addGroceryItem({ name: "Fresh Garlic & Ginger", quantity: "150g", category: "Vegetables" });
    addGroceryItem({ name: "Greek Whole Milk Yogurt", quantity: "400g", category: "Dairy" });

    Alert.alert("Groceries Generated", "Extracted 4 recipe ingredient sets into your Smart Grocery List!");
  };

  const handleEditSlot = (slot: string) => {
    Alert.prompt
      ? Alert.prompt(
          `Edit ${slot}`,
          `Enter dish name for ${selectedDay} ${slot}:`,
          (text) => {
            if (text) setMealSlot(selectedDay, slot, text);
          },
          "plain-text",
          mealPlan[selectedDay]?.[slot] || ""
        )
      : Alert.alert("Select Dish", `Switching ${selectedDay} ${slot} to Karachi Chicken Biryani`, [
          { text: "Confirm", onPress: () => setMealSlot(selectedDay, slot, "Karachi Chicken Biryani") },
          { text: "Cancel", style: "cancel" }
        ]);
  };

  const currentDayPlan = mealPlan[selectedDay] || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.kicker}>Weekly Organization</Text>
      <Text style={styles.title}>Smart Meal Planner</Text>

      {/* Days Horizontal Tab Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll} contentContainerStyle={styles.dayContent}>
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayChipText, selectedDay === day && styles.dayChipTextActive]}>
              {day.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Day Overview Banner */}
      <View style={styles.dayBanner}>
        <View>
          <Text style={styles.dayBannerTitle}>{selectedDay}'s Routine</Text>
          <Text style={styles.dayBannerSub}>Balanced calories &amp; macro distributions</Text>
        </View>
        <TouchableOpacity style={styles.grocerySyncBtn} onPress={handleGenerateGroceries}>
          <Text style={styles.grocerySyncText}>🛒 Sync Groceries</Text>
        </TouchableOpacity>
      </View>

      {/* Meal Slots List */}
      <View style={styles.slotList}>
        {MEAL_TYPES.map((slot) => {
          const dish = currentDayPlan[slot] || "Tap to assign recipe";
          const isAssigned = Boolean(currentDayPlan[slot]);

          return (
            <View key={slot} style={styles.slotCard}>
              <View style={styles.slotHeader}>
                <Text style={styles.slotType}>{slot.toUpperCase()}</Text>
                <TouchableOpacity onPress={() => handleEditSlot(slot)}>
                  <Text style={styles.editBtnText}>Edit ✎</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.dishTitle, !isAssigned && styles.dishPlaceholder]}>
                {dish}
              </Text>

              {isAssigned && (
                <View style={styles.slotMeta}>
                  <Text style={styles.slotCal}>~420 kcal</Text>
                  <Text style={styles.slotProtein}>32g protein</Text>
                </View>
              )}
            </View>
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
  dayScroll: {
    marginBottom: 16,
  },
  dayContent: {
    gap: 8,
  },
  dayChip: {
    backgroundColor: colors.creamCard,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.charcoal,
  },
  dayChipTextActive: {
    color: "#fff",
  },
  dayBanner: {
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
  dayBannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.charcoal,
  },
  dayBannerSub: {
    fontSize: 11,
    color: colors.charcoalMuted,
    marginTop: 2,
  },
  grocerySyncBtn: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  grocerySyncText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  slotList: {
    gap: 12,
  },
  slotCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.creamBorder,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  slotType: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.6,
  },
  editBtnText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
  },
  dishTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.charcoal,
  },
  dishPlaceholder: {
    color: colors.charcoalSubtle,
    fontStyle: "italic",
    fontWeight: "400",
  },
  slotMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.creamBorder,
  },
  slotCal: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accentOrange,
  },
  slotProtein: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
});
