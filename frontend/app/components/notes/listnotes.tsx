'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function NotesList({ roomId }: { roomId: string }) {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'rooms', roomId, 'notes'),
      orderBy('uploadedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [roomId]);

  return (
    <div className="space-y-4">
      {notes.length === 0 && <p className="text-gray-500">No notes yet.</p>}
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-3 border rounded-md bg-white shadow-sm flex justify-between items-center"
        >
          <a
            href={note.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline"
          >
            {note.name}
          </a>
          <span className="text-xs text-gray-400">
            {note.uploadedAt?.toDate?.().toLocaleString() || ''}
          </span>
        </div>
      ))}
    </div>
  );
}
