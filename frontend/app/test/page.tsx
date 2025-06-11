// app/testfirebase/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // adjust path if needed
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export default function TestFirebase() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Signed up!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    alert('Logged out');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Firebase (App Router)</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      /><br /><br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      /><br /><br />
      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Log In</button>
      <button onClick={logout}>Log Out</button>

      <div style={{ marginTop: 20 }}>
        <strong>User:</strong>
        <pre>{user ? JSON.stringify(user, null, 2) : 'None'}</pre>
      </div>
    </div>
  );
}
