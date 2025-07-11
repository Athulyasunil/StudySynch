'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinRoomModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    try {
      let roomId = input.trim();

      // Accept either full URL or just ID
      if (roomId.includes('/join/')) {
        const parts = roomId.split('/join/');
        roomId = parts[1]?.split(/[?#]/)[0] || '';
      }

      if (!roomId || roomId.length < 4) {
        setError('Invalid Room ID or link');
        return;
      }

      onClose(); // close modal
      router.push(`/join/${roomId}`);
    } catch {
      setError('Invalid link or ID');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Join Room</h2>
        <p className="text-sm text-gray-500 mb-3">Paste the invite link or Room ID below:</p>
        <input
          type="text"
          placeholder="e.g. https://yourapp.com/join/abc123"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          className="w-full border px-4 py-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleJoin}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Join
        </button>
      </div>
    </div>
  );
}
