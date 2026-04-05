import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '../../theme/theme';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { db, collection, getDocs, where, query } from '../../config/firebase';
import useSearch from '../../hooks/useSearch';

export default function PLLectures() {
  const { colors } = useTheme();
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query: searchQuery, setQuery: setSearchQuery, filteredData } = useSearch(lecturers, ['name', 'email', 'employeeId']);

  useEffect(() => {
    async function loadLecturers() {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'lecturer'));
        const snapshot = await getDocs(q);
        setLecturers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Error fetching lecturers:", e);
      } finally {
        setLoading(false);
      }
    }
    loadLecturers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
        <Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>Program Lecturers</Text>
      </View>
      
      <View style={{ paddingHorizontal: 20 }}>
        <SearchBar 
          query={searchQuery} 
          onQueryChange={setSearchQuery} 
          placeholder="Search by name, email, ID..." 
        />
      </View>

      <FlatList 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} 
        data={filteredData} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.accent }}>{item.name?.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.fg, fontWeight: '600', fontSize: 15 }}>{item.name}</Text>
                <Text style={{ color: colors.fgMuted, fontSize: 12 }}>{item.email}</Text>
                {item.employeeId && <Text style={{ color: colors.fgMuted, fontSize: 12 }}>ID: {item.employeeId}</Text>}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="👤" title="No Lecturers Found" message="No lecturers are assigned to this program yet." />}
      />
    </View>
  );
}