import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getLecturerReports } from '../../services/reports';
import useSearch from '../../hooks/useSearch';

/**
 * Monitoring screen for lecturers.
 * Shows attendance trends and report statistics.
 */
export default function LecturerMonitoring() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const { query, setQuery, filteredData } = useSearch(
    reports,
    ['courseName', 'week', 'className'],
  );

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const data = await getLecturerReports(userProfile.uid);
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  // Calculate stats
  const totalSessions = reports.length;
  const avgAtt = totalSessions > 0
    ? Math.round(reports.reduce((s, r) => s + (r.totalRegistered ? (r.actualPresent / r.totalRegistered) * 100 : 0), 0) / totalSessions)
    : 0;
  const highestAtt = totalSessions > 0
    ? Math.max(...reports.map(r => r.totalRegistered ? Math.round((r.actualPresent / r.totalRegistered) * 100) : 0))
    : 0;
  const lowestAtt = totalSessions > 0
    ? Math.min(...reports.map(r => r.totalRegistered ? Math.round((r.actualPresent / r.totalRegistered) * 100) : 100))
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.fg }]}>Monitoring</Text>
      </View>

      <View style={styles.statsWrap}>
        <View style={styles.statsGrid}>
          <StatCard label="Total Sessions" value={totalSessions} icon="📊" color={colors.accent} />
          <StatCard label="Avg Attendance" value={`${avgAtt}%`} icon="📈" color={colors.success} />
          <StatCard label="Highest" value={`${highestAtt}%`} icon="⬆" color={colors.success} />
          <StatCard label="Lowest" value={`${lowestAtt}%`} icon="⬇" color={colors.danger} />
        </View>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search sessions..." />
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const att = item.totalRegistered ? Math.round((item.actualPresent / item.totalRegistered) * 100) : 0;
          return (
            <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.fg }]}>{item.courseCode}</Text>
                  <Text style={[styles.cardSub, { color: colors.fgMuted }]}>{item.week} — {item.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: att >= 75 ? colors.success : colors.danger, fontSize: 20, fontWeight: '700' }}>{att}%</Text>
                  <Text style={{ color: colors.fgMuted, fontSize: 11 }}>{item.actualPresent}/{item.totalRegistered}</Text>
                </View>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.bgElevated }]}>
                <View style={[styles.progressFill, {
                  backgroundColor: att >= 75 ? colors.success : att >= 50 ? colors.warning : colors.danger,
                  width: `${att}%`,
                }]} />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState icon="📊" title="No Data" message="Submit reports to see monitoring data." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  statsWrap: { paddingHorizontal: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  searchWrap: { paddingHorizontal: 20 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  cardSub: { fontSize: 12 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
});