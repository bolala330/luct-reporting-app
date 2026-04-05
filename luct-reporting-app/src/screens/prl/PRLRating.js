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

const SAMPLE = [{ id: 'u1', code: 'SWM301', name: 'Dr. Ahmad Ismail' }];

export default function PRLRating() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const { query, setQuery, filteredData } = useSearch(SAMPLE, ['name', 'code']);

  async function handleSubmit() {
    if (!selected || rating === 0) { setToast({ visible: true, message: 'Select and rate', type: 'error' }); return; }
    try {
      await submitRating({ userId: userProfile.uid, targetId: selected.id, targetType: 'lecturer', score: rating, comment });
      setToast({ visible: true, message: 'Rated!', type: 'success' }); setRating(0); setComment(''); setSelected(null);
    } catch (e) { setToast({ visible: true, message: 'Failed', type: 'error' }); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}><Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>Rate Lecturers</Text></View>
      <View style={{ marginHorizontal: 20, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: selected ? colors.accent : colors.fgMuted, fontSize: 13, marginBottom: 12 }}>{selected ? selected.name : 'Select lecturer below'}</Text>
        <StarRating rating={rating} onRatingChange={setRating} />
        <TextInput style={{ backgroundColor: colors.bgElevated, borderWidth: 1.5, borderColor: colors.border, color: colors.fg, borderRadius: 10, padding: 12, fontSize: 13, minHeight: 60, textAlignVertical: 'top', marginVertical: 12 }} placeholder="Comment..." placeholderTextColor={colors.fgMuted} value={comment} onChangeText={setComment} multiline />
        <TouchableOpacity style={{ backgroundColor: colors.accent, borderRadius: 10, padding: 12, alignItems: 'center' }} onPress={handleSubmit}><Text style={{ fontWeight: '700', color: '#0f0f0f' }}>Submit</Text></TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 20 }}><SearchBar query={query} onQueryChange={setQuery} placeholder="Search..." /></View>
      <FlatList style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ backgroundColor: selected?.id === item.id ? colors.accentDim : colors.bgCard, borderWidth: 1, borderColor: selected?.id === item.id ? colors.accent : colors.border, borderRadius: 14, padding: 16, marginBottom: 10 }} onPress={() => setSelected(item)}>
            <Text style={{ color: colors.fg, fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ color: colors.fgMuted, fontSize: 12, marginTop: 2 }}>{item.code}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState icon="⭐" title="No Lecturers" />} />
    </View>
  );
}