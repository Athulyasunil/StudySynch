'use client';

import { deleteDoc, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
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
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        console.error('Room does not exist');
        return;
      }

      const roomData = roomSnap.data();
      const members = roomData.members || [];

      // Remove the roomId from all members' user documents
      const updates = members.map((uid: string) =>
        updateDoc(doc(db, 'users', uid), {
          rooms: arrayRemove(roomId),
        })
      );
      await Promise.all(updates);

      // Delete the room document
      await deleteDoc(roomRef);

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Error deleting room:', err);
    }
  };
// TODO: Delete notes and messages once implemented


  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-2">
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
