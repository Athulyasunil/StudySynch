'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function JoinRoomPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;
  const router = useRouter();

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Save the current path to restore later
        localStorage.setItem('redirectAfterLogin', `/join/${roomId}`);
        router.push('/login');
      } else {
        try {
          const roomRef = doc(db, 'rooms', roomId);
          const roomSnap = await getDoc(roomRef);
          if (roomSnap.exists()) {
            setRoom({ id: roomSnap.id, ...roomSnap.data() });
          } else {
            setError('Room not found.');
          }
        } catch (err) {
          setError('Failed to fetch room.');
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleJoin = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setJoining(true);
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        members: arrayUnion(user.uid),
      });
      router.push(`/room/${roomId}`);
    } catch (err) {
      setError('Failed to join room.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <p className="text-center mt-8 text-gray-500">Loading room info...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!room) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-indigo-700 mb-2">{room.name}</h1>
        {room.description && <p className="text-gray-600 mb-4">{room.description}</p>}
        <button
          onClick={handleJoin}
          disabled={joining}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {joining ? 'Joining...' : 'Join Room'}
        </button>
      </div>
    </div>
  );
}
