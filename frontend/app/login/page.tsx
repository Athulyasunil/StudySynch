'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  getIdTokenResult,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';
import AuthForm from '@/app/components/auth/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const hasRedirected = useRef(false);


  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setAuthChecked(true);

            if (user && !hasRedirected.current) {
    try {
      const tokenResult = await getIdTokenResult(user);
      if (!tokenResult?.token) {
        await signOut(auth);
        return;
      }

      const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
      const newUsername = localStorage.getItem('newUsername');

      await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...(justSignedUp && newUsername ? { username: newUsername } : {}),
        }),
      });

      // Cleanup
      localStorage.removeItem('newUsername');
      localStorage.removeItem('justSignedUp');

      hasRedirected.current = true;
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    } catch (err) {
      console.error(err);
      await signOut(auth);
    }
  }
});
        return () => unsubscribe();
      })
      .catch(console.error);
  }, [router]);

  const login = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const signUp = async () => {
    try {
      setLoading(true);
      setError('');

      localStorage.setItem('newUsername', username);
      localStorage.setItem('justSignedUp', 'true');

      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = () => {
    if (isSignUp) {
      signUp();
    } else {
      login();
    }
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        Checking authentication...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        Redirecting to dashboard...
      </div>
    );
  }

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
    <div className="w-full max-w-md">
      <AuthForm
        isSignUp={isSignUp}
        email={email}
        password={password}
        username={username}
        loading={loading}
        error={error}
        setEmail={setEmail}
        setPassword={setPassword}
        setUsername={setUsername}
        onSubmit={handleSubmit}
        toggleMode={() => setIsSignUp((prev) => !prev)}
      />
    </div>
  </div>
);
}
