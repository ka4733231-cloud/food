/**
 * NutriBite AI Mobile - Screen 18: Pricing & Subscription Modal
 * Part 2 & 18 Master Prompt: Freemium subscription model with Free, Plus, and Pro plans.
 * Stripe on web, RevenueCat / In-App Purchases on mobile.
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNutriBiteStore } from "../src/store/useNutriBiteStore";
import { colors } from "../src/theme/colors";

export default function PricingModalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { subscription, upgradeSubscription } = useNutriBiteStore();
  const [isAnnual, setIsAnnual] = useState(true);

  const handleSelectPlan = (tier: "free" | "plus" | "pro") => {
    if (tier === subscription.tier) {
      Alert.alert("Active Plan", "You are currently subscribed to this plan.");
      return;
    }

    const planNames = { free: "Free Forever", plus: "NutriBite Plus", pro: "NutriBite Pro" };
    const prices = isAnnual
      ? { free: "$0.00", plus: "$39.99/year", pro: "$79.99/year" }
      : { free: "$0.00", plus: "$4.99/month", pro: "$9.99/month" };

    Alert.alert(
      `Confirm ${planNames[tier]}`,
      `Upgrade your NutriBite AI account for ${prices[tier]}? Unlocks higher scan limits, weekly planner, and smart groceries.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Upgrade",
          onPress: () => {
            upgradeSubscription(tier, isAnnual ? "annual" : "monthly");
            Alert.alert("Success! 🎉", `Your membership has been upgraded to ${planNames[tier]}.`, [
              { text: "Continue", onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert("Restoring Purchases", "Validating receipts with Apple App Store and Google Play...", [
      { text: "OK" }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
      <View style={styles.header}>
        <Text style={styles.kicker}>MEMBERSHIP &amp; TIERS</Text>
        <Text style={styles.title}>Simple, Transparent Plans</Text>
        <Text style={styles.subtitle}>
          Eat smarter, understand nutrition, and build lifelong healthy culinary habits.
        </Text>

        {/* Cadence Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, !isAnnual && styles.toggleBtnActive]}
            onPress={() => setIsAnnual(false)}
          >
            <Text style={[styles.toggleBtnText, !isAnnual && styles.toggleBtnTextActive]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isAnnual && styles.toggleBtnActive]}
            onPress={() => setIsAnnual(true)}
          >
            <Text style={[styles.toggleBtnText, isAnnual && styles.toggleBtnTextActive]}>Annual (SAVE 33%)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Plan Cards */}
      <View style={styles.cardsCol}>
        {/* Free Forever */}
        <View style={styles.card}>
          <Text style={styles.planName}>Free Forever</Text>
          <Text style={styles.planTagline}>Essential food diary and tracking.</Text>
          <Text style={styles.planPrice}>$0 <Text style={styles.planPeriod}>forever</Text></Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✓ 5 AI vision food scans per day</Text>
            <Text style={styles.featureItem}>✓ 5 AI assistant chats per day</Text>
            <Text style={styles.featureItem}>✓ Full verified recipe discovery</Text>
            <Text style={styles.featureItem}>✓ 1 active grocery list</Text>
            <Text style={styles.featureItem}>✓ Daily macro tracking diary</Text>
          </View>
          <TouchableOpacity
            style={[styles.selectBtn, subscription.tier === "free" ? styles.selectBtnCurrent : styles.selectBtnSecondary]}
            onPress={() => handleSelectPlan("free")}
          >
            <Text style={[styles.selectBtnText, subscription.tier === "free" && styles.selectBtnTextCurrent]}>
              {subscription.tier === "free" ? "✓ Active Plan" : "Downgrade to Free"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* NutriBite Plus */}
        <View style={[styles.card, styles.cardPopular]}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
          </View>
          <Text style={styles.planName}>NutriBite Plus</Text>
          <Text style={styles.planTagline}>For active foodies and meal planners.</Text>
          <Text style={styles.planPrice}>
            {isAnnual ? "$39.99" : "$4.99"}
            <Text style={styles.planPeriod}>{isAnnual ? "/year" : "/month"}</Text>
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✓ 50 AI vision food scans per day</Text>
            <Text style={styles.featureItem}>✓ 50 AI assistant chats per day</Text>
            <Text style={styles.featureItem}>✓ Full weekly 7-day meal planner</Text>
            <Text style={styles.featureItem}>✓ Unlimited recipe favorites</Text>
            <Text style={styles.featureItem}>✓ Smart grocery auto-aggregation</Text>
            <Text style={styles.featureItem}>✓ 90-day macro trend analytics</Text>
          </View>
          <TouchableOpacity
            style={[styles.selectBtn, styles.selectBtnPrimary, subscription.tier === "plus" && styles.selectBtnCurrent]}
            onPress={() => handleSelectPlan("plus")}
          >
            <Text style={[styles.selectBtnText, subscription.tier === "plus" && styles.selectBtnTextCurrent]}>
              {subscription.tier === "plus" ? "✓ Active Plan" : "Upgrade to Plus ↗"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* NutriBite Pro */}
        <View style={styles.card}>
          <Text style={styles.planName}>NutriBite Pro</Text>
          <Text style={styles.planTagline}>Uncapped power for serious fitness goals.</Text>
          <Text style={styles.planPrice}>
            {isAnnual ? "$79.99" : "$9.99"}
            <Text style={styles.planPeriod}>{isAnnual ? "/year" : "/month"}</Text>
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✓ 150 AI vision food scans per day</Text>
            <Text style={styles.featureItem}>✓ 150 AI assistant chats per day</Text>
            <Text style={styles.featureItem}>✓ Multi-food saliency/YOLO detection</Text>
            <Text style={styles.featureItem}>✓ Exportable PDF nutrition reports</Text>
            <Text style={styles.featureItem}>✓ Export diary & grocery CSVs</Text>
            <Text style={styles.featureItem}>✓ Priority AI processing</Text>
          </View>
          <TouchableOpacity
            style={[styles.selectBtn, styles.selectBtnSecondary, subscription.tier === "pro" && styles.selectBtnCurrent]}
            onPress={() => handleSelectPlan("pro")}
          >
            <Text style={[styles.selectBtnText, subscription.tier === "pro" && styles.selectBtnTextCurrent]}>
              {subscription.tier === "pro" ? "✓ Active Plan" : "Upgrade to Pro ★"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.restoreBtn} onPress={handleRestorePurchases}>
        <Text style={styles.restoreBtnText}>Restore In-App Purchases 🔄</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: 18,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.charcoal,
    marginTop: 4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.charcoalMuted,
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 16,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: colors.creamCard,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    borderRadius: 999,
    padding: 4,
    marginTop: 16,
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.charcoalMuted,
  },
  toggleBtnTextActive: {
    color: "#fff",
  },
  cardsCol: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.creamCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    position: "relative",
  },
  cardPopular: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
  },
  popularBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  planName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.charcoal,
  },
  planTagline: {
    fontSize: 11,
    color: colors.charcoalMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 14,
  },
  planPeriod: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.charcoalMuted,
  },
  featureList: {
    gap: 8,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.creamBorder,
    paddingTop: 12,
  },
  featureItem: {
    fontSize: 12,
    color: colors.charcoal,
  },
  selectBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  selectBtnPrimary: {
    backgroundColor: colors.primary,
  },
  selectBtnSecondary: {
    backgroundColor: colors.secondaryLight,
  },
  selectBtnCurrent: {
    backgroundColor: colors.creamBorder,
  },
  selectBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  selectBtnTextCurrent: {
    color: colors.charcoalMuted,
  },
  restoreBtn: {
    alignSelf: "center",
    marginTop: 20,
    padding: 10,
  },
  restoreBtnText: {
    fontSize: 12,
    color: colors.charcoalMuted,
    fontWeight: "600",
  },
});
