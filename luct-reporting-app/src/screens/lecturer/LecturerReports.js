import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import ReportCard from '../../components/ReportCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { getLecturerReports } from '../../services/reports';
import { generateExcelReport } from '../../services/export';
import useSearch from '../../hooks/useSearch';

/**
 * Lists all submitted reports by this lecturer.
 * Includes search and Excel export functionality (extra credit).
 */
export default function LecturerReports() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const { query, setQuery, filteredData } = useSearch(
    reports,
    ['courseName', 'courseCode', 'className', 'week', 'topic', 'date', 'venue', 'lecturerName'],
  );

  useEffect(() => { loadReports(); }, []);

  async function loadReports() {
    try {
      const data = await getLecturerReports(userProfile.uid);
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    if (reports.length === 0) {
      setToast({ visible: true, message: 'No reports to export', type: 'error' });
      return;
    }
    setExporting(true);
    try {
      await generateExcelReport(reports, 'LUCT_My_Reports');
      setToast({ visible: true, message: 'Excel report downloaded', type: 'success' });
    } catch (err) {
      console.error('Export error:', err);
      setToast({ visible: true, message: 'Export failed', type: 'error' });
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.fg }]}>My Reports</Text>
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: colors.success + '22', borderColor: colors.success }]}
          onPress={handleExport}
          disabled={exporting}
        >
          <Text style={{ fontSize: 13 }}>📥</Text>
          <Text style={[styles.exportText, { color: colors.success }]}>
            {exporting ? 'Exporting...' : 'Excel'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search by course, week, topic, venue..."
        />
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
        ListEmptyComponent={
          <EmptyState icon="📝" title="No Reports" message="Your submitted reports will appear here." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  exportText: { fontSize: 12, fontWeight: '700' },
  searchWrap: { paddingHorizontal: 20 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
});