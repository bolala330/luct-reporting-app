import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

/**
 * Displays a single report summary in a card layout.
 * Shows course, week, date, attendance, and status.
 */
export default function ReportCard({ report, onPress }) {
  const { colors } = useTheme();

  const attendance = report.totalRegistered
    ? Math.round(((report.actualPresent || 0) / report.totalRegistered) * 100)
    : 0;

  const statusColor =
    report.status === 'reviewed' ? colors.success :
    report.status === 'submitted' ? colors.warning :
    colors.fgMuted;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.courseCode, { color: colors.accent }]}>{report.courseCode}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{report.status}</Text>
        </View>
      </View>
      <Text style={[styles.courseName, { color: colors.fg }]}>{report.courseName}</Text>
      <View style={styles.details}>
        <Text style={[styles.detail, { color: colors.fgMuted }]}>
          {report.week} | {report.date}
        </Text>
        <Text style={[styles.detail, { color: colors.fgMuted }]}>
          {report.className}
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.attendanceRow}>
          <Text style={[styles.attendanceLabel, { color: colors.fgMuted }]}>Attendance</Text>
          <Text style={[styles.attendanceValue, { color: attendance >= 75 ? colors.success : colors.danger }]}>
            {report.actualPresent}/{report.totalRegistered} ({attendance}%)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  courseCode: { fontSize: 13, fontWeight: '700' },
  courseName: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  details: { gap: 2, marginBottom: 12 },
  detail: { fontSize: 12 },
  footer: { borderTopWidth: 1, borderTopColor: '#2a2a2a', paddingTop: 10 },
  attendanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  attendanceLabel: { fontSize: 12, fontWeight: '500' },
  attendanceValue: { fontSize: 13, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});