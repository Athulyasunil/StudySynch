'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import Link from 'next/link';
import DeleteRoomButton from './room/DeleteButton';

export default function RoomList() {
  const [createdRooms, setCreatedRooms] = useState<DocumentData[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const createdQuery = query(
      collection(db, 'rooms'),
      where('createdBy', '==', user.uid)
    );

    const joinedQuery = query(
      collection(db, 'rooms'),
      where('members', 'array-contains', user.uid)
    );

    const unsubscribeCreated = onSnapshot(createdQuery, (snapshot) => {
      const created = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCreatedRooms(created);
    });

    const unsubscribeJoined = onSnapshot(joinedQuery, (snapshot) => {
      const joined = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as { [key: string]: any }),
        }))
        // Filter out rooms the user created (avoid duplicates)
        .filter((room) => (room as any).createdBy !== user.uid);

      setJoinedRooms(joined);
      setLoading(false);
    });

    return () => {
      unsubscribeCreated();
      unsubscribeJoined();
    };
  }, []);

  const renderRooms = (rooms: DocumentData[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {rooms.map((room) => (
        <div key={room.id} className="relative">
          {room.createdBy === auth.currentUser?.uid && (
            <div className="absolute top-2 right-2 z-10">
              <DeleteRoomButton roomId={room.id} createdBy={room.createdBy} />
            </div>
          )}

          <Link href={`/room/${room.id}`}>
            <div className="flex flex-col justify-between h-full p-5 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all cursor-pointer hover:-translate-y-1 duration-200">
              <div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-1">
                  {room.name}
                </h3>
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

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Loading rooms...</p>;
  }

  return (
    <div className="space-y-10 mt-6">
      {createdRooms.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-indigo-600 mb-2">Your Created Rooms</h2>
          {renderRooms(createdRooms)}
        </div>
      )}

      {joinedRooms.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-green-600 mb-2">Joined Rooms</h2>
          {renderRooms(joinedRooms)}
        </div>
      )}

      {createdRooms.length === 0 && joinedRooms.length === 0 && (
        <div className="text-center text-gray-600 mt-6">
          <p>No rooms found.</p>
          <p className="text-sm text-gray-400">Create or join one to get started!</p>
        </div>
      )}
    </div>
  );
}
