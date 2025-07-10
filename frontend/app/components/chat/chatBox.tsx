'use client';

import { useEffect, useRef, useState } from 'react';
import { auth } from '@/lib/firebase';
import { sendMessage, subscribeToMessages, ChatMessage } from '@/lib/firebaseChat';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ChatBox({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
    // Fetch the username from Firestore user document

    (async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUsername(userDoc.data().username || 'Anonymous');
      } else {
        setUsername('Anonymous');
      }
    })();
    }

    const unsubscribe = subscribeToMessages(roomId, (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage(roomId, message, username);
    setMessage('');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] bg-white border rounded-xl shadow p-4 sm:p-6">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] md:max-w-md px-4 py-2 rounded-xl text-sm shadow-md break-words ${
              msg.uid === auth.currentUser?.uid
                ? 'ml-auto bg-indigo-100 text-right rounded-br-none'
                : 'mr-auto bg-gray-100 text-left rounded-bl-none'
            }`}
          >
            <p className="text-xs font-semibold text-gray-600">{msg.username}</p>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2">
        <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
            }
        }}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
        >
          Send
        </button>
      </div>
      </div>
  );
}
