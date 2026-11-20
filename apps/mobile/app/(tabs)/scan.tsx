/**
 * NutriBite AI Mobile - Screen 6 & 7: AI Food Scanner & Recognition Results
 * Part 8 Master Prompt: Image capture/upload, backend processing, confidence score,
 * ingredient identification, editable food names, portion adjustment slider,
 * nutrition calculation, and food diary integration.
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNutriBiteStore } from "../../src/store/useNutriBiteStore";
import { apiClient, FoodScanResult } from "../../src/api/client";
import { colors } from "../../src/theme/colors";

export default function FoodScannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recordScan, logMeal, subscription } = useNutriBiteStore();

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<FoodScanResult | null>(null);
  const [portionGrams, setPortionGrams] = useState(300);

  const handleSimulateScan = async (hint?: string) => {
    // Check quota first
    const canScan = recordScan();
    if (!canScan) {
      Alert.alert(
        "Scan Limit Reached",
        `You have used your daily vision scans for the ${subscription.tier.toUpperCase()} tier. Upgrade for up to 150 scans/day.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Upgrade Plan", onPress: () => router.push("/pricing") }
        ]
      );
      return;
    }

    setIsScanning(true);
    try {
      const result = await apiClient.scanImage("", hint || "Karachi Chicken Biryani");
      setScanResult(result);
      setPortionGrams(result.estimated_portion_grams || 300);
    } catch (e: any) {
      Alert.alert("Scan Error", e.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePortionChange = (newGrams: number) => {
    setPortionGrams(newGrams);
  };

  const handleCommitLog = () => {
    if (!scanResult) return;
    const factor = portionGrams / (scanResult.estimated_portion_grams || 100);
    const cal = Math.round(scanResult.estimated_nutrition.calories * factor);
    const p = Math.round(scanResult.estimated_nutrition.protein * factor * 10) / 10;
    const c = Math.round(scanResult.estimated_nutrition.carbohydrates * factor * 10) / 10;
    const f = Math.round(scanResult.estimated_nutrition.total_fat * factor * 10) / 10;
    const fib = Math.round(scanResult.estimated_nutrition.fiber * factor * 10) / 10;

    logMeal({
      name: scanResult.predicted_food_name,
      mealType: "Lunch",
      portionGrams,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib
    });

    Alert.alert("Meal Logged", `${scanResult.predicted_food_name} (${cal} kcal) added to your Food Diary!`, [
      { text: "View Home", onPress: () => router.push("/(tabs)") }
    ]);
  };

  // Scaled values
  const factor = scanResult ? portionGrams / (scanResult.estimated_portion_grams || 100) : 1;
  const scaledCal = scanResult ? Math.round(scanResult.estimated_nutrition.calories * factor) : 0;
  const scaledProtein = scanResult ? Math.round(scanResult.estimated_nutrition.protein * factor * 10) / 10 : 0;
  const scaledCarbs = scanResult ? Math.round(scanResult.estimated_nutrition.carbohydrates * factor * 10) / 10 : 0;
  const scaledFat = scanResult ? Math.round(scanResult.estimated_nutrition.total_fat * factor * 10) / 10 : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.kicker}>AI Spectral Vision</Text>
      <Text style={styles.title}>Food &amp; Macro Scanner</Text>

      {/* Simulated Camera Viewfinder */}
      <View style={styles.viewfinder}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80" }}
          style={styles.viewfinderImg}
        />
        <View style={styles.laserLine} />
        <View style={styles.viewfinderBadge}>
          <Text style={styles.viewfinderBadgeText}>{isScanning ? "Analyzing..." : "Ready to Scan"}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.primaryScanBtn, isScanning && styles.btnDisabled]}
          onPress={() => handleSimulateScan("Karachi Chicken Biryani")}
          disabled={isScanning}
        >
          <Text style={styles.primaryScanBtnText}>
            {isScanning ? "Processing..." : "Capture & Scan Meal 📷"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Select Presets for testing */}
      <View style={styles.presetRow}>
        <Text style={styles.presetLabel}>Test Identification:</Text>
        <TouchableOpacity style={styles.presetChip} onPress={() => handleSimulateScan("Lahori Mutton Karahi")}>
          <Text style={styles.presetChipText}>Mutton Karahi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetChip} onPress={() => handleSimulateScan("Tarka Daal")}>
          <Text style={styles.presetChipText}>Tarka Daal</Text>
        </TouchableOpacity>
      </View>

      {/* Scan Results Card */}
      {scanResult && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.resultName}>{scanResult.predicted_food_name}</Text>
              <Text style={styles.resultMeta}>{scanResult.category} • {scanResult.cuisine}</Text>
            </View>
            <View style={styles.confidencePill}>
              <Text style={styles.confidenceText}>{scanResult.confidence_score}% Match</Text>
            </View>
          </View>

          {/* Portion Calibrator */}
          <View style={styles.portionSection}>
            <View style={styles.portionLabelRow}>
              <Text style={styles.portionTitle}>Serving Size Calibration:</Text>
              <Text style={styles.portionGramsValue}>{portionGrams}g</Text>
            </View>

            <View style={styles.portionButtonRow}>
              {[150, 250, 300, 450, 600].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.portionBtn, portionGrams === g && styles.portionBtnActive]}
                  onPress={() => handlePortionChange(g)}
                >
                  <Text style={[styles.portionBtnText, portionGrams === g && styles.portionBtnTextActive]}>
                    {g}g
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* FDA Nutrition Facts Grid */}
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionPill}>
              <Text style={styles.nutrValue}>{scaledCal}</Text>
              <Text style={styles.nutrLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionPill}>
              <Text style={styles.nutrValue}>{scaledProtein}g</Text>
              <Text style={styles.nutrLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionPill}>
              <Text style={styles.nutrValue}>{scaledCarbs}g</Text>
              <Text style={styles.nutrLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionPill}>
              <Text style={styles.nutrValue}>{scaledFat}g</Text>
              <Text style={styles.nutrLabel}>Fat</Text>
            </View>
          </View>

          {/* Commit Button */}
          <TouchableOpacity style={styles.commitBtn} onPress={handleCommitLog}>
            <Text style={styles.commitBtnText}>Log {portionGrams}g to Food Diary ✓</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 16,
  },
  viewfinder: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
    marginBottom: 16,
  },
  viewfinderImg: {
    width: "100%",
    height: "100%",
    opacity: 0.88,
  },
  laserLine: {
    position: "absolute",
    top: "45%",
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: "#22c55e",
    shadowColor: "#22c55e",
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  viewfinderBadge: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  viewfinderBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  actionRow: {
    marginBottom: 14,
  },
  primaryScanBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryScanBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  presetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  presetLabel: {
    fontSize: 11,
    color: colors.charcoalMuted,
  },
  presetChip: {
    backgroundColor: colors.creamCard,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  presetChipText: {
    fontSize: 11,
    color: colors.charcoal,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  resultName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.charcoal,
  },
  resultMeta: {
    fontSize: 12,
    color: colors.charcoalMuted,
    marginTop: 2,
  },
  confidencePill: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#047857",
  },
  portionSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.creamBorder,
  },
  portionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  portionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.charcoal,
  },
  portionGramsValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  portionButtonRow: {
    flexDirection: "row",
    gap: 6,
  },
  portionBtn: {
    flex: 1,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  portionBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  portionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.charcoal,
  },
  portionBtnTextActive: {
    color: "#fff",
  },
  nutritionGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  nutritionPill: {
    flex: 1,
    backgroundColor: colors.secondaryLight,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  nutrValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  nutrLabel: {
    fontSize: 10,
    color: colors.charcoalMuted,
    marginTop: 2,
  },
  commitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  commitBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});
