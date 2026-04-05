import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, serverTimestamp } from 'firebase/firestore';

// Your keys
const firebaseConfig = {
  apiKey: "AIzaSyDf2gKcdN6gQYnLUZdQV6X07PdBm8cBwWQ",
  authDomain: "reportingapp-e1e40.firebaseapp.com",
  projectId: "reportingapp-e1e40",
  storageBucket: "reportingapp-e1e40.firebasestorage.app",
  messagingSenderId: "1079138763043",
  appId: "1:1079138763043:web:e751bf3d5e719aba238c96"
};

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase connected successfully!");
} catch (error) {
  console.warn("Firebase failed to connect. App is running in offline mode.", error);
  // We create dummy objects so the app doesn't crash when calling firebase functions
  app = null; auth = null; db = null;
}

export {
  app, auth, db,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter, serverTimestamp,
};