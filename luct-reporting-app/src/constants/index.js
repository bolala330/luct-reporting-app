/** Application-wide constants */

export const FACULTY_NAME = 'Faculty of Information Communication Technology';
export const PROGRAM_NAME = 'BSc Degree in Software Engineering with Multimedia';
export const SEMESTER = 2;

export const ROLES = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  PRL: 'prl',
  PL: 'pl',
};

export const ROLE_LABELS = {
  student: 'Student',
  lecturer: 'Lecturer',
  prl: 'Principal Lecturer',
  pl: 'Program Leader',
};

export const WEEK_OPTIONS = Array.from({ length: 16 }, (_, i) => `Week ${i + 1}`);

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '09:00 - 11:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '11:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '14:00 - 16:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '16:00 - 18:00',
];

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  CLASSES: 'classes',
  REPORTS: 'reports',
  RATINGS: 'ratings',
  ATTENDANCE: 'attendance',
  FEEDBACK: 'feedback',
};