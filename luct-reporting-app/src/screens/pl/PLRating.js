import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '../../theme/theme';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import StarRating from '../../components/StarRating';
import useSearch from '../../hooks/useSearch';

const DATA = [{ id: 'c1', name: 'Software Engineering', code: 'SWM301', avg: 4.2 }, { id: 'c2', name: 'Mobile App Dev', code: 'SWM302', avg: 3.8 }];

export default function PLRating() {
  const { colors } = useTheme();
  const { query, setQuery, filteredData } = useSearch(DATA, ['name', 'code']);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}><Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>Program Ratings</Text></View>
      <View style={{ paddingHorizontal: 20 }}><SearchBar query={query} onQueryChange={setQuery} placeholder="Search courses..." /></View>
      <FlatList style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>{item.code}</Text>
              <Text style={{ color: colors.fg, fontWeight: '600', marginTop: 2 }}>{item.name}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <StarRating rating={Math.round(item.avg)} readonly size={20} />
              <Text style={{ color: colors.fgMuted, fontSize: 11, marginTop: 4 }}>{item.avg}/5.0</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="⭐" title="No Ratings" />} />
    </View>
  );
}