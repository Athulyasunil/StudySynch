'use client';

import { Menu } from '@headlessui/react';
import { MoreVertical, Trash2, LogOut, UserPlus } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import InviteModal from './InviteModal';

interface RoomActionsMenuProps {
  roomId: string;
  isCreator: boolean;
}

export default function RoomActionsMenu({ roomId, isCreator }: RoomActionsMenuProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
      toast.success('Room deleted');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Failed to delete room');
      console.error(err);
    }
  };

  const handleLeave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        members: arrayRemove(user.uid),
      });
      toast.success('Left the room');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Failed to leave room');
      console.error(err);
    }
  };

  const handleInvite = () => {
    setInviteOpen(true);
  };



  return (
    <div>
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-2 rounded-full hover:bg-gray-200 transition">
        <MoreVertical className="w-5 h-5 text-gray-700" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="p-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleInvite}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-800`}
              >
                <UserPlus className="w-4 h-4" />
                Invite
              </button>
            )}
          </Menu.Item>

          {!isCreator && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLeave}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-800`}
                >
                  <LogOut className="w-4 h-4" />
                  Leave Room
                </button>
              )}
            </Menu.Item>
          )}

          {isCreator && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleDelete}
                  className={`${
                    active ? 'bg-red-50 text-red-600' : 'text-red-500'
                  } flex items-center gap-2 w-full px-3 py-2 text-sm`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Room
                </button>
              )}
            </Menu.Item>
          )}
        </div>
      </Menu.Items>
    </Menu>
    <InviteModal roomId={roomId} open={inviteOpen} setOpen={setInviteOpen} />
    </div>
  );
}
