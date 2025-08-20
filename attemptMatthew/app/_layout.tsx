import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <InnerStack />
    </AuthProvider>
  );
}

function InnerStack() {
  const { isLoggedIn, loading } = useAuth();
  
  console.log('Auth State - isLoggedIn:', isLoggedIn, 'loading:', loading);
  
  if (loading) {
    console.log('Still loading auth state...');
    return null;
  }

  console.log('Auth state loaded, isLoggedIn:', isLoggedIn);

  // Always render the Stack - let initialRouteName handle the routing
  return (
    <Stack
      initialRouteName={isLoggedIn ? "(tabs)" : "login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}