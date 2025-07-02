"use client";

import { useState } from "react";

export default function AI({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: { sender: "user" | "bot"; text: string } = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response (replace with real API call)
    setTimeout(() => {
      const botReply: { sender: "user" | "bot"; text: string } = { sender: "bot", text: `You said: "${input}"` };
      setMessages((prev) => [...prev, botReply]);
    }, 500);

    setInput("");
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-2xl shadow-md h-[80vh] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">AI Chat - Room ID: {roomId}</h2>
      <div className="flex-1 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-xs ${
              msg.sender === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          className="flex-1 border border-gray-300 p-2 rounded-l-md"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
