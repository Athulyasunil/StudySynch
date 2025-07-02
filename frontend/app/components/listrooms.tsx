'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import Link from 'next/link';
import DeleteRoomButton from './room/DeleteButton';


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
      <div key={room.id} className="relative">
        {/* Delete Button in Top-Right Corner */}
        <div className="absolute top-2 right-2 z-10">
          <DeleteRoomButton roomId={room.id} createdBy={room.createdBy} />
        </div>

        <Link href={`/room/${room.id}`}>
          <div className="flex flex-col justify-between h-full p-5 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all cursor-pointer hover:-translate-y-1 duration-200">
            <div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-1">{room.name}</h3>
              {room.description && (
                <p className="text-gray-600 text-sm mb-4">{room.description}</p>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Created at:{' '}
              {room.createdAt?.toDate
                ? room.createdAt.toDate().toLocaleString()
                : 'N/A'}
            </p>
          </div>
        </Link>
      </div>
    ))}
  </div>
);
}
