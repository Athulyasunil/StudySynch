'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import Notes from '@/app/components/room/Notes';
import Chat from '@/app/components/room/Chat';
import AI from '@/app/components/room/AI';
import RoomActionsMenu from '@/app/components/room/RoomActionMenu';
import { useParams } from 'next/navigation';

interface Room {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  members?: string[];
  createdAt?: any;
}

const tabs = ['Notes', 'Chat', 'AI'] as const;
type Tab = (typeof tabs)[number];

export default function RoomPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Notes');
  const params = useParams();

  useEffect(() => {
    const fetchRoom = async () => {
      const docRef = doc(db, 'rooms', params.id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRoom({ id: docSnap.id, ...docSnap.data() } as Room);
      }
    };

    fetchRoom();
  }, [params.id]);

  if (!room) return <div className="text-center mt-10 text-gray-500">Loading room...</div>;

  const isCreator = auth.currentUser?.uid === room.createdBy;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">{room.name}</h2>
        <RoomActionsMenu roomId={room.id} isCreator={isCreator} />
      </div>

      <div className="flex justify-center space-x-6 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-full font-medium transition ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto min-h-[400px]">
        {activeTab === 'Notes' && <Notes roomId={room.id} />}
        {activeTab === 'Chat' && <Chat roomId={room.id} />}
        {activeTab === 'AI' && <AI roomId={room.id} />}
      </div>
    </div>
  );
}
