import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '../config/firebase';
import { COLLECTIONS, FACULTY_NAME, SEMESTER } from '../constants';

export async function createCourse(courseData) {
  const docRef = await addDoc(collection(db, COLLECTIONS.COURSES), {
    ...courseData, faculty: FACULTY_NAME, semester: SEMESTER, createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getLecturerCourses(lecturerId) {
  const q = query(collection(db, COLLECTIONS.COURSES), where('lecturerId', '==', lecturerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPRLCourses(prlId) {
  const q = query(collection(db, COLLECTIONS.COURSES), where('prlId', '==', prlId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllCourses() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.COURSES));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateCourse(courseId, updates) { await updateDoc(doc(db, COLLECTIONS.COURSES, courseId), updates); }
export async function deleteCourse(courseId) { await deleteDoc(doc(db, COLLECTIONS.COURSES, courseId)); }