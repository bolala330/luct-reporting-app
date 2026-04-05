import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import ReportCard from '../../components/ReportCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { getPRLReports } from '../../services/reports';
import { addReportFeedback } from '../../services/reports';
import { generateExcelReport } from '../../services/export';
import useSearch from '../../hooks/useSearch';

export default function PRLReports() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState('');

  const { query, setQuery, filteredData } = useSearch(reports, ['courseName', 'courseCode', 'lecturerName', 'week', 'topic']);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try { setReports(await getPRLReports(userProfile.uid)); } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  function openFeedback(report) {
    setSelectedReport(report);
    setFeedback(report.feedback || '');
    setModalVisible(true);
  }

  async function submitFeedback() {
    if (!feedback.trim()) { setToast({ visible: true, message: 'Please enter feedback', type: 'error' }); return; }
    try {
      await addReportFeedback(selectedReport.id, userProfile.uid, feedback);
      setToast({ visible: true, message: 'Feedback added', type: 'success' });
      setModalVisible(false);
      loadData();
    } catch (err) { setToast({ visible: true, message: 'Failed to add feedback', type: 'error' }); }
  }

  async function handleExport() {
    if (reports.length === 0) return;
    try {
      await generateExcelReport(reports, 'PRL_Reports');
      setToast({ visible: true, message: 'Excel downloaded', type: 'success' });
    } catch (err) { setToast({ visible: true, message: 'Export failed', type: 'error' }); }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Text style={{ color: colors.fg, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>PRL Feedback</Text>
            <Text style={{ color: colors.fgMuted, fontSize: 12, marginBottom: 16 }}>{selectedReport?.courseCode} — {selectedReport?.week}</Text>
            <TextInput style={[styles.feedbackInput, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} placeholder="Write your feedback for this lecture..." placeholderTextColor={colors.fgMuted} value={feedback} onChangeText={setFeedback} multiline numberOfLines={5} textAlignVertical="top" />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <TouchableOpacity style={[styles.modalBtn, { flex: 1, backgroundColor: colors.bgElevated, borderColor: colors.border }]} onPress={() => setModalVisible(false)}><Text style={{ color: colors.fg, fontWeight: '600' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { flex: 1, backgroundColor: colors.accent }]} onPress={submitFeedback}><Text style={{ color: '#0f0f0f', fontWeight: '700' }}>Submit</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>Reports & Feedback</Text>
        <TouchableOpacity style={[styles.exportBtn, { backgroundColor: colors.success + '22', borderColor: colors.success }]} onPress={handleExport}>
          <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700' }}>📥 Excel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchWrap}><SearchBar query={query} onQueryChange={setQuery} placeholder="Search by lecturer, course, week..." /></View>
      <FlatList style={styles.list} contentContainerStyle={styles.listContent} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <ReportCard report={item} />
            <TouchableOpacity style={[styles.fbBtn, { backgroundColor: colors.accentDim, borderColor: colors.accent }]} onPress={() => openFeedback(item)}>
              <Text style={{ color: colors.accent, fontWeight: '600', fontSize: 12 }}>{item.status === 'reviewed' ? '✓ Edit Feedback' : '+ Add Feedback'}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="📝" title="No Reports" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exportBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 }, searchWrap: { paddingHorizontal: 20 }, list: { flex: 1 }, listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  fbBtn: { borderWidth: 1, borderRadius: 10, padding: 10, alignItems: 'center', marginTop: -8, marginBottom: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' }, modalContent: { borderTopWidth: 1, borderRadius: 24, padding: 24, marginBottom: 0 },
  feedbackInput: { borderWidth: 1.5, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 120 },
  modalBtn: { borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1 },
});