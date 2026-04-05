import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import SearchBar from '../../components/SearchBar';
import ReportCard from '../../components/ReportCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { getAllReports } from '../../services/reports';
import { generateExcelReport } from '../../services/export';
import useSearch from '../../hooks/useSearch';

export default function PLReports() {
  const { colors } = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const { query, setQuery, filteredData } = useSearch(reports, ['courseName', 'lecturerName', 'week', 'status']);

  useEffect(() => { getAllReports().then(setReports).catch(console.error).finally(() => setLoading(false)); }, []);

  async function handleExport() {
    if (!reports.length) return;
    try { await generateExcelReport(reports, 'PL_Program_Reports'); setToast({ visible: true, message: 'Excel downloaded', type: 'success' }); } catch (e) { setToast({ visible: true, message: 'Export failed', type: 'error' }); }
  }

  if (loading) return <LoadingSpinner />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>Program Reports</Text>
        <TouchableOpacity style={{ backgroundColor: colors.success + '22', borderWidth: 1, borderColor: colors.success, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 }} onPress={handleExport}>
          <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700' }}>📥 Excel</Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 20 }}><SearchBar query={query} onQueryChange={setQuery} placeholder="Search all program reports..." /></View>
      <FlatList style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
        ListEmptyComponent={<EmptyState icon="📝" title="No Reports" />} />
    </View>
  );
}