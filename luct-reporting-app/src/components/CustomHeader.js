import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../constants';

/**
 * Custom header bar displayed at the top of each screen.
 * Shows greeting, user name, role badge, and action buttons.
 */
export default function CustomHeader({ onNotification, onLogout }) {
  const { colors, typography } = useTheme();
  const { userProfile, logout } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <View style={[styles.header, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
      <View>
        <Text style={[styles.greeting, { color: colors.fgMuted }]}>{greeting}</Text>
        <Text style={[styles.name, { color: colors.fg }]}>{userProfile?.name || 'User'}</Text>
      </View>
      <View style={styles.actions}>
        {userProfile?.role && (
          <View style={[styles.roleBadge, { backgroundColor: colors.accentDim }]}>
            <Text style={[styles.roleText, { color: colors.accent }]}>
              {ROLE_LABELS[userProfile.role]}
            </Text>
          </View>
        )}
        {onNotification && (
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
            onPress={onNotification}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 14 }}>🔔</Text>
            <View style={[styles.notifDot, { backgroundColor: colors.danger }]} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
          onPress={onLogout || logout}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 14 }}>⏻</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 11, fontWeight: '500' },
  name: { fontSize: 16, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  roleText: { fontSize: 10, fontWeight: '600' },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4,
  },
});