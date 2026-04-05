import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { getAllCourses, createCourse } from '../../services/courses';
import useSearch from '../../hooks/useSearch';

export default function PLCourses() {
  const { colors } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [form, setForm] = useState({ code: '', name: '', credits: '3', lecturerId: '', prlId: '' });
  const { query, setQuery, filteredData } = useSearch(courses, ['name', 'code']);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try { setCourses(await getAllCourses()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleAdd() {
    if (!form.code || !form.name) { setToast({ visible: true, message: 'Code and Name required', type: 'error' }); return; }
    try {
      await createCourse({ ...form, credits: parseInt(form.credits) });
      setToast({ visible: true, message: 'Course added', type: 'success' });
      setForm({ code: '', name: '', credits: '3', lecturerId: '', prlId: '' });
      setShowForm(false); loadData();
    } catch (e) { setToast({ visible: true, message: 'Failed', type: 'error' }); }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.fg, fontSize: 22, fontWeight: '700' }}>Manage Courses</Text>
        <TouchableOpacity style={{ backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 }} onPress={() => setShowForm(!showForm)}>
          <Text style={{ fontWeight: '700', color: '#0f0f0f', fontSize: 13 }}>{showForm ? 'Close' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={{ marginHorizontal: 20, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.accent, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <TextInput style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} placeholder="Course Code (e.g. SWM310)" placeholderTextColor={colors.fgMuted} value={form.code} onChangeText={(t) => setForm({ ...form, code: t })} />
          <TextInput style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} placeholder="Course Name" placeholderTextColor={colors.fgMuted} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
          <TextInput style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} placeholder="Lecturer UID" placeholderTextColor={colors.fgMuted} value={form.lecturerId} onChangeText={(t) => setForm({ ...form, lecturerId: t })} />
          <TextInput style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} placeholder="PRL UID" placeholderTextColor={colors.fgMuted} value={form.prlId} onChangeText={(t) => setForm({ ...form, prlId: t })} />
          <TouchableOpacity style={{ backgroundColor: colors.accent, borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8 }} onPress={handleAdd}><Text style={{ fontWeight: '700', color: '#0f0f0f' }}>Save Course</Text></TouchableOpacity>
        </View>
      )}

      <View style={{ paddingHorizontal: 20 }}><SearchBar query={query} onQueryChange={setQuery} placeholder="Search courses..." /></View>
      <FlatList style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} data={filteredData} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 10 }}>
            <Text style={{ color: colors.accent, fontWeight: '700' }}>{item.code}</Text>
            <Text style={{ color: colors.fg, fontWeight: '600', marginTop: 4 }}>{item.name}</Text>
            <Text style={{ color: colors.fgMuted, fontSize: 12, marginTop: 8 }}>Credits: {item.credits}</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="📚" title="No Courses" />} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1.5, borderRadius: 12, padding: 14, fontSize: 14, marginBottom: 10 }
});