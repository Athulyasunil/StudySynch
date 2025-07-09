// components/auth/AuthForm.tsx
'use client';

import React from 'react';

type Props = {
  isSignUp: boolean;
  email: string;
  password: string;
  username: string;
  error: string;
  loading: boolean;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setUsername: (val: string) => void;
  onSubmit: () => void;
  toggleMode: () => void;
};

export default function AuthForm({
  isSignUp,
  email,
  password,
  username,
  error,
  loading,
  setEmail,
  setPassword,
  setUsername,
  onSubmit,
  toggleMode,
}: Props) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Start your journey with us' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          {isSignUp && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a unique username"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
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

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="ml-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              onClick={toggleMode}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
