import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

/**
 * Shown when a list has no data.
 */
export default function EmptyState({ icon = '📋', title = 'No Data', message = 'Nothing to display yet.' }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.fg }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.fgMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  message: { fontSize: 13, textAlign: 'center', maxWidth: 250 },
});