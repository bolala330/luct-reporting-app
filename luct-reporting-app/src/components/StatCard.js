import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

/**
 * Dashboard stat card showing a metric with label and optional icon.
 */
export default function StatCard({ label, value, icon, color }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
      <View style={[styles.topBar, { backgroundColor: color || colors.accent }]} />
      <View style={styles.content}>
        <Text style={[styles.icon, { color: color || colors.accent }]}>{icon}</Text>
        <Text style={[styles.value, { color: colors.fg }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.fgMuted }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, borderRadius: 16, borderWidth: 1,
    padding: 16, position: 'relative', overflow: 'hidden',
  },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 3,
  },
  content: { alignItems: 'center', marginTop: 4 },
  icon: { fontSize: 22, marginBottom: 6 },
  value: { fontSize: 24, fontWeight: '700', marginBottom: 2 },
  label: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
});