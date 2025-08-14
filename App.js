import './firebaseConfig'; // This line initializes Firebase
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Correct import path

// Import Screens and Navigators
import CalculateFareScreen from './src/screens/home/CalculateFareScreen';
import HistoryScreen from './src/screens/history/HistoryScreen';
import ReportStack from './src/navigation/ReportStack';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 30,
          fontWeight: 'bold',
          color: 'green',
        },
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5 },
        tabBarLabelStyle: { fontSize: 14, color: 'green' },
      }}
    >
      <Tab.Screen
        name="FareCalculator"
        component={CalculateFareScreen}
        options={{
          title: 'FairRide Koronadal',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="TripHistory"
        component={HistoryScreen}
        options={{
          title: 'Trip History',
          tabBarLabel: 'History',
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        options={{ title: 'Profile' }}
      >
        {() => <ProfileScreen onLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );

  if (loading) {
    // You can return a loading spinner here if you want
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? <MainTabs /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
