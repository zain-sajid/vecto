import { useRouter } from 'next/router';
import { useAuth } from '../../context/authContext';

/*
  Wrapper component for routes that will redirect to homepage if the user is already logged in.
  Example: /login, /register
*/

export default function AuthenticationRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.replace('/scan');
    return <h1>Loading...</h1>;
  }

  return children;
}
