/**
 * NutriBite AI Mobile - Adaptive Tablet & Phone Layout Hook
 * Detects iPads, Android Tablets, and foldable devices to enable
 * side-by-side master/detail split-views (Part 2 & Part 16 Master Prompt).
 */

import { useWindowDimensions } from "react-native";

export interface DeviceLayoutInfo {
  isTablet: boolean;
  isLandscape: boolean;
  isPhone: boolean;
  screenWidth: number;
  screenHeight: number;
  masterPaneWidth: number;
  recipeGridColumns: number;
  contentPadding: number;
}

export function useDeviceLayout(): DeviceLayoutInfo {
  const { width, height } = useWindowDimensions();

  // iPad Mini & 7-inch Android tablets start around 768px width
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const isPhone = !isTablet;

  // Adaptive values
  const masterPaneWidth = isTablet ? Math.min(420, Math.round(width * 0.38)) : width;
  const recipeGridColumns = isTablet ? (isLandscape ? 3 : 2) : 1;
  const contentPadding = isTablet ? 28 : 16;

  return {
    isTablet,
    isLandscape,
    isPhone,
    screenWidth: width,
    screenHeight: height,
    masterPaneWidth,
    recipeGridColumns,
    contentPadding
  };
}
