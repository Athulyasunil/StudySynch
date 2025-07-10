import ChatBox from '@/app/components/chat/chatBox';

export default function Chat({ roomId }: { roomId: string }) {
  return <div>
    <ChatBox roomId={roomId} />
  </div>;
}
