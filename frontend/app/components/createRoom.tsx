'use client';

import { useState } from 'react';
import { addDoc,updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function CreateRoom() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateRoom = async () => {
    const user = auth.currentUser;
    if (!user) {
      setMessage('You must be logged in.');
      return;
    }

    if (!name.trim()) {
      setMessage('Room name is required.');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: name.trim(),
        description: description.trim(),
        createdBy: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp(),
      });

      // Now update the document with its own ID
      await updateDoc(docRef, {
        roomId: docRef.id,
      });
      setMessage('Room created!');
      setName('');
      setDescription('');
      setOpen(false);
    } catch (err) {
      console.error(err);
      setMessage('Failed to create room.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setMessage('Room created!');
          setName('');
          setDescription('');
          setOpen(true);
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
      >
        Create New Room
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">
            <button
              className="absolute top-3 right-4 text-xl font-bold text-gray-400 hover:text-black"
              onClick={() => {
                setOpen(false);
                setMessage('');
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Create New Room</h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Room Name"
              className="w-full mb-3 px-4 py-2 border rounded"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full mb-3 px-4 py-2 border rounded"
              rows={3}
            />

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>

            {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}
