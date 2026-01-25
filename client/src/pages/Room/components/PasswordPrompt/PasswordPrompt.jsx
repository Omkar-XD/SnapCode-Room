import { useState } from "react";

export default function PasswordPrompt({ onSubmit }) {
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">
          Room is protected
        </h2>

        <input
          type="password"
          placeholder="Enter room password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 mb-4"
        />

        <button
          onClick={() => onSubmit(password)}
          className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-500 transition"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
