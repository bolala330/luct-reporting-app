import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './luct-reporting-app/src/context/AuthContext';
import AppNavigator from './luct-reporting-app/src/navigation/AppNavigator';
import { ThemeProvider } from './luct-reporting-app/src/theme/theme';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#0f0f0f" />
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}