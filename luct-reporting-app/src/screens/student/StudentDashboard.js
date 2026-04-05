import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import CustomHeader from '../../components/CustomHeader';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getStudentAttendance, calculateAttendancePercentage } from '../../services/attendance';

export default function StudentDashboard() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.uid) loadAttendance();
  }, [userProfile]);

  async function loadAttendance() {
    try {
      const data = await getStudentAttendance(userProfile.uid);
      setAttendance(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  const percentage = calculateAttendancePercentage(attendance, userProfile.uid);
  const totalSessions = attendance.length;
  const presentCount = attendance.filter((a) =>
    a.records?.some((r) => r.studentId === userProfile.uid && (r.status === 'present' || r.status === 'late'))
  ).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <CustomHeader />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={[styles.welcomeCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '700' }}>BSc Software Engineering with Multimedia</Text>
              <Text style={{ color: colors.fgMuted, fontSize: 12, marginTop: 4 }}>Semester 2 — FICT</Text>
              <View style={[styles.attCircle, { borderColor: percentage >= 75 ? colors.success : percentage >= 50 ? colors.warning : colors.danger }]}>
                <Text style={{ fontSize: 28, fontWeight: '900', color: percentage >= 75 ? colors.success : percentage >= 50 ? colors.warning : colors.danger }}>
                  {percentage}%
                </Text>
                <Text style={{ color: colors.fgMuted, fontSize: 11 }}>Attendance</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <StatCard label="Total Sessions" value={totalSessions} icon="📅" color={colors.accent} />
              <StatCard label="Present" value={presentCount} icon="✓" color={colors.success} />
              <StatCard label="Absent" value={totalSessions - presentCount} icon="✗" color={colors.danger} />
            </View>
          </>
        }
        data={attendance.slice(0, 10)}
        keyExtractor={(item, idx) => item.id || idx.toString()}
        renderItem={({ item }) => {
          const myRecord = item.records?.find((r) => r.studentId === userProfile.uid);
          const statusColor = myRecord?.status === 'present' ? colors.success : myRecord?.status === 'late' ? colors.warning : colors.danger;
          return (
            <View style={[styles.recordCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={styles.recordRow}>
                <View style={[styles.dot, { backgroundColor: statusColor }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.className, { color: colors.fg }]}>{item.className}</Text>
                  <Text style={{ color: colors.fgMuted, fontSize: 12 }}>{item.date}</Text>
                </View>
                <Text style={{ color: statusColor, fontWeight: '700', textTransform: 'uppercase', fontSize: 12 }}>
                  {myRecord?.status || 'N/A'}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState icon="📋" title="No Attendance Data" message="Your attendance records will appear here once lecturers submit reports." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  welcomeCard: { borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 20, alignItems: 'center' },
  attCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  recordCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  className: { fontSize: 14, fontWeight: '600' },
});