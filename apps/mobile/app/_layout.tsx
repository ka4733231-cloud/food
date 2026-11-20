/**
 * NutriBite AI Mobile - Root Application Layout (Expo Router)
 */

import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../src/theme/colors";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.cream,
          headerTitleStyle: {
            fontWeight: "700",
          },
          contentStyle: {
            backgroundColor: colors.cream,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pricing"
          options={{
            presentation: "modal",
            title: "NutriBite Membership",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.cream,
          }}
        />
        <Stack.Screen
          name="recipe/[id]"
          options={{
            title: "Recipe Details",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
