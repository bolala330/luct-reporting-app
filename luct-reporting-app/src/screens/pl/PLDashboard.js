import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import CustomHeader from '../../components/CustomHeader';
import StatCard from '../../components/StatCard';
import ReportCard from '../../components/ReportCard';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getAllCourses } from '../../services/courses';
import { getAllReports } from '../../services/reports';
import useSearch from '../../hooks/useSearch';

export default function PLDashboard() {
  const { colors } = useTheme();
  const [reports, setReports] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, filteredData } = useSearch(reports, ['courseName', 'courseCode', 'lecturerName']);

  useEffect(() => {
    Promise.all([getAllCourses(), getAllReports()]).then(([c, r]) => { setCourseCount(c.length); setReports(r); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <CustomHeader />
      <FlatList style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <StatCard label="Program Courses" value={courseCount} icon="📚" color={colors.accent} />
              <StatCard label="Total Reports" value={reports.length} icon="📝" color={colors.success} />
              <StatCard label="Reviewed" value={reports.filter(r => r.status === 'reviewed').length} icon="✓" color={colors.warning} />
            </View>
            <SearchBar query={query} onQueryChange={setQuery} placeholder="Search all reports..." />
            <View style={{ marginBottom: 12 }}><Text style={{ color: colors.fg, fontSize: 16, fontWeight: '700' }}>Program Reports</Text></View>
          </>
        }
        data={filteredData.slice(0, 10)} keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
        ListEmptyComponent={<EmptyState icon="📝" title="No Reports" message="Program reports will appear here." />}
      />
    </View>
  );
}