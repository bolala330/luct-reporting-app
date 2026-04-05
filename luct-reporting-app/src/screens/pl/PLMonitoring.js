import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '../../theme/theme';
import SearchBar from '../../components/SearchBar';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllReports } from '../../services/reports';
import useSearch from '../../hooks/useSearch';

export default function PLMonitoring() {
  const { colors } = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, filteredData } = useSearch(reports, ['courseName', 'lecturerName']);

  useEffect(() => { getAllReports().then(setReports).catch(console.error).finally(() => setLoading(false)); }, []);

  if (loading) return <LoadingSpinner />;
  const avgAtt = reports.length ? Math.round(reports.reduce((s, r) => s + (r.totalRegistered ? (r.actualPresent / r.totalRegistered) * 100 : 0), 0) / reports.length) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}><Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>Program Monitoring</Text></View>
      <View style={{ paddingHorizontal: 20, flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <StatCard label="Program Avg" value={`${avgAtt}%`} icon="📊" color={colors.accent} />
        <StatCard label="Total Records" value={reports.length} icon="📝" color={colors.success} />
      </View>
      <View style={{ paddingHorizontal: 20 }}><SearchBar query={query} onQueryChange={setQuery} placeholder="Search..." /></View>
      <FlatList style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const att = item.totalRegistered ? Math.round((item.actualPresent / item.totalRegistered) * 100) : 0;
          return (
            <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 10 }}>
              <Text style={{ color: colors.fg, fontWeight: '600' }}>{item.courseCode} — {item.lecturerName}</Text>
              <View style={{ height: 6, backgroundColor: colors.bgElevated, borderRadius: 3, marginTop: 10, overflow: 'hidden' }}><View style={{ height: '100%', width: `${att}%`, backgroundColor: att >= 75 ? colors.success : colors.danger, borderRadius: 3 }} /></View>
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState icon="📊" title="No Data" />} />
    </View>
  );
}