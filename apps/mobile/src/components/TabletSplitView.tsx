/**
 * NutriBite AI Mobile - Adaptive Tablet Split-View Component
 * Renders master list and detail inspection side-by-side on iPads/Tablets.
 */

import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useDeviceLayout } from "../hooks/useDeviceLayout";
import { colors } from "../theme/colors";

interface TabletSplitViewProps {
  master: ReactNode;
  detail: ReactNode;
  emptyDetailFallback?: ReactNode;
  hasSelectedDetail?: boolean;
}

export function TabletSplitView({
  master,
  detail,
  emptyDetailFallback,
  hasSelectedDetail = true
}: TabletSplitViewProps) {
  const { isTablet, masterPaneWidth } = useDeviceLayout();

  if (!isTablet) {
    // Phone layout: renders detail if selected, otherwise master
    return <View style={styles.phoneContainer}>{hasSelectedDetail && detail ? detail : master}</View>;
  }

  // Tablet Split Layout
  return (
    <View style={styles.tabletContainer}>
      <View style={[styles.masterPane, { width: masterPaneWidth }]}>
        {master}
      </View>
      <View style={styles.detailPane}>
        {hasSelectedDetail && detail ? detail : emptyDetailFallback}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  tabletContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.cream,
  },
  masterPane: {
    borderRightWidth: 1,
    borderRightColor: colors.creamBorder,
    backgroundColor: colors.cream,
  },
  detailPane: {
    flex: 1,
    backgroundColor: colors.creamCard,
  }
});
