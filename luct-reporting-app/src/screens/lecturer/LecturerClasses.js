import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getLecturerClasses } from '../../services/classes';
import useSearch from '../../hooks/useSearch';

/**
 * Shows all classes assigned to the lecturer.
 * Each class displays course, venue, schedule, and student count.
 */
export default function LecturerClasses() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { query, setQuery, filteredData } = useSearch(
    classes,
    ['name', 'venue', 'scheduleTime', 'day'],
  );

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    try {
      const data = await getLecturerClasses(userProfile.uid);
      setClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.fg }]}>My Classes</Text>
        <Text style={[styles.count, { color: colors.fgMuted }]}>{filteredData.length} classes</Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search by class, venue, schedule..." />
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.className, { color: colors.fg }]}>{item.name}</Text>
              <View style={[styles.badge, { backgroundColor: colors.accentDim }]}>
                <Text style={[styles.badgeText, { color: colors.accent }]}>{item.totalStudents} students</Text>
              </View>
            </View>
            <View style={styles.details}>
              <DetailRow icon="📍" label="Venue" value={item.venue} colors={colors} />
              <DetailRow icon="🕐" label="Time" value={item.scheduleTime} colors={colors} />
              <DetailRow icon="📅" label="Day" value={item.day} colors={colors} />
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="🏫" title="No Classes" message="No classes have been assigned to you yet." />}
      />
    </View>
  );
}

function DetailRow({ icon, label, value, colors }) {
  return (
    <View style={styles.detailRow}>
      <Text style={{ fontSize: 14 }}>{icon}</Text>
      <Text style={[styles.detailLabel, { color: colors.fgMuted }]}>{label}:</Text>
      <Text style={[styles.detailValue, { color: colors.fg }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  count: { fontSize: 13 },
  searchWrap: { paddingHorizontal: 20 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  className: { fontSize: 16, fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  details: { gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { fontSize: 12, fontWeight: '500' },
  detailValue: { fontSize: 13, fontWeight: '500' },
});