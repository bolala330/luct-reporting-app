import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

/**
 * Toast notification that auto-dismisses.
 * @param {boolean} visible - Whether to show the toast
 * @param {string} message - Toast text
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {function} onHide - Called when toast finishes hiding
 */
export default function Toast({ visible, message, type = 'success', onHide }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -30, duration: 300, useNativeDriver: true }),
        ]).start(() => onHide?.());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
  const iconColor = type === 'success' ? colors.success : type === 'error' ? colors.danger : colors.accent;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.bgElevated,
          borderColor: colors.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconColor + '22' }]}>
        <Text style={{ color: iconColor, fontWeight: '700', fontSize: 14 }}>{icon}</Text>
      </View>
      <Text style={[styles.message, { color: colors.fg }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 20, left: 20, right: 20,
    borderRadius: 14, borderWidth: 1,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
    zIndex: 9999,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 20,
  },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  message: { fontSize: 14, fontWeight: '500', flex: 1 },
});