import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const provider = new GithubAuthProvider();

export const AuthContextProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = (name, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        const user = credential.user;

        console.log('Signed up successfully!', user);

        updateProfile(credential.user, {
          displayName: name,
        });

        router.push('/scan');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const login = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        const user = credential.user;
        console.log('Signed in successfully!', user);
        router.push('/scan');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    router.push('/login');
  };

  const loginWithGithub = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;
        console.log('Signed in successfully!', user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        loginWithGithub,
        logout,
      }}
    >
      {/* TODO: replace with loader */}
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
