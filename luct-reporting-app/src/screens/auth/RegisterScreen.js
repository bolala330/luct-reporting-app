import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../theme/theme';
import { ROLE_LABELS } from '../../constants';
import { registerUser } from '../../services/auth';

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // ADDED
  const [role, setRole] = useState('');
  const [idField, setIdField] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = Object.entries(ROLE_LABELS);

  async function handleRegister() {
    // 1. Check empty required fields
    if (!name.trim() || !email.trim() || !password.trim() || !role) {
      Alert.alert("Missing Info", "Please fill in Name, Email, Password, and select a Role.");
      return;
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // 3. Validate password length
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    // 4. Validate password match
    if (password !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    // 5. Validate ID field based on role
    if (role && !idField.trim()) {
      Alert.alert("Missing ID", `Please enter your ${role === 'student' ? 'Student' : 'Employee'} ID.`);
      return;
    }

    setIsLoading(true);

    try {
      const profileData = { name: name.trim(), role };
      if (role === 'student') profileData.studentId = idField.trim();
      else profileData.employeeId = idField.trim();

      await registerUser(email.trim(), password, profileData);
      
      // Success -> Navigate back to Login
      Alert.alert("Success!", "Account created! You can now log in.", [
        {
          text: "OK",
          onPress: () => navigation.replace("Login") // use replace so they can't go back to register
        }
      ]);

    } catch (error) {
      console.log("FIREBASE REGISTER ERROR:", error.code);
      console.log("FIREBASE FULL ERROR:", error.message);

      let msg = "Unknown error.";
      
      if (error.code === 'auth/email-already-in-use') {
        msg = "This email is already registered. Try logging in instead.";
      } 
      else if (error.code === 'auth/invalid-email') {
        msg = "The email format is invalid.";
      } 
      else if (error.code === 'auth/weak-password') {
        msg = "Password is too weak. Use at least 6 characters.";
      }
      else if (error.message && error.message.includes("Firebase Auth is not configured")) {
        msg = "Firebase is not connected! Check src/config/firebase.js";
      }
      else if (error.message && error.message.includes("PERMISSION_DENIED")) {
        msg = "FIRESTORE PERMISSION DENIED: Go to Firebase Console > Firestore Database > Rules, and change 'allow read, write: if false;' to 'allow read, write: if true;' then click Publish.";
      }
      else {
        msg = "Error: " + (error.message || "Check console for details.");
      }

      Alert.alert("Registration Failed", msg);
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.bg }]} 
      contentContainerStyle={styles.scrollContent}
      // Prevent keyboard from pushing content off screen
      keyboardShouldPersistTaps="handled" 
    >
      
      <Text style={[styles.title, { color: colors.fg }]}>Create Account</Text>
      <Text style={[styles.subtitle, { color: colors.fgMuted }]}>Join LUCT Reporting System</Text>

      <Text style={[styles.label, { color: colors.fgMuted }]}>Role</Text>
      <View style={styles.roleGrid}>
        {roles.map(([key, label]) => (
          <TouchableOpacity 
            key={key} 
            style={[styles.roleCard, { 
              backgroundColor: role === key ? colors.accentDim : colors.bgElevated, 
              borderColor: role === key ? colors.accent : colors.border 
            }]} 
            onPress={() => !isLoading && setRole(key)} // Prevent changing role while loading
          >
            <Text style={{ fontSize: 16 }}>
              {key === 'student' ? '🎓' : key === 'lecturer' ? '👨‍🏫' : key === 'prl' ? '🏛️' : '👔'}
            </Text>
            <Text style={{ fontSize: 10, fontWeight: '600', textAlign: 'center', color: role === key ? colors.accent : colors.fgMuted, marginTop: 4 }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.fgMuted }]}>Full Name</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} 
        placeholder="Dr. Ahmad" 
        placeholderTextColor={colors.fgMuted} 
        value={name} 
        onChangeText={setName}
        editable={!isLoading}
      />

      <Text style={[styles.label, { color: colors.fgMuted }]}>Email</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} 
        placeholder="email@luct.edu.my" 
        placeholderTextColor={colors.fgMuted} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none"
        editable={!isLoading}
      />

      <Text style={[styles.label, { color: colors.fgMuted }]}>Password</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} 
        placeholder="Min 6 characters" 
        placeholderTextColor={colors.fgMuted} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry
        autoCapitalize="none"
        editable={!isLoading}
      />

      {/* ADDED: Confirm Password Field */}
      <Text style={[styles.label, { color: colors.fgMuted }]}>Confirm Password</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} 
        placeholder="Re-enter password" 
        placeholderTextColor={colors.fgMuted} 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        secureTextEntry
        autoCapitalize="none"
        editable={!isLoading}
      />

      {role ? (
        <>
          <Text style={[styles.label, { color: colors.fgMuted }]}>
            {role === 'student' ? 'Student ID' : 'Employee ID'}
          </Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} 
            placeholder="e.g. SE2024001" 
            placeholderTextColor={colors.fgMuted} 
            value={idField} 
            onChangeText={setIdField} 
            autoCapitalize="none"
            editable={!isLoading}
          />
        </>
      ) : null}

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: colors.accent, opacity: isLoading ? 0.6 : 1 }]} 
        onPress={handleRegister} 
        disabled={isLoading}
      >
        <Text style={styles.btnText}>{isLoading ? 'Creating...' : 'Create Account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link} disabled={isLoading}>
        <Text style={{ color: colors.fgMuted, fontSize: 13 }}>
          Have an account? <Text style={{ color: colors.accent, fontWeight: '600' }}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  scrollContent: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '900' }, 
  subtitle: { fontSize: 13, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  roleCard: { width: '47%', padding: 14, borderRadius: 14, borderWidth: 1.5, alignItems: 'center' },
  input: { borderWidth: 1.5, borderRadius: 12, padding: 14, fontSize: 14, marginTop: 2 },
  btn: { marginTop: 28, borderRadius: 12, padding: 16, alignItems: 'center' }, 
  btnText: { fontSize: 15, fontWeight: '700', color: '#0f0f0f' },
  link: { alignItems: 'center', marginTop: 20 }
});