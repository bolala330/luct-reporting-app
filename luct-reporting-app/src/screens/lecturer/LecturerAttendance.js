import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { getLecturerClasses } from '../../services/classes';
import { getClassAttendance } from '../../services/attendance';
import { generateAttendanceReport } from '../../services/export';
import useSearch from '../../hooks/useSearch';

/**
 * View and manage attendance for each class.
 * Shows per-student status with color-coded indicators.
 */
export default function LecturerAttendance() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const allRecords = attendance.flatMap((a) =>
    (a.records || []).map((r) => ({ ...r, date: a.date, className: a.className }))
  );
  const { query, setQuery, filteredData } = useSearch(allRecords, ['studentName', 'studentId', 'status', 'date']);

  useEffect(() => { loadClasses(); }, []);

  async function loadClasses() {
    try {
      const data = await getLecturerClasses(userProfile.uid);
      setClasses(data);
      if (data.length > 0) {
        setSelectedClass(data[0]);
        loadAttendance(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadAttendance(classId) {
    try {
      const data = await getClassAttendance(classId);
      setAttendance(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleExport() {
    if (attendance.length === 0) {
      setToast({ visible: true, message: 'No attendance data to export', type: 'error' });
      return;
    }
    try {
      await generateAttendanceReport(attendance, `Attendance_${selectedClass?.name || 'All'}`);
      setToast({ visible: true, message: 'Attendance report downloaded', type: 'success' });
    } catch (err) {
      setToast({ visible: true, message: 'Export failed', type: 'error' });
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'present': return colors.success;
      case 'absent': return colors.danger;
      case 'late': return colors.warning;
      case 'excused': return '#60a5fa';
      default: return colors.fgMuted;
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.fg }]}>Attendance</Text>
        <TouchableOpacity style={[styles.exportBtn, { backgroundColor: colors.success + '22', borderColor: colors.success }]} onPress={handleExport}>
          <Text style={{ fontSize: 13 }}>📥</Text>
          <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700' }}>Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Class Tabs */}
      <View style={styles.tabsWrap}>
        <FlatList
          horizontal
          data={classes}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, {
                backgroundColor: selectedClass?.id === item.id ? colors.accentDim : colors.bgElevated,
                borderColor: selectedClass?.id === item.id ? colors.accent : colors.border,
              }]}
              onPress={() => { setSelectedClass(item); loadAttendance(item.id); }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: selectedClass?.id === item.id ? colors.accent : colors.fgMuted, whiteSpace: 'nowrap' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        />
      </View>

      <View style={styles.searchWrap}>
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search by student name, ID, status..." />
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={filteredData}
        keyExtractor={(item, idx) => `${item.studentId}-${item.date}-${idx}`}
        renderItem={({ item }) => (
          <View style={[styles.recordCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={styles.recordRow}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.studentName, { color: colors.fg }]}>{item.studentName}</Text>
                <Text style={{ color: colors.fgMuted, fontSize: 11 }}>{item.studentId} — {item.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '22' }]}>
                <Text style={{ color: getStatusColor(item.status), fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                  {item.status}
                </Text>
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
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  tabsWrap: { marginBottom: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  searchWrap: { paddingHorizontal: 20 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  recordCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 8 },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  studentName: { fontSize: 14, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
});