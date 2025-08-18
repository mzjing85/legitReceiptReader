import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useEffect } from 'react';

export default function TabLayout() {
  const { isLoggedIn } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    console.log('TabLayout: isLoggedIn changed to:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          href: isLoggedIn ? "/" : null,
        }}
      />
      <Tabs.Screen 
        name="scan" 
        options={{
          title: 'Scan',
          href: isLoggedIn ? "/scan" : null,
        }}
      />
      <Tabs.Screen 
        name="login" 
        options={{
          title: 'Login',
          href: !isLoggedIn ? "/login" : null,
        }}
      />
      <Tabs.Screen 
        name="signup" 
        options={{
          title: 'Sign Up',
          href: !isLoggedIn ? "/signup" : null,
        }}
      />
    </Tabs>
  );
}
