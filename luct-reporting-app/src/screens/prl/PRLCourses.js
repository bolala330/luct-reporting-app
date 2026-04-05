import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getPRLCourses } from '../../services/courses';
import useSearch from '../../hooks/useSearch';

export default function PRLCourses() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { query, setQuery, filteredData } = useSearch(courses, ['name', 'code', 'lecturerName']);
  
  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const data = await getPRLCourses(userProfile.uid);
      setCourses(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}><Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>My Courses</Text></View>
      <View style={styles.searchWrap}><SearchBar query={query} onQueryChange={setQuery} placeholder="Search by course name, code..." /></View>
      <FlatList style={styles.list} contentContainerStyle={styles.listContent} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 14 }}>{item.code}</Text>
            <Text style={{ color: colors.fg, fontWeight: '600', fontSize: 15, marginTop: 4 }}>{item.name}</Text>
            <Text style={{ color: colors.fgMuted, fontSize: 12, marginTop: 8 }}>Lecturer: {item.lecturerName || 'Assigned'}</Text>
            <Text style={{ color: colors.fgMuted, fontSize: 12 }}>Credits: {item.credits || 3}</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="📚" title="No Courses" message="No courses assigned to your stream." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  searchWrap: { paddingHorizontal: 20 }, list: { flex: 1 }, listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
});

