import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { getStudentAttendance } from '../../services/attendance';
import { generateAttendanceReport } from '../../services/export';
import useSearch from '../../hooks/useSearch';

export default function StudentAttendance() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const flatRecords = attendance.map((a) => {
    const myRecord = a.records?.find((r) => r.studentId === userProfile.uid) || {};
    return { id: a.id, date: a.date, className: a.className, status: myRecord.status || 'N/A' };
  });

  const { query, setQuery, filteredData } = useSearch(flatRecords, ['className', 'date', 'status']);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const data = await getStudentAttendance(userProfile.uid);
      setAttendance(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    if (attendance.length === 0) {
      setToast({ visible: true, message: 'No data to export', type: 'error' }); return;
    }
    try {
      const myRecords = attendance.map((a) => ({
        ...a,
        records: a.records?.filter((r) => r.studentId === userProfile.uid) || []
      }));
      await generateAttendanceReport(myRecords, 'My_Attendance');
      setToast({ visible: true, message: 'Report downloaded', type: 'success' });
    } catch (err) {
      setToast({ visible: true, message: 'Export failed', type: 'error' });
    }
  }

  function getStatusColor(status) {
    return status === 'present' ? colors.success : status === 'late' ? colors.warning : status === 'excused' ? '#60a5fa' : colors.danger;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.fg }]}>My Attendance</Text>
        <TouchableOpacity style={[styles.exportBtn, { backgroundColor: colors.success + '22', borderColor: colors.success }]} onPress={handleExport}>
          <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700' }}>📥 Excel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchWrap}>
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search by class, date, status..." />
      </View>
      <FlatList
        style={styles.list} contentContainerStyle={styles.listContent}
        data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: getStatusColor(item.status) }]} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.fg, fontWeight: '600', fontSize: 14 }}>{item.className}</Text>
                <Text style={{ color: colors.fgMuted, fontSize: 12 }}>{item.date}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '22' }]}>
                <Text style={{ color: getStatusColor(item.status), fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>{item.status}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="📋" title="No Records" message="No attendance records found." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' }, exportBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  searchWrap: { paddingHorizontal: 20 }, list: { flex: 1 }, listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 }, badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
});