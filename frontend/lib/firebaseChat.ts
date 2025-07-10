import { db, auth } from './firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';

export interface ChatMessage {
  id?: string;
  text: string;
  uid: string;
  username: string;
  createdAt: any;
}

/**
 * Sends a message to the given room's Firestore chat subcollection.
 */
export async function sendMessage(roomId: string, text: string, username: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const message = {
    text: text.trim(),
    uid: user.uid,
    username,
    createdAt: serverTimestamp(),
  };

  const messagesRef = collection(db, 'rooms', roomId, 'messages');
  await addDoc(messagesRef, message);
}

/**
 * Subscribes to real-time messages from a room.
 */
export function subscribeToMessages(
  roomId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  const messagesRef = collection(db, 'rooms', roomId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];

    callback(messages);
  });
}
