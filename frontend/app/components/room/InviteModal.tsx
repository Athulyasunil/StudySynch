'use client';
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react'; // or use any modal library
import { X } from 'lucide-react';

export default function InviteModal({ roomId, open, setOpen }: {
  roomId: string;
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${roomId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    alert('Link copied to clipboard!');
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
          <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4">Invite to Room</Dialog.Title>
          <div className="space-y-4">
            <input
              value={inviteLink}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Copy Invite Link
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
