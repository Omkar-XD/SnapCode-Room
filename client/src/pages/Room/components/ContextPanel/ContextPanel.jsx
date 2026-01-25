import { useState } from "react";
import socket from "../../../../services/socket";

/**
 * ContextPanel
 * - Contextual chat per snippet
 * - Mobile-friendly layout
 * - Sticky header & input
 */
export default function ContextPanel({
  snippet,
  roomId,
  systemMessages = []
}) {
  const [text, setText] = useState("");
  const username = localStorage.getItem("username");

  if (!snippet) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm px-4">
        Select a snippet to discuss
      </div>
    );
  }

  const sendMessage = () => {
    if (!text.trim() || !username) return;

    const message = {
      id: crypto.randomUUID(),
      text: text.trim(),
      author: username,
      timestamp: Date.now()
    };

    socket.emit("add-message", {
      roomId,
      snippetId: snippet.id,
      message
    });

    setText("");
  };

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header (sticky) */}
      <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-200">
          Discussion
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {snippet.title}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm">
        {/* System messages */}
        {systemMessages.map((msg, idx) => (
          <div
            key={`system-${idx}`}
            className="text-xs text-gray-500 italic text-center"
          >
            — {msg.username}{" "}
            {msg.type === "join" ? "joined" : "left"} —
          </div>
        ))}

        {/* Chat messages */}
        {snippet.messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-gray-800 p-2 rounded"
          >
            <div className="text-xs text-gray-400 mb-0.5">
              {msg.author}
            </div>
            <div className="leading-snug">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input (sticky bottom on mobile) */}
      <div className="border-t border-gray-800 bg-gray-950 px-3 py-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add comment…"
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="px-3 py-2 text-sm bg-indigo-600 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
