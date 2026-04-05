import { doc } from '../config/firebase';
import { db, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc } from '../config/firebase';
import { COLLECTIONS } from '../constants';

export async function createClass(classData) {
  const docRef = await addDoc(collection(db, COLLECTIONS.CLASSES), { ...classData, createdAt: new Date().toISOString() });
  return docRef.id;
}

export async function getLecturerClasses(lecturerId) {
  const q = query(collection(db, COLLECTIONS.CLASSES), where('lecturerId', '==', lecturerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getClassesByCourse(courseId) {
  const q = query(collection(db, COLLECTIONS.CLASSES), where('courseId', '==', courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllClasses() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.CLASSES));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateClass(classId, updates) { await updateDoc(doc(db, COLLECTIONS.CLASSES, classId), updates); }
export async function deleteClass(classId) { await deleteDoc(doc(db, COLLECTIONS.CLASSES, classId)); }