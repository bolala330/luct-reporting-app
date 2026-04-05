import React from 'react';
import { Text } from 'react-native'; // ADDED THIS
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/theme';
import LecturerDashboard from '../screens/lecturer/LecturerDashboard';
import LecturerClasses from '../screens/lecturer/LecturerClasses';
import ReportFormScreen from '../screens/lecturer/ReportFormScreen';
import LecturerReports from '../screens/lecturer/LecturerReports';
import LecturerMonitoring from '../screens/lecturer/LecturerMonitoring';
import LecturerRating from '../screens/lecturer/LecturerRating';
import LecturerAttendance from '../screens/lecturer/LecturerAttendance';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, color }) {
  const icons = { home: '🏠', classes: '🏫', reports: '📝', chart: '📊', star: '⭐', clipboard: '📋' };
  return <Text style={{ fontSize: 20 }}>{icons[name] || '●'}</Text>;
}

function LecturerTabs() {
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
      <Tab.Screen name="LecturerHome" component={LecturerDashboard} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
      <Tab.Screen name="LecturerClasses" component={LecturerClasses} options={{ tabBarLabel: 'Classes', tabBarIcon: ({ color }) => <TabIcon name="classes" color={color} /> }} />
      <Tab.Screen name="LecturerReports" component={LecturerReports} options={{ tabBarLabel: 'Reports', tabBarIcon: ({ color }) => <TabIcon name="reports" color={color} /> }} />
      <Tab.Screen name="LecturerMonitor" component={LecturerMonitoring} options={{ tabBarLabel: 'Monitor', tabBarIcon: ({ color }) => <TabIcon name="chart" color={color} /> }} />
      <Tab.Screen name="LecturerRate" component={LecturerRating} options={{ tabBarLabel: 'Rate', tabBarIcon: ({ color }) => <TabIcon name="star" color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function LecturerNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LecturerTabs" component={LecturerTabs} />
        <Stack.Screen name="ReportForm" component={ReportFormScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="LecturerAttendance" component={LecturerAttendance} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}