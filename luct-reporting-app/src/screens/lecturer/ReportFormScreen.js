import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, Platform, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { FACULTY_NAME, WEEK_OPTIONS, DAYS_OF_WEEK, TIME_SLOTS } from '../../constants';
import { getLecturerClasses } from '../../services/classes';
import { submitReport } from '../../services/reports';
import { saveAttendance } from '../../services/attendance';
import Toast from '../../components/Toast';

/**
 * Lecturer Reporting Form - the core data entry screen.
 * All required fields from the assignment spec are included.
 * Total Registered Students auto-fills from class data.
 */
export default function ReportFormScreen() {
  const { colors } = useTheme();
  const { userProfile } = useAuth();
  const navigation = useNavigation();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Form fields
  const [selectedClassId, setSelectedClassId] = useState('');
  const [week, setWeek] = useState('');
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [actualPresent, setActualPresent] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // Auto-filled fields
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [className, setClassName] = useState('');
  const [totalRegistered, setTotalRegistered] = useState('');
  const [venue, setVenue] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    try {
      const data = await getLecturerClasses(userProfile.uid);
      setClasses(data);
    } catch (err) {
      console.error('Error loading classes:', err);
    }
  }

  /** Auto-fill course/class details when a class is selected */
  function handleClassSelect(classId) {
    setSelectedClassId(classId);
    const selected = classes.find((c) => c.id === classId);
    if (selected) {
      setClassName(selected.name);
      setTotalRegistered(String(selected.totalStudents));
      setVenue(selected.venue);
      setScheduledTime(selected.scheduleTime);
      setCourseId(selected.courseId);
      // Course details would come from the course document
      // For now, use what's available in class data
      setCourseName(selected.courseName || '');
      setCourseCode(selected.courseCode || '');
    }
  }

  async function handleSubmit() {
    // Validation
    if (!selectedClassId || !week || !date || !topic || !learningOutcomes || !actualPresent) {
      setToast({ visible: true, message: 'Please fill all required fields', type: 'error' });
      return;
    }

    const present = parseInt(actualPresent, 10);
    const total = parseInt(totalRegistered, 10);
    if (present > total) {
      setToast({ visible: true, message: 'Present students cannot exceed total registered', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        lecturerId: userProfile.uid,
        lecturerName: userProfile.name,
        classId: selectedClassId,
        courseId,
        faculty: FACULTY_NAME,
        className,
        week,
        date,
        courseName,
        courseCode,
        actualPresent: present,
        totalRegistered: total,
        venue,
        scheduledTime,
        topic,
        learningOutcomes,
        recommendations,
      };

      const reportId = await submitReport(reportData);

      // Also save attendance record
      await saveAttendance({
        classId: selectedClassId,
        className,
        date,
        reportId,
        records: generateAttendanceRecords(present, total),
      });

      setToast({ visible: true, message: 'Report submitted successfully', type: 'success' });
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error('Submit error:', error);
      setToast({ visible: true, message: 'Failed to submit report', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  /** Generate placeholder attendance records */
  function generateAttendanceRecords(present, total) {
    const records = [];
    for (let i = 1; i <= total; i++) {
      records.push({
        studentId: `STU${String(i).padStart(4, '0')}`,
        studentName: `Student ${i}`,
        status: i <= present ? 'present' : 'absent',
      });
    }
    return records;
  }

  function renderPicker(label, selected, onSelect, options, placeholder) {
    return (
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.fgMuted }]}>{label} *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.pill, {
                backgroundColor: selected === opt ? colors.accentDim : colors.bgElevated,
                borderColor: selected === opt ? colors.accent : colors.border,
              }]}
              onPress={() => onSelect(opt)}
            >
              <Text style={{
                fontSize: 12, fontWeight: '600',
                color: selected === opt ? colors.accent : colors.fgMuted,
                whiteSpace: 'nowrap',
              }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  function renderInput(label, value, onChange, placeholder, multiline = false) {
    return (
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.fgMuted }]}>{label} *</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: colors.bgElevated,
            borderColor: colors.border,
            color: colors.fg,
            minHeight: multiline ? 80 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          }]}
          placeholder={placeholder}
          placeholderTextColor={colors.fgMuted}
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      </View>
    );
  }

  function renderReadOnly(label, value) {
    return (
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.fgMuted }]}>{label}</Text>
        <View style={[styles.readOnlyBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <Text style={[styles.readOnlyText, { color: colors.accent }]}>{value || '—'}</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
        <Toast {...toast} onHide={() => setToast({ ...toast, visible: false })} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: colors.fg }]}>Lecture Report</Text>
            <Text style={[styles.headerSub, { color: colors.fgMuted }]}>FICT — {FACULTY_NAME}</Text>
          </View>
        </View>

        {/* Class Selection */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.fgMuted }]}>Select Class *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
            {classes.length === 0 && (
              <Text style={{ color: colors.fgMuted, fontSize: 13 }}>No classes assigned</Text>
            )}
            {classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                style={[styles.pill, {
                  backgroundColor: selectedClassId === cls.id ? colors.accentDim : colors.bgElevated,
                  borderColor: selectedClassId === cls.id ? colors.accent : colors.border,
                }]}
                onPress={() => handleClassSelect(cls.id)}
              >
                <Text style={{
                  fontSize: 12, fontWeight: '600',
                  color: selectedClassId === cls.id ? colors.accent : colors.fgMuted,
                }}>{cls.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Auto-filled read-only fields */}
        {selectedClassId ? (
          <View style={[styles.autoFillSection, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>Auto-filled Details</Text>
            <View style={styles.autoGrid}>
              {renderReadOnly('Faculty', FACULTY_NAME)}
              {renderReadOnly('Course Name', courseName)}
              {renderReadOnly('Course Code', courseCode)}
              {renderReadOnly('Class Name', className)}
              {renderReadOnly('Total Registered Students', totalRegistered)}
              {renderReadOnly('Venue', venue)}
              {renderReadOnly('Scheduled Lecture Time', scheduledTime)}
              {renderReadOnly('Lecturer Name', userProfile?.name)}
            </View>
          </View>
        ) : null}

        {/* Week Selection */}
        {renderPicker('Week of Reporting', week, setWeek, WEEK_OPTIONS, 'Select week')}

        {/* Date */}
        {renderInput('Date of Lecture', date, setDate, 'e.g. 2025-03-17')}

        {/* Topic */}
        {renderInput('Topic Taught', topic, setTopic, 'Enter the main topic covered')}

        {/* Learning Outcomes */}
        {renderInput('Learning Outcomes of the Topic', learningOutcomes, setLearningOutcomes,
          'List the learning outcomes achieved...', true)}

        {/* Actual Present */}
        {renderInput('Actual Number of Students Present', actualPresent, setActualPresent, 'Enter count', false)}

        {/* Recommendations (optional) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.fgMuted }]}>Lecturer's Recommendations</Text>
          <TextInput
            style={[styles.input, {
              backgroundColor: colors.bgElevated,
              borderColor: colors.border,
              color: colors.fg,
              minHeight: 80,
              textAlignVertical: 'top',
            }]}
            placeholder="Optional: suggestions, concerns, follow-ups..."
            placeholderTextColor={colors.fgMuted}
            value={recommendations}
            onChangeText={setRecommendations}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.accent, opacity: loading ? 0.6 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#242424', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSub: { fontSize: 11, color: '#8a8478' },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderRadius: 12, padding: 14, fontSize: 14,
  },
  pickerScroll: { flexDirection: 'row', gap: 8 },
  pill: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, marginRight: 8,
  },
  autoFillSection: {
    borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  autoGrid: { gap: 10 },
  readOnlyBox: {
    borderWidth: 1, borderRadius: 10, padding: 10, backgroundColor: '#0f0f0f',
  },
  readOnlyText: { fontSize: 13, fontWeight: '600' },
  submitBtn: { marginTop: 8, borderRadius: 12, padding: 16, alignItems: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: '#0f0f0f' },
});