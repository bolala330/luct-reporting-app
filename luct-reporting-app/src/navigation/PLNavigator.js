import React from 'react';
import { Text } from 'react-native'; // ADDED THIS
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/theme';
import PLDashboard from '../screens/pl/PLDashboard';
import PLCourses from '../screens/pl/PLCourses';
import PLReports from '../screens/pl/PLReports';
import PLMonitoring from '../screens/pl/PLMonitoring';
import PLClasses from '../screens/pl/PLClasses';
import PLLectures from '../screens/pl/PLLectures';
import PLRating from '../screens/pl/PLRating';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, color }) {
  const icons = { home: '🏠', courses: '📚', reports: '📝', chart: '📊', classes: '🏫', lectures: '👤', star: '⭐' };
  return <Text style={{ fontSize: 20 }}>{icons[name] || '●'}</Text>;
}

function PLTabs() {
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
      <Tab.Screen name="PLHome" component={PLDashboard} options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
      <Tab.Screen name="PLCourses" component={PLCourses} options={{ tabBarLabel: 'Courses', tabBarIcon: ({ color }) => <TabIcon name="courses" color={color} /> }} />
      <Tab.Screen name="PLReports" component={PLReports} options={{ tabBarLabel: 'Reports', tabBarIcon: ({ color }) => <TabIcon name="reports" color={color} /> }} />
      <Tab.Screen name="PLClasses" component={PLClasses} options={{ tabBarLabel: 'Classes', tabBarIcon: ({ color }) => <TabIcon name="classes" color={color} /> }} />
      <Tab.Screen name="PLLectures" component={PLLectures} options={{ tabBarLabel: 'Lectures', tabBarIcon: ({ color }) => <TabIcon name="lectures" color={color} /> }} />
      <Tab.Screen name="PLMonitor" component={PLMonitoring} options={{ tabBarLabel: 'Monitor', tabBarIcon: ({ color }) => <TabIcon name="chart" color={color} /> }} />
      <Tab.Screen name="PLRate" component={PLRating} options={{ tabBarLabel: 'Rate', tabBarIcon: ({ color }) => <TabIcon name="star" color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function PLNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PLTabs" component={PLTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}