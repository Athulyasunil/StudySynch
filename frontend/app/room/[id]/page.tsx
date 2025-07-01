'use client';

import { useState } from 'react';
import Notes from './Notes/page';
import Chat from './Chat/page';
import AI from './AI/page'; 
const tabs = ['Notes', 'Chat', 'AI'] as const;
type Tab = (typeof tabs)[number];

export default function RoomPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>('Notes');

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 bg-white rounded-xl shadow-md min-h-[400px]">
        {activeTab === 'Notes' && <Notes roomId={params.id} />}
        {activeTab === 'Chat' && <Chat roomId={params.id} />}
        {activeTab === 'AI' && <AI roomId={params.id} />}
      </div>
    </div>
  );
}
