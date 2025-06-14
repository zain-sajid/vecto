import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import { useEffect } from 'react';

/*
  Wrapper component for routes that will redirect to the login page if the user is not logged in.
  Examples: /favorites
*/

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.user) {
      router.replace('/login');
    }
  }, []);

  return children;
}
