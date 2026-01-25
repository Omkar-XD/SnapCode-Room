import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../services/socket";

/**
 * CreateRoom
 * - Requires username
 * - Creates room with optional password & expiry
 * - Marks creator as ADMIN
 * - Admin is NEVER asked for room password
 */
export default function CreateRoom() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [expiry, setExpiry] = useState(6);
  const [password, setPassword] = useState("");

  // Load username from localStorage if exists
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleCreate = () => {
    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    const cleanUsername = username.trim();

    // Persist username
    localStorage.setItem("username", cleanUsername);

    const roomId = crypto.randomUUID().slice(0, 8);

    // 🔑 MARK ADMIN (VERY IMPORTANT)
    sessionStorage.setItem("adminRoomId", roomId);

    socket.connect();

    socket.emit("create-room", {
      roomId,
      password: password || null,
      expiresIn: expiry * 60 * 60 * 1000
    });

    socket.once("room-created", () => {
      // Admin goes directly into room (no password prompt)
      navigate(`/room/${roomId}`);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Create Room
        </h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        />

        {/* Expiry */}
        <select
          value={expiry}
          onChange={(e) => setExpiry(Number(e.target.value))}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        >
          <option value={6}>6 Hours</option>
          <option value={12}>12 Hours</option>
          <option value={24}>24 Hours</option>
        </select>

        {/* Password */}
        <input
          type="password"
          placeholder="Optional room password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        />

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={!username.trim()}
          className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-500 transition disabled:opacity-50"
        >
          Create Room
        </button>

        <p className="text-xs text-gray-400 text-center">
          You’ll be the room admin and can invite others instantly.
        </p>
      </div>
    </div>
  );
}
