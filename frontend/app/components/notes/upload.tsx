'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function UploadNote({ roomId }: { roomId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const fileRef = ref(storage, `notes/${roomId}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed', null, console.error, async () => {
        const url = await getDownloadURL(fileRef);
        await addDoc(collection(db, 'rooms', roomId, 'notes'), {
          name: file.name,
          url,
          uploadedAt: serverTimestamp(),
          uploadedBy: auth.currentUser?.uid || '',
        });
        setFile(null);
      });
    } catch (err: any) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 items-center">
        <input
          type="file"
          accept=".pdf,.pptx,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file:border file:mr-4 rounded-md"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
