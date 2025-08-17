import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const { isLoggedIn } = useAuth();
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      {isLoggedIn ? (
        <>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => (
                // Use your icon component here
                // Example: <Ionicons name="home" size={24} color={color} />
                null
              ),
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: 'Scan',
              tabBarIcon: ({ color }) => (
                // Use your icon component here
                // Example: <Ionicons name="camera" size={24} color={color} />
                null
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen
            name="login"
            options={{
              title: 'Login',
              tabBarIcon: ({ color }) => (
                // Use your icon component here
                null
              ),
            }}
          />
          <Tabs.Screen
            name="signup"
            options={{
              title: 'Sign Up',
              tabBarIcon: ({ color }) => (
                // Use your icon component here
                null
              ),
            }}
          />
        </>
      )}
    </Tabs>
  );
}
