'use client';

import { deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react'; // or use any other icon lib

export default function DeleteRoomButton({
  roomId,
  createdBy,
}: {
  roomId: string;
  createdBy: string;
}) {
  const router = useRouter();
  const user = auth.currentUser;

  // Only show if current user is the creator
  if (!user || user.uid !== createdBy) return null;

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this room?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'rooms', roomId));
      router.refresh();
      router.push('/dashboard');
    } catch (err) {
      console.error('Error deleting room:', err);
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-2">
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
