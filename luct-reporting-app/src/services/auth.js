import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, doc, setDoc, serverTimestamp } from '../config/firebase';
import { COLLECTIONS, FACULTY_NAME } from '../constants';

export async function registerUser(email, password, profileData) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { name, role, studentId, employeeId } = profileData;

  const userProfile = {
    name, email, role, faculty: FACULTY_NAME, createdAt: serverTimestamp(),
  };

  if (role === 'student' && studentId) userProfile.studentId = studentId;
  if ((role === 'lecturer' || role === 'prl' || role === 'pl') && employeeId) userProfile.employeeId = employeeId;

  await setDoc(doc(db, COLLECTIONS.USERS, credential.user.uid), userProfile);
  return credential;
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}