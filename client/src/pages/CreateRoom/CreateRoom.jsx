import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../services/socket";

const ROOM_CREATE_TIMEOUT_MS = 65000;

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
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const timeoutRef = useRef(null);
  const cancelledRef = useRef(false);

  // Load username from localStorage if exists
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCreate = () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setError("");
    setStatus("");
    setCreating(true);
    cancelledRef.current = false;

    const cleanUsername = username.trim();

    // Persist username
    localStorage.setItem("username", cleanUsername);

    const roomId = crypto.randomUUID().slice(0, 8);

    // 🔑 MARK ADMIN
    sessionStorage.setItem("adminRoomId", roomId);

    const payload = {
      roomId,
      password: password || null,
      expiresIn: expiry * 60 * 60 * 1000
    };

    const cleanup = (cancel = false) => {
      if (cancel) cancelledRef.current = true;
      setCreating(false);
      setStatus("");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      socket.off("room-created", onRoomCreated);
      socket.off("room-created-error", onRoomCreatedError);
      socket.off("connect_error", onConnectError);
    };

    const onRoomCreated = () => {
      if (cancelledRef.current) return;
      cleanup();
      navigate(`/room/${roomId}`);
    };

    const onRoomCreatedError = (message) => {
      if (cancelledRef.current) return;
      cleanup(true);
      setError(message || "Room creation failed. Please try again.");
    };

    const onConnectError = () => {
      // Don't fail immediately—socket will retry. Show status so user knows we're still trying.
      setStatus(
        "Connecting to server… Backend may be starting up; this can take up to a minute."
      );
    };

    // Timeout: if server never responds, show error (long enough for Render cold start)
    timeoutRef.current = setTimeout(() => {
      if (cancelledRef.current) return;
      cancelledRef.current = true;
      setStatus("");
      if (!socket.connected) {
        setError(
          "Connection timed out. The backend may be starting up—try again in a minute, or check your internet."
        );
      } else {
        setError("Room creation timed out. Please try again.");
      }
      cleanup();
    }, ROOM_CREATE_TIMEOUT_MS);

    socket.once("room-created", onRoomCreated);
    socket.once("room-created-error", onRoomCreatedError);
    socket.once("connect_error", onConnectError);

    const emitCreateRoom = () => {
      if (cancelledRef.current) return;
      socket.emit("create-room", payload);
    };

    if (socket.connected) {
      emitCreateRoom();
    } else {
      socket.once("connect", emitCreateRoom);
      socket.connect();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Create Room
        </h2>

        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        />

        <select
          value={expiry}
          onChange={(e) => setExpiry(Number(e.target.value))}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        >
          <option value={6}>6 Hours</option>
          <option value={12}>12 Hours</option>
          <option value={24}>24 Hours</option>
        </select>

        <input
          type="password"
          placeholder="Optional room password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
        />

        {status && (
          <p className="text-sm text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded px-3 py-2">
            {status}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleCreate}
          disabled={!username.trim() || creating}
          className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-500 transition disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create Room"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          You’ll be the room admin and can invite others instantly.
        </p>
      </div>
    </div>
  );
}
