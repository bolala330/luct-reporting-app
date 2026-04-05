import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import LecturerNavigator from './LecturerNavigator';
import PRLNavigator from './PRLNavigator';
import PLNavigator from './PLNavigator';

export default function AppNavigator() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <AuthNavigator />;

  switch (role) {
    case 'student': return <StudentNavigator />;
    case 'lecturer': return <LecturerNavigator />;
    case 'prl': return <PRLNavigator />;
    case 'pl': return <PLNavigator />;
    default: return <AuthNavigator />;
  }
}