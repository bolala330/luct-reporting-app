import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Generate and download an Excel report from report data.
 * @param {Array} reports - Array of report objects
 * @param {string} fileName - Name for the Excel file (without extension)
 * @returns {Promise<void>}
 *
 * Step-by-step process:
 * 1. Transform report data into a flat array of rows
 * 2. Create a worksheet from the row data
 * 3. Create a workbook and attach the worksheet
 * 4. Generate the Excel binary buffer
 * 5. Write the buffer to a local file using expo-file-system
 * 6. Share the file using expo-sharing
 */
export async function generateExcelReport(reports, fileName = 'LUCT_Reports') {
  // Step 1: Transform data into flat rows
  const rows = reports.map((r, index) => ({
    '#': index + 1,
    'Faculty': r.faculty || 'FICT',
    'Class Name': r.className || '',
    'Week': r.week || '',
    'Date': r.date || '',
    'Course Name': r.courseName || '',
    'Course Code': r.courseCode || '',
    'Lecturer Name': r.lecturerName || '',
    'Students Present': r.actualPresent ?? '',
    'Total Registered': r.totalRegistered ?? '',
    'Attendance %': r.totalRegistered
      ? `${Math.round(((r.actualPresent || 0) / r.totalRegistered) * 100)}%`
      : '',
    'Venue': r.venue || '',
    'Scheduled Time': r.scheduledTime || '',
    'Topic Taught': r.topic || '',
    'Learning Outcomes': r.learningOutcomes || '',
    'Recommendations': r.recommendations || '',
    'Status': r.status || 'submitted',
    'Submitted On': r.createdAt
      ? new Date(r.createdAt.seconds * 1000).toLocaleDateString()
      : '',
  }));

  // Step 2: Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 4 },   // #
    { wch: 12 },  // Faculty
    { wch: 20 },  // Class Name
    { wch: 8 },   // Week
    { wch: 12 },  // Date
    { wch: 30 },  // Course Name
    { wch: 12 },  // Course Code
    { wch: 25 },  // Lecturer Name
    { wch: 14 },  // Students Present
    { wch: 14 },  // Total Registered
    { wch: 12 },  // Attendance %
    { wch: 18 },  // Venue
    { wch: 16 },  // Scheduled Time
    { wch: 35 },  // Topic Taught
    { wch: 40 },  // Learning Outcomes
    { wch: 40 },  // Recommendations
    { wch: 12 },  // Status
    { wch: 14 },  // Submitted On
  ];

  // Step 3: Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lecture Reports');

  // Step 4: Generate Excel binary
  const excelBuffer = XLSX.write(workbook, {
    type: 'base64',
    bookType: 'xlsx',
  });

  // Step 5: Write to local file
  const fileUri = `${FileSystem.cacheDirectory}${fileName}_${Date.now()}.xlsx`;
  await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Step 6: Share / download the file
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: `Download ${fileName}`,
      UTI: 'com.microsoft.excel.xlsx',
    });
  } else {
    console.log('File saved to:', fileUri);
  }
}

/**
 * Generate an Excel report for attendance data.
 * @param {Array} attendanceData - Array of attendance records
 * @param {string} fileName
 */
export async function generateAttendanceReport(attendanceData, fileName = 'LUCT_Attendance') {
  const rows = [];

  attendanceData.forEach((record) => {
    (record.records || []).forEach((student) => {
      rows.push({
        'Date': record.date || '',
        'Class': record.className || '',
        'Student ID': student.studentId || '',
        'Student Name': student.studentName || '',
        'Status': student.status || '',
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 25 }, { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

  const excelBuffer = XLSX.write(workbook, {
    type: 'base64',
    bookType: 'xlsx',
  });

  const fileUri = `${FileSystem.cacheDirectory}${fileName}_${Date.now()}.xlsx`;
  await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: `Download ${fileName}`,
    });
  }
}