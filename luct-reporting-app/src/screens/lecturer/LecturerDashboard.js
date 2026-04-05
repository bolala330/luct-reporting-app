import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import CustomHeader from '../../components/CustomHeader';
import StatCard from '../../components/StatCard';
import ReportCard from '../../components/ReportCard';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getLecturerReports } from '../../services/reports';
import { getLecturerClasses } from '../../services/classes';
import useSearch from '../../hooks/useSearch';

/**
 * Lecturer dashboard showing stats, recent reports, and quick actions.
 */
export default function LecturerDashboard() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const navigation = useNavigation();

  const [reports, setReports] = useState([]);
  const [classCount, setClassCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { query, setQuery, filteredData } = useSearch(
    reports,
    ['courseName', 'courseCode', 'className', 'week', 'topic'],
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [reportData, classData] = await Promise.all([
        getLecturerReports(userProfile.uid),
        getLecturerClasses(userProfile.uid),
      ]);
      setReports(reportData);
      setClassCount(classData.length);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  const avgAttendance = reports.length > 0
    ? Math.round(
        reports.reduce((sum, r) =>
          sum + (r.totalRegistered ? (r.actualPresent / r.totalRegistered) * 100 : 0), 0
        ) / reports.length
      )
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <CustomHeader />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Quick Action */}
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('ReportForm')}
              activeOpacity={0.8}
            >
              <Text style={styles.fabText}>+ New Report</Text>
            </TouchableOpacity>

            {/* Stats */}
            <View style={styles.statsGrid}>
              <StatCard label="Total Reports" value={reports.length} icon="📝" color={colors.accent} />
              <StatCard label="My Classes" value={classCount} icon="🏫" color={colors.success} />
              <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon="📊" color={colors.warning} />
              <StatCard label="This Week" value={reports.filter(r => r.week === 'Week 8').length} icon="📅" color="#a78bfa" />
            </View>

            {/* Search */}
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              placeholder="Search reports by course, week, topic..."
            />

            {/* Recent Reports Header */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.fg }]}>Recent Reports</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LecturerReports')}>
                <Text style={{ color: colors.accent, fontSize: 13, fontWeight: '600' }}>View All</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={filteredData.slice(0, 10)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard report={item} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📝"
            title="No Reports Yet"
            message="Tap '+ New Report' to submit your first lecture report."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  fab: { borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 20 },
  fabText: { fontSize: 15, fontWeight: '700', color: '#0f0f0f' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
});