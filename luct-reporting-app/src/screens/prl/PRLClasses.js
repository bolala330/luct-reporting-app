import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getPRLCourses } from '../../services/courses';
import { getClassesByCourse } from '../../services/classes';
import useSearch from '../../hooks/useSearch';

export default function PRLClasses() {
  const { colors } = useTheme();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, filteredData } = useSearch(classes, ['name', 'venue', 'scheduleTime', 'courseName']);

  useEffect(() => {
    async function load() {
      try {
        const courses = await getPRLCourses('u2'); // Uses PRL ID from context ideally
        const allClasses = await Promise.all(courses.map(c => getClassesByCourse(c.id)));
        setClasses(allClasses.flat().map(c => ({ ...c, courseName: courses.find(co => co.id === c.courseId)?.name })));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}><Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>Stream Classes</Text></View>
      <View style={{ paddingHorizontal: 20 }}><SearchBar query={query} onQueryChange={setQuery} placeholder="Search classes..." /></View>
      <FlatList style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 10 }}>
            <Text style={{ color: colors.fg, fontWeight: '600', fontSize: 15 }}>{item.name}</Text>
            <Text style={{ color: colors.accent, fontSize: 12, marginTop: 4 }}>{item.courseName}</Text>
            <Text style={{ color: colors.fgMuted, fontSize: 12, marginTop: 8 }}>📍 {item.venue} | 🕐 {item.scheduleTime} | 📅 {item.day}</Text>
            <Text style={{ color: colors.fgMuted, fontSize: 12 }}>👥 {item.totalStudents} Students</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="🏫" title="No Classes" />} />
    </View>
  );
}