import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import CustomHeader from '../../components/CustomHeader';
import StatCard from '../../components/StatCard';
import ReportCard from '../../components/ReportCard';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getPRLCourses } from '../../services/courses';
import { getPRLReports } from '../../services/reports';
import useSearch from '../../hooks/useSearch';

export default function PRLDashboard() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [reports, setReports] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { query, setQuery, filteredData } = useSearch(reports, ['courseName', 'courseCode', 'week', 'lecturerName']);
  const pendingReviews = reports.filter(r => r.status === 'submitted').length;

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [courses, reps] = await Promise.all([getPRLCourses(userProfile.uid), getPRLReports(userProfile.uid)]);
      setCourseCount(courses.length);
      setReports(reps);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <CustomHeader />
      <FlatList style={styles.list} contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.statsGrid}>
              <StatCard label="Supervised Courses" value={courseCount} icon="📚" color={colors.accent} />
              <StatCard label="Total Reports" value={reports.length} icon="📝" color={colors.success} />
              <StatCard label="Pending Reviews" value={pendingReviews} icon="⏳" color={colors.warning} />
            </View>
            <SearchBar query={query} onQueryChange={setQuery} placeholder="Search reports..." />
            <View style={styles.secHeader}>
              <Text style={{ color: colors.fg, fontSize: 16, fontWeight: '700' }}>Recent Reports</Text>
            </View>
          </>
        }
        data={filteredData.slice(0, 10)} keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
        ListEmptyComponent={<EmptyState icon="📝" title="No Reports" message="No lecture reports from your stream yet." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, list: { flex: 1 }, listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  secHeader: { marginBottom: 12 },
});