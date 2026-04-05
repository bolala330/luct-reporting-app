import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { getLecturerCourses } from '../../services/courses';
import { submitRating, getRatings, calculateAverageRating } from '../../services/ratings';
import useSearch from '../../hooks/useSearch';

/**
 * Lecturer can rate their own courses or view ratings received.
 */
export default function LecturerRating() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const { query, setQuery, filteredData } = useSearch(
    courses.map((c) => ({ ...c, avgRating: calculateAverageRating(ratings.filter((r) => r.targetId === c.id)) })),
    ['name', 'code'],
  );

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [courseData, allRatings] = await Promise.all([
        getLecturerCourses(userProfile.uid),
        Promise.all((await getLecturerCourses(userProfile.uid)).map((c) => getRatings(c.id, 'course'))),
      ]);
      setCourses(courseData);
      setRatings(allRatings.flat());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitRating() {
    if (!selectedCourse || newRating === 0) {
      setToast({ visible: true, message: 'Select a course and rate it', type: 'error' });
      return;
    }
    try {
      await submitRating({
        userId: userProfile.uid,
        targetId: selectedCourse.id,
        targetType: 'course',
        score: newRating,
        comment,
      });
      setToast({ visible: true, message: 'Rating submitted', type: 'success' });
      setNewRating(0);
      setComment('');
      setSelectedCourse(null);
      loadData();
    } catch (err) {
      setToast({ visible: true, message: 'Failed to submit rating', type: 'error' });
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.fg }]}>Course Ratings</Text>
      </View>

      {/* Rating Form */}
      <View style={[styles.formCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.formTitle, { color: colors.fg }]}>Rate a Course</Text>
        <Text style={[styles.selectedCourse, { color: selectedCourse ? colors.accent : colors.fgMuted }]}>
          {selectedCourse ? `${selectedCourse.code} — ${selectedCourse.name}` : 'Tap a course below to select'}
        </Text>
        <StarRating rating={newRating} onRatingChange={setNewRating} />
        <TextInput
          style={[styles.commentInput, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]}
          placeholder="Add a comment (optional)"
          placeholderTextColor={colors.fgMuted}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.accent }]} onPress={handleSubmitRating}>
          <Text style={styles.submitBtnText}>Submit Rating</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search courses..." />
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const avg = calculateAverageRating(ratings.filter((r) => r.targetId === item.id));
          return (
            <TouchableOpacity
              style={[styles.courseCard, {
                backgroundColor: selectedCourse?.id === item.id ? colors.accentDim : colors.bgCard,
                borderColor: selectedCourse?.id === item.id ? colors.accent : colors.border,
              }]}
              onPress={() => setSelectedCourse(item)}
              activeOpacity={0.7}
            >
              <View style={styles.courseRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.courseCode, { color: colors.accent }]}>{item.code}</Text>
                  <Text style={[styles.courseName, { color: colors.fg }]}>{item.name}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '700' }}>{avg || '—'}</Text>
                  <Text style={{ color: colors.fgMuted, fontSize: 10 }}>avg</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<EmptyState icon="⭐" title="No Courses" message="No courses to rate." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  formCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  formTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  selectedCourse: { fontSize: 13, marginBottom: 12 },
  commentInput: { borderWidth: 1.5, borderRadius: 10, padding: 12, fontSize: 13, minHeight: 60, textAlignVertical: 'top', marginBottom: 12 },
  submitBtn: { borderRadius: 10, padding: 12, alignItems: 'center' },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: '#0f0f0f' },
  searchWrap: { paddingHorizontal: 20 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  courseCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 10 },
  courseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseCode: { fontSize: 13, fontWeight: '700' },
  courseName: { fontSize: 14, fontWeight: '500', marginTop: 2 },
});