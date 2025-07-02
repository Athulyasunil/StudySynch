'use client';

import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getIdTokenResult } from "firebase/auth";
import { useRef } from "react";



export default function LoginPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const hasRedirected = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setAuthChecked(true);

      if (user && !hasRedirected.current) {
        try {
          // Optional: check token validity
          const tokenResult = await getIdTokenResult(user);
          if (!tokenResult || !tokenResult.token) return;

          await fetch("/api/users/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
            }),
          });

          hasRedirected.current = true;
          router.push("/dashboard");
        } catch (error) {
          console.error("Failed to sync user to backend or redirect:", error);
        }
      }
    });

    return () => unsubscribe();
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
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      signUp();
    } else {
      login();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmail('');
      setPassword('');
      setError('');
    } catch {
      setError('Error signing out');
    }
  };

  // ✅ Show loading or dashboard-like screen briefly
  if (authChecked && user) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        Redirecting...
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isSignUp ? 'Start your journey with us' : 'Sign in to your account'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                className="ml-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
