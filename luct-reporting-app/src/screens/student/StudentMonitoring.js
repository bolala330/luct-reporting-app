import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getStudentAttendance, calculateAttendancePercentage } from '../../services/attendance';
import useSearch from '../../hooks/useSearch';

export default function StudentMonitoring() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const classStats = attendance.map((a) => {
    const myRec = a.records?.find((r) => r.studentId === userProfile.uid);
    return { id: a.id, className: a.className, date: a.date, status: myRec?.status || 'absent' };
  });

  const { query, setQuery, filteredData } = useSearch(classStats, ['className', 'date']);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
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

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}><Text style={[styles.title, { color: colors.fg }]}>Academic Monitoring</Text></View>
      <View style={styles.statsWrap}>
        <View style={styles.statsGrid}>
          <StatCard label="Overall Attendance" value={`${percentage}%`} icon="📊" color={percentage >= 75 ? colors.success : colors.danger} />
          <StatCard label="Classes Attended" value={attendance.filter(a => a.records?.some(r => r.studentId === userProfile.uid && r.status === 'present')).length} icon="✓" color={colors.success} />
        </View>
      </View>
      <View style={styles.searchWrap}>
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search by class name..." />
      </View>
      <FlatList
        style={styles.list} contentContainerStyle={styles.listContent} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const col = item.status === 'present' || item.status === 'late' ? colors.success : colors.danger;
          return (
            <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <Text style={{ color: colors.fg, fontWeight: '600' }}>{item.className}</Text>
              <Text style={{ color: colors.fgMuted, fontSize: 12, marginVertical: 6 }}>{item.date}</Text>
              <View style={[styles.bar, { backgroundColor: colors.bgElevated }]}>
                <View style={[styles.barFill, { backgroundColor: col, width: item.status === 'present' || item.status === 'late' ? '100%' : '0%' }]} />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState icon="📊" title="No Data" message="No monitoring data available yet." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '700' }, statsWrap: { paddingHorizontal: 20 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 }, searchWrap: { paddingHorizontal: 20 },
  list: { flex: 1 }, listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 10 },
  bar: { height: 6, borderRadius: 3, overflow: 'hidden' }, barFill: { height: '100%', borderRadius: 3 },
});