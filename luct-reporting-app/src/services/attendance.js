// Mock attendance service
export async function saveAttendance(attendanceData) { return 'mock-id'; }
export async function getClassAttendance(classId) { return []; }
export async function getStudentAttendance(studentId) { return []; }
export function calculateAttendancePercentage(records, studentId) { return 0; }