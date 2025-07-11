'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import CreateRoom from '../components/createRoom';
import RoomList from '../components/listrooms';
import JoinRoomModal from '../components/joinroom/joinroommodal';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Dashboard</h1>
        <div className="flex gap-4">
          <CreateRoom />
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg shadow-sm transition"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Room List */}
      <RoomList />

      {/* Modal */}
      {showModal && <JoinRoomModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
