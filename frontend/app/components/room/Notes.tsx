import UploadNote from '@/app/components/notes/upload';
import NotesList from '@/app/components/notes/listnotes';


export default function Notes({ roomId }: { roomId: string }) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Room Notes</h2>
      <UploadNote roomId={roomId} />
      <NotesList roomId={roomId} />
    </div>
  );
}
