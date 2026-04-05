import React from 'react';
import { Text } from 'react-native'; // ADDED THIS
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/theme';
import StudentDashboard from '../screens/student/StudentDashboard';
import StudentAttendance from '../screens/student/StudentAttendance';
import StudentMonitoring from '../screens/student/StudentMonitoring';
import StudentRating from '../screens/student/StudentRating';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, color }) {
  const icons = { home: '🏠', clipboard: '📋', chart: '📊', star: '⭐', classes: '🏫', reports: '📝', courses: '📚', lectures: '👤' };
  return <Text style={{ fontSize: 20 }}>{icons[name] || '●'}</Text>;
}

function StudentTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'rgba(15,15,15,0.95)', borderTopColor: colors.border, paddingBottom: 8, height: 65 },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.fgMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      <Tab.Screen name="StudentHome" component={StudentDashboard} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
      <Tab.Screen name="StudentAttendance" component={StudentAttendance} options={{ tabBarLabel: 'Attendance', tabBarIcon: ({ color }) => <TabIcon name="clipboard" color={color} /> }} />
      <Tab.Screen name="StudentMonitoring" component={StudentMonitoring} options={{ tabBarLabel: 'Monitor', tabBarIcon: ({ color }) => <TabIcon name="chart" color={color} /> }} />
      <Tab.Screen name="StudentRating" component={StudentRating} options={{ tabBarLabel: 'Rate', tabBarIcon: ({ color }) => <TabIcon name="star" color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function StudentNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StudentTabs" component={StudentTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}