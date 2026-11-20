/**
 * NutriBite AI Mobile - Screen 5: Home Nutrition Dashboard
 * Part 7 Master Prompt: Daily nutrition summary, calories consumed, protein,
 * carbohydrates, fat, fiber, water intake, today's meals, and scan CTA.
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNutriBiteStore } from "../../src/store/useNutriBiteStore";
import { colors } from "../../src/theme/colors";
import { useDeviceLayout } from "../../src/hooks/useDeviceLayout";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isTablet, contentPadding } = useDeviceLayout();
  const { user, subscription, dailyUsage, foodDiary, waterIntakeMl, addWater } = useNutriBiteStore();

  // Compute daily totals
  const totalCalories = foodDiary.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = foodDiary.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = foodDiary.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = foodDiary.reduce((sum, item) => sum + item.fat, 0);
  const remainingCalories = Math.max(0, user.calorieTarget - totalCalories);
  const caloriePercent = Math.min(100, Math.round((totalCalories / user.calorieTarget) * 100));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingHorizontal: contentPadding }]}
    >
      {/* Top Header Bar */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greetingKicker}>Good Morning, Chef</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <TouchableOpacity
          style={[styles.tierBadge, subscription.tier === "pro" ? styles.tierBadgePro : (subscription.tier === "plus" ? styles.tierBadgePlus : styles.tierBadgeFree)]}
          onPress={() => router.push("/pricing")}
        >
          <Text style={styles.tierBadgeText}>{subscription.tier.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Calorie Budget Card */}
      <View style={styles.calorieCard}>
        <View style={styles.calorieCardHeader}>
          <Text style={styles.calorieCardTitle}>Daily Calorie Target</Text>
          <Text style={styles.calorieCardPill}>{caloriePercent}% Target Reached</Text>
        </View>

        <View style={styles.calorieNumberRow}>
          <View>
            <Text style={styles.calorieBigNumber}>{totalCalories}</Text>
            <Text style={styles.calorieSublabel}>kcal consumed</Text>
          </View>
          <View style={styles.calorieDivider} />
          <View>
            <Text style={[styles.calorieBigNumber, { color: colors.primary }]}>{remainingCalories}</Text>
            <Text style={styles.calorieSublabel}>kcal remaining</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${caloriePercent}%` }]} />
        </View>
      </View>

      {/* Macronutrient Breakdown Grid */}
      <View style={styles.macroGrid}>
        <View style={styles.macroCard}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>{Math.round(totalProtein)}g</Text>
          <Text style={styles.macroTarget}>of {user.proteinTarget}g</Text>
        </View>
        <View style={styles.macroCard}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>{Math.round(totalCarbs)}g</Text>
          <Text style={styles.macroTarget}>of {user.carbsTarget}g</Text>
        </View>
        <View style={styles.macroCard}>
          <Text style={styles.macroLabel}>Healthy Fat</Text>
          <Text style={styles.macroValue}>{Math.round(totalFat)}g</Text>
          <Text style={styles.macroTarget}>of {user.fatTarget}g</Text>
        </View>
      </View>

      {/* Hydration Tracker */}
      <View style={styles.waterCard}>
        <View style={styles.waterInfo}>
          <Text style={styles.waterEmoji}>💧</Text>
          <View>
            <Text style={styles.waterTitle}>Hydration Tracker</Text>
            <Text style={styles.waterAmount}>{waterIntakeMl} ml / {user.waterTarget} ml</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.waterAddBtn} onPress={() => addWater(250)}>
          <Text style={styles.waterAddBtnText}>+250ml</Text>
        </TouchableOpacity>
      </View>

      {/* Quick AI Food Scan Hero CTA */}
      <TouchableOpacity style={styles.scanCta} onPress={() => router.push("/(tabs)/scan")}>
        <View style={styles.scanCtaTextCol}>
          <Text style={styles.scanCtaKicker}>AI SPECTRAL FOOD VISION</Text>
          <Text style={styles.scanCtaTitle}>Scan Today's Meal</Text>
          <Text style={styles.scanCtaSubtitle}>Instant food identification & USDA macro facts</Text>
        </View>
        <Text style={styles.scanCtaIcon}>📷</Text>
      </TouchableOpacity>

      {/* Today's Food Diary */}
      <View style={styles.diarySection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Food Diary</Text>
          <Text style={styles.sectionCount}>{foodDiary.length} meals</Text>
        </View>

        {foodDiary.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            {meal.image ? (
              <Image source={{ uri: meal.image }} style={styles.mealThumb} />
            ) : (
              <View style={[styles.mealThumb, styles.mealThumbPlaceholder]}>
                <Text style={{ fontSize: 22 }}>🍽️</Text>
              </View>
            )}
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealMeta}>
                {meal.mealType} • {meal.portionGrams}g • {meal.time}
              </Text>
            </View>
            <View style={styles.mealCalCol}>
              <Text style={styles.mealCalories}>{meal.calories}</Text>
              <Text style={styles.mealCalUnit}>kcal</Text>
            </View>
          </View>
        ))}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greetingKicker: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.secondaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.charcoal,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tierBadgeFree: {
    backgroundColor: colors.creamBorder,
  },
  tierBadgePlus: {
    backgroundColor: colors.tiers.plusBg,
  },
  tierBadgePro: {
    backgroundColor: colors.tiers.proBg,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.6,
  },
  calorieCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  calorieCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calorieCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.charcoal,
  },
  calorieCardPill: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  calorieNumberRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
  },
  calorieBigNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.accentOrange,
    textAlign: "center",
  },
  calorieSublabel: {
    fontSize: 12,
    color: colors.charcoalMuted,
    textAlign: "center",
    marginTop: 2,
  },
  calorieDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.creamBorder,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.creamBorder,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  macroGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  macroCard: {
    flex: 1,
    backgroundColor: colors.creamCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.charcoalMuted,
    textTransform: "uppercase",
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
    marginVertical: 4,
  },
  macroTarget: {
    fontSize: 10,
    color: colors.charcoalSubtle,
  },
  waterCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  waterInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  waterEmoji: {
    fontSize: 26,
  },
  waterTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e40af",
  },
  waterAmount: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },
  waterAddBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  waterAddBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  scanCta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },
  scanCtaTextCol: {
    flex: 1,
  },
  scanCtaKicker: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.secondary,
    letterSpacing: 0.8,
  },
  scanCtaTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 2,
  },
  scanCtaSubtitle: {
    fontSize: 11,
    color: colors.cream,
    opacity: 0.85,
    marginTop: 2,
  },
  scanCtaIcon: {
    fontSize: 32,
    marginLeft: 14,
  },
  diarySection: {
    marginTop: 8,
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
  },
  sectionCount: {
    fontSize: 12,
    color: colors.charcoalMuted,
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.creamCard,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    marginBottom: 10,
  },
  mealThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  mealThumbPlaceholder: {
    backgroundColor: colors.creamBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.charcoal,
  },
  mealMeta: {
    fontSize: 11,
    color: colors.charcoalMuted,
    marginTop: 2,
  },
  mealCalCol: {
    alignItems: "flex-end",
  },
  mealCalories: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
  },
  mealCalUnit: {
    fontSize: 10,
    color: colors.charcoalMuted,
  },
});
