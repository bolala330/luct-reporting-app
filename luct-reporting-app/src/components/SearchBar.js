import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'; // ADDED Text HERE
import { useTheme } from '../theme/theme';

export default function SearchBar({ query, onQueryChange, placeholder = 'Search...' }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, {
          backgroundColor: colors.bgElevated,
          borderColor: colors.border,
          color: colors.fg,
        }]}
        placeholder={placeholder}
        placeholderTextColor={colors.fgMuted}
        value={query}
        onChangeText={onQueryChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
        <Text style={styles.iconText}>⌕</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', marginBottom: 16 },
  input: {
    borderWidth: 1.5, borderRadius: 12, padding: 14,
    paddingLeft: 16, paddingRight: 50, fontSize: 14,
  },
  iconContainer: {
    position: 'absolute', right: 6, top: 6,
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 18, color: '#0f0f0f', fontWeight: '700' },
});