import { db, collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, serverTimestamp } from '../config/firebase';
import { COLLECTIONS } from '../constants';

export async function submitReport(reportData) {
  const docRef = await addDoc(collection(db, COLLECTIONS.REPORTS), {
    ...reportData, createdAt: serverTimestamp(), status: 'submitted',
  });
  return docRef.id;
}

export async function getLecturerReports(lecturerId) {
  const q = query(collection(db, COLLECTIONS.REPORTS), where('lecturerId', '==', lecturerId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPRLReports(prlId) {
  const coursesQuery = query(collection(db, COLLECTIONS.COURSES), where('prlId', '==', prlId));
  const courseSnap = await getDocs(coursesQuery);
  const courseIds = courseSnap.docs.map((d) => d.id);
  if (courseIds.length === 0) return [];
  
  const reportsQuery = query(collection(db, COLLECTIONS.REPORTS), orderBy('createdAt', 'desc'));
  const reportSnap = await getDocs(reportsQuery);
  return reportSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((r) => courseIds.includes(r.courseId));
}

export async function getAllReports() {
  const q = query(collection(db, COLLECTIONS.REPORTS), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addReportFeedback(reportId, prlId, comment) {
  const feedbackRef = doc(db, COLLECTIONS.FEEDBACK, reportId);
  await updateDoc(feedbackRef, { reportId, prlId, comment, createdAt: serverTimestamp() });
  await updateDoc(doc(db, COLLECTIONS.REPORTS, reportId), { status: 'reviewed' });
}