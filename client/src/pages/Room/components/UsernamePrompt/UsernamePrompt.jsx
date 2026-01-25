import { useState } from "react";
import { motion } from "framer-motion";

/**
 * UsernamePrompt
 * - Forces user to choose a display name
 * - Stores it in localStorage
 * - Used before create / join room
 */
export default function UsernamePrompt({ onSubmit }) {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (!username.trim()) return;

    const cleanName = username.trim();
    localStorage.setItem("username", cleanName);

    if (onSubmit) {
      onSubmit(cleanName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-sm p-6 text-white"
      >
        <h2 className="text-lg font-semibold mb-2">
          Choose a display name
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          This name will be visible to others in the room.
        </p>

        <input
          type="text"
          placeholder="e.g. Rahul"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
          autoFocus
        />

        <button
          onClick={handleSubmit}
          disabled={!username.trim()}
          className="w-full mt-4 bg-indigo-600 py-2 rounded hover:bg-indigo-500 transition disabled:opacity-50"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}
