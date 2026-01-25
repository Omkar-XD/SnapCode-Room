import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * JoinRoom
 * - Accepts Room ID OR full invite link
 * - Requires username
 * - Optional password
 * - Mobile safe
 */
export default function JoinRoom() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Load username if already stored
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // 🔑 EXTRACT ONLY ROOM ID (CRITICAL FIX)
  const extractRoomId = (value) => {
    try {
      if (value.startsWith("http")) {
        const url = new URL(value);
        return url.pathname.split("/").pop();
      }
      return value.trim();
    } catch {
      return value.trim();
    }
  };

  const handleJoin = () => {
    setError("");

    if (!input.trim() || !username.trim()) {
      setError("Room ID / Link and Username are required");
      return;
    }

    const roomId = extractRoomId(input);

    // 🚨 HARD GUARD — prevents /room/https/... forever
    if (!/^[a-zA-Z0-9_-]{6,12}$/.test(roomId)) {
      setError("Invalid room link or ID");
      return;
    }

    localStorage.setItem("username", username.trim());

    navigate(`/room/${roomId}`, {
      state: {
        password: password || null
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Join a Room
        </h2>

        {error && (
          <p className="text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        {/* Room ID or Link */}
        <input
          type="text"
          placeholder="Paste room link or ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        />

        {/* Username */}
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        />

        {/* Password (optional) */}
        <input
          type="password"
          placeholder="Room password (if any)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        />

        <button
          onClick={handleJoin}
          disabled={!input.trim() || !username.trim()}
          className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-500 transition disabled:opacity-50"
        >
          Join Room
        </button>

        <p className="text-xs text-gray-400 text-center">
          You can paste a full invite link or just the room ID.
        </p>
      </motion.div>
    </div>
  );
}
