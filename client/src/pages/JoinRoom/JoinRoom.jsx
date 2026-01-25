import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * JoinRoom
 * - Manual join via Room ID
 * - Requires username
 * - Optional password
 * - Mobile responsive
 */
export default function JoinRoom() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Load username if already stored
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleJoin = () => {
    if (!roomId.trim() || !username.trim()) {
      alert("Room ID and Username are required");
      return;
    }

    // Save username for session
    localStorage.setItem("username", username.trim());

    // Navigate to room
    navigate(`/room/${roomId.trim()}`, {
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

        {/* Room ID */}
        <input
          type="text"
          placeholder="Room ID (e.g. A1B2C3D4)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
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
          disabled={!roomId.trim() || !username.trim()}
          className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-500 transition disabled:opacity-50"
        >
          Join Room
        </button>

        <p className="text-xs text-gray-400 text-center">
          You’ll be asked for the password only if the room is protected.
        </p>
      </motion.div>
    </div>
  );
}
