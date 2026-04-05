import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import Toast from '../../components/Toast';
import { submitRating } from '../../services/ratings';
import useSearch from '../../hooks/useSearch';

const SAMPLE_COURSES = [
  { id: 'c1', code: 'SWM301', name: 'Software Engineering Principles' },
  { id: 'c2', code: 'SWM302', name: 'Mobile Application Development' },
];

export default function StudentRating() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const { query, setQuery, filteredData } = useSearch(SAMPLE_COURSES, ['name', 'code']);

  async function handleSubmit() {
    if (!selected || rating === 0) {
      setToast({ visible: true, message: 'Select a course and provide a rating', type: 'error' }); return;
    }
    try {
      await submitRating({ userId: userProfile.uid, targetId: selected.id, targetType: 'course', score: rating, comment });
      setToast({ visible: true, message: 'Rating submitted!', type: 'success' });
      setRating(0); setComment(''); setSelected(null);
    } catch (err) {
      setToast({ visible: true, message: 'Failed to submit', type: 'error' });
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />
      <View style={styles.header}><Text style={[styles.title, { color: colors.fg }]}>Rate Courses</Text></View>
      
      <View style={[styles.formCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={{ color: selected ? colors.accent : colors.fgMuted, fontSize: 13, marginBottom: 12 }}>
          {selected ? `${selected.code} — ${selected.name}` : 'Select a course below'}
        </Text>
        <StarRating rating={rating} onRatingChange={setRating} />
        <TextInput style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} placeholder="Add a comment (optional)" placeholderTextColor={colors.fgMuted} value={comment} onChangeText={setComment} multiline />
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.accent }]} onPress={handleSubmit}>
          <Text style={styles.btnText}>Submit Rating</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search courses..." />
      </View>
      <FlatList
        style={styles.list} contentContainerStyle={styles.listContent} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: selected?.id === item.id ? colors.accentDim : colors.bgCard, borderColor: selected?.id === item.id ? colors.accent : colors.border }]} onPress={() => setSelected(item)} activeOpacity={0.7}>
            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>{item.code}</Text>
            <Text style={{ color: colors.fg, fontWeight: '500', marginTop: 2 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState icon="⭐" title="No Courses" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }, title: { fontSize: 22, fontWeight: '700' },
  formCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  input: { borderWidth: 1.5, borderRadius: 10, padding: 12, fontSize: 13, minHeight: 60, textAlignVertical: 'top', marginVertical: 12 },
  btn: { borderRadius: 10, padding: 12, alignItems: 'center' }, btnText: { fontSize: 14, fontWeight: '700', color: '#0f0f0f' },
  searchWrap: { paddingHorizontal: 20 }, list: { flex: 1 }, listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 10 },
});