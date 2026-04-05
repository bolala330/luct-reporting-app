import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

export default function StarRating({ rating = 0, onRatingChange, readonly = false, size = 28 }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container} pointerEvents={readonly ? 'none' : 'auto'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => !readonly && onRatingChange && onRatingChange(star)}
          activeOpacity={0.7}
          disabled={readonly}
        >
          <Text style={[styles.star, { fontSize: size, color: star <= rating ? colors.accent : colors.border }]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 4 },
  star: { lineHeight: 30 },
});