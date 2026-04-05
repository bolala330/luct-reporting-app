import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { auth, onAuthStateChanged, db, doc, getDoc, signOut as firebaseSignOut } from '../config/firebase';
import { ROLES } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    if (!auth) {
      setInitError("Firebase Auth is not connected. Check your config.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          if (!db) throw new Error("Firestore not connected");
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            setUserProfile({ uid: firebaseUser.uid, ...profileDoc.data() });
          } else {
            setInitError("User exists in Auth, but profile is missing in Database. Please delete this account in Firebase Console and Register again.");
          }
        } catch (error) {
          console.error("Database error:", error);
          setInitError("Database error: " + error.message);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setInitError(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    if (auth) await firebaseSignOut(auth);
    setUserProfile(null);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#d4a853', fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  if (initError && user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#f87171', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>{initError}</Text>
        <Text onPress={logout} style={{ color: '#d4a853', fontSize: 14, textDecorationLine: 'underline' }}>Logout</Text>
      </View>
    );
  }

  const value = {
    user, userProfile, logout, initError,
    isAuthenticated: !!user && !!userProfile,
    role: userProfile?.role || null,
    isStudent: userProfile?.role === ROLES.STUDENT,
    isLecturer: userProfile?.role === ROLES.LECTURER,
    isPRL: userProfile?.role === ROLES.PRL,
    isPL: userProfile?.role === ROLES.PL,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center', padding: 40 }
});