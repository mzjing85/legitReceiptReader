import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    router.replace(isLoggedIn ? '/' : '../login');
  }, [isLoggedIn]);

  return null; // or a loading spinner
}

