/**
 * NutriBite AI Mobile - Screen 16 & 19: User Profile, Goals & Subscription
 * Part 6 & 16 Master Prompt: User profile, dietary targets, membership status,
 * fair daily quota meters, and subscription settings.
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNutriBiteStore } from "../../src/store/useNutriBiteStore";
import { colors } from "../../src/theme/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, subscription, dailyUsage } = useNutriBiteStore();

  const scanLimits = { free: 5, plus: 50, pro: 150 };
  const msgLimits = { free: 5, plus: 50, pro: 150 };
  const currentScanLimit = scanLimits[subscription.tier];
  const currentMsgLimit = msgLimits[subscription.tier];

  const scanPct = Math.min(100, Math.round((dailyUsage.scansUsed / currentScanLimit) * 100));
  const msgPct = Math.min(100, Math.round((dailyUsage.messagesUsed / currentMsgLimit) * 100));

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.kicker}>Preferences &amp; Identity</Text>
      <Text style={styles.title}>User Profile</Text>

      {/* User Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={{ fontSize: 36 }}>{user.avatar}</Text>
        </View>
        <View style={styles.profileMeta}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Membership & Subscription Tier Card */}
      <View style={styles.subscriptionCard}>
        <View style={styles.subHeader}>
          <View>
            <Text style={styles.subKicker}>ACTIVE MEMBERSHIP</Text>
            <Text style={styles.subTierName}>
              {subscription.tier === "pro" ? "NutriBite Pro" : (subscription.tier === "plus" ? "NutriBite Plus" : "Free Forever")}
            </Text>
          </View>
          <View style={[styles.subBadge, subscription.tier === "pro" ? styles.subBadgePro : (subscription.tier === "plus" ? styles.subBadgePlus : styles.subBadgeFree)]}>
            <Text style={styles.subBadgeText}>{subscription.tier.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.subStatus}>
          Billing: {subscription.billingPeriod.toUpperCase()} • Renewal: {subscription.expiresAt}
        </Text>

        <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push("/pricing")}>
          <Text style={styles.upgradeBtnText}>
            {subscription.tier === "free" ? "Upgrade to Plus or Pro ↗" : "Manage Subscription & Plans"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Daily Quota Meters */}
      <View style={styles.quotaCard}>
        <Text style={styles.quotaTitle}>Today's Fair Usage Quotas</Text>

        {/* Scans Quota */}
        <View style={styles.quotaRow}>
          <View style={styles.quotaLabelRow}>
            <Text style={styles.quotaLabel}>AI Vision Food Scans</Text>
            <Text style={styles.quotaNumbers}>{dailyUsage.scansUsed} / {currentScanLimit}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${scanPct}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>

        {/* AI Assistant Chat Quota */}
        <View style={styles.quotaRow}>
          <View style={styles.quotaLabelRow}>
            <Text style={styles.quotaLabel}>Chef Nova AI Chat Messages</Text>
            <Text style={styles.quotaNumbers}>{dailyUsage.messagesUsed} / {currentMsgLimit}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${msgPct}%`, backgroundColor: colors.accentOrange }]} />
          </View>
        </View>
      </View>

      {/* Daily Nutrition Targets */}
      <View style={styles.targetsCard}>
        <Text style={styles.targetsTitle}>Nutrition Targets</Text>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Daily Calorie Target</Text>
          <Text style={styles.targetValue}>{user.calorieTarget} kcal</Text>
        </View>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Protein Goal</Text>
          <Text style={styles.targetValue}>{user.proteinTarget}g</Text>
        </View>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Carbohydrates Goal</Text>
          <Text style={styles.targetValue}>{user.carbsTarget}g</Text>
        </View>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Healthy Fats Goal</Text>
          <Text style={styles.targetValue}>{user.fatTarget}g</Text>
        </View>
        <View style={[styles.targetItem, { borderBottomWidth: 0 }]}>
          <Text style={styles.targetLabel}>Hydration Target</Text>
          <Text style={styles.targetValue}>{user.waterTarget} ml</Text>
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  profileMeta: {
    marginLeft: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.charcoal,
  },
  profileEmail: {
    fontSize: 12,
    color: colors.charcoalMuted,
    marginTop: 2,
  },
  subscriptionCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    marginBottom: 14,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  subKicker: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.charcoalMuted,
    letterSpacing: 0.8,
  },
  subTierName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 2,
  },
  subBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  subBadgeFree: {
    backgroundColor: colors.creamBorder,
  },
  subBadgePlus: {
    backgroundColor: colors.tiers.plusBg,
  },
  subBadgePro: {
    backgroundColor: colors.tiers.proBg,
  },
  subBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  subStatus: {
    fontSize: 11,
    color: colors.charcoalMuted,
    marginBottom: 14,
  },
  upgradeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  upgradeBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  quotaCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    marginBottom: 14,
  },
  quotaTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.charcoal,
    marginBottom: 14,
  },
  quotaRow: {
    marginBottom: 12,
  },
  quotaLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  quotaLabel: {
    fontSize: 12,
    color: colors.charcoal,
    fontWeight: "600",
  },
  quotaNumbers: {
    fontSize: 11,
    color: colors.charcoalMuted,
    fontWeight: "700",
  },
  track: {
    height: 6,
    backgroundColor: colors.creamBorder,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  targetsCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.creamBorder,
  },
  targetsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.charcoal,
    marginBottom: 10,
  },
  targetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamBorder,
  },
  targetLabel: {
    fontSize: 13,
    color: colors.charcoal,
  },
  targetValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
});
