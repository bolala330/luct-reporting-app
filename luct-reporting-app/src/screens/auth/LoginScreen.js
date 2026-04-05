import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../theme/theme';
import { ROLE_LABELS } from '../../constants';
import { loginUser } from '../../services/auth';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = Object.entries(ROLE_LABELS);

  async function handleLogin() {
    // 1. Check if fields are empty
    if (!email.trim() || !password.trim() || !role) {
      Alert.alert("Missing Info", "Please select a role and enter email/password.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Try to log in
      await loginUser(email.trim(), password);
      
      // 3. If it gets to this line, login was 100% successful!
      Alert.alert("Success!", "Credentials are correct. Logging you in...");
      
    } catch (error) {
      // 4. If it jumps here, Firebase rejected the email/password
      console.log("FIREBASE ERROR CODE:", error.code);
      console.log("FIREBASE ERROR MESSAGE:", error.message);

      let msg = "Unknown error occurred.";
      
      if (error.code === 'auth/user-not-found') {
        msg = "Account not found. Please register first.";
      } 
      else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = "Incorrect password.";
      } 
      else if (error.code === 'auth/invalid-email') {
        msg = "Email format is invalid.";
      } 
      else if (error.message && error.message.includes("Firebase Auth is not configured")) {
        msg = "Firebase is not connected! Check your config file.";
      } 
      else {
        msg = "Error: " + (error.message || "Check console (F12) for details.");
      }

      // Show the exact error to the user
      Alert.alert("Login Failed", msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
      
      <View style={styles.logoArea}>
        <View style={[styles.logoMark, { backgroundColor: colors.accent }]}>
          <Text style={styles.logoText}>L</Text>
        </View>
        <Text style={[styles.title, { color: colors.fg }]}>LUCT Reporting</Text>
        <Text style={[styles.subtitle, { color: colors.fgMuted }]}>Faculty of ICT</Text>
      </View>

      <Text style={[styles.label, { color: colors.fgMuted }]}>Select Role</Text>
      <View style={styles.roleGrid}>
        {roles.map(([key, label]) => (
          <TouchableOpacity 
            key={key} 
            style={[styles.roleCard, { 
              backgroundColor: role === key ? colors.accentDim : colors.bgElevated, 
              borderColor: role === key ? colors.accent : colors.border 
            }]} 
            onPress={() => setRole(key)}
          >
            <Text style={{ fontSize: 18 }}>
              {key === 'student' ? '🎓' : key === 'lecturer' ? '👨‍🏫' : key === 'prl' ? '🏛️' : '👔'}
            </Text>
            <Text style={{ fontSize: 10, fontWeight: '600', textAlign: 'center', color: role === key ? colors.accent : colors.fgMuted, marginTop: 4 }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.fgMuted }]}>Email Address</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} 
        placeholder="email@luct.edu.my" 
        placeholderTextColor={colors.fgMuted} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none" 
      />

      <Text style={[styles.label, { color: colors.fgMuted }]}>Password</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: colors.bgElevated, borderColor: colors.border, color: colors.fg }]} 
        placeholder="Min 6 characters" 
        placeholderTextColor={colors.fgMuted} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: colors.accent, opacity: isLoading ? 0.6 : 1 }]} 
        onPress={handleLogin} 
        disabled={isLoading}
      >
        <Text style={styles.btnText}>{isLoading ? 'Checking...' : 'Sign In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
        <Text style={{ color: colors.fgMuted, fontSize: 13 }}>
          No account? <Text style={{ color: colors.accent, fontWeight: '600' }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  scrollContent: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  logoArea: { alignItems: 'center', marginBottom: 30 }, 
  logoMark: { width: 70, height: 70, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoText: { fontSize: 30, fontWeight: '900', color: '#0f0f0f' }, 
  title: { fontSize: 26, fontWeight: '900' }, 
  subtitle: { fontSize: 12, marginTop: 4 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  roleCard: { width: '47%', padding: 14, borderRadius: 14, borderWidth: 1.5, alignItems: 'center' },
  input: { borderWidth: 1.5, borderRadius: 12, padding: 14, fontSize: 14, marginTop: 2 },
  btn: { marginTop: 28, borderRadius: 12, padding: 16, alignItems: 'center' }, 
  btnText: { fontSize: 15, fontWeight: '700', color: '#0f0f0f' },
  link: { alignItems: 'center', marginTop: 20 }
});