'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export default function RoomList() {
  const [rooms, setRooms] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'rooms'), where('createdBy', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading rooms...</p>;
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-6">
        <p>No rooms found.</p>
        <p className="text-sm text-gray-400">Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="p-4 bg-white rounded-xl shadow border border-gray-100 hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold text-indigo-700">{room.name}</h3>
          {room.description && (
            <p className="text-gray-600 mt-1 text-sm">{room.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Created at:{' '}
            {room.createdAt?.toDate
              ? room.createdAt.toDate().toLocaleString()
              : 'N/A'}
          </p>
        </div>
      ))}
    </div>
  );
}
