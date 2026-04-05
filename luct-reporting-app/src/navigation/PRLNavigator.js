import React from 'react';
import { Text } from 'react-native'; // ADDED THIS
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/theme';
import PRLDashboard from '../screens/prl/PRLDashboard';
import PRLCourses from '../screens/prl/PRLCourses';
import PRLReports from '../screens/prl/PRLReports';
import PRLMonitoring from '../screens/prl/PRLMonitoring';
import PRLClasses from '../screens/prl/PRLClasses';
import PRLRating from '../screens/prl/PRLRating';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, color }) {
  const icons = { home: '🏠', courses: '📚', reports: '📝', chart: '📊', classes: '🏫', star: '⭐' };
  return <Text style={{ fontSize: 20 }}>{icons[name] || '●'}</Text>;
}

function PRLTabs() {
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
      <Tab.Screen name="PRLHome" component={PRLDashboard} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
      <Tab.Screen name="PRLCourses" component={PRLCourses} options={{ tabBarLabel: 'Courses', tabBarIcon: ({ color }) => <TabIcon name="courses" color={color} /> }} />
      <Tab.Screen name="PRLReports" component={PRLReports} options={{ tabBarLabel: 'Reports', tabBarIcon: ({ color }) => <TabIcon name="reports" color={color} /> }} />
      <Tab.Screen name="PRLClasses" component={PRLClasses} options={{ tabBarLabel: 'Classes', tabBarIcon: ({ color }) => <TabIcon name="classes" color={color} /> }} />
      <Tab.Screen name="PRLMonitor" component={PRLMonitoring} options={{ tabBarLabel: 'Monitor', tabBarIcon: ({ color }) => <TabIcon name="chart" color={color} /> }} />
      <Tab.Screen name="PRLRate" component={PRLRating} options={{ tabBarLabel: 'Rate', tabBarIcon: ({ color }) => <TabIcon name="star" color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function PRLNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PRLTabs" component={PRLTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}