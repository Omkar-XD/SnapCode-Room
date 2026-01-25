import { useState } from "react";
import { motion } from "framer-motion";

/**
 * AddSnippetModal
 * - Attaches author (username)
 * - Attaches createdAt timestamp
 */
export default function AddSnippetModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("JSX");
  const [code, setCode] = useState("");

  const username = localStorage.getItem("username");

  const handleSubmit = () => {
    if (!title.trim() || !code.trim() || !username) {
      return;
    }

    const newSnippet = {
      id: crypto.randomUUID(),
      title: title.trim(),
      language,
      code: code.trim(),
      author: username,          // 👈 NEW
      createdAt: Date.now(),     // 👈 NEW
      messages: []               // ensures consistency
    };

    onAdd(newSnippet);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-lg p-6 text-white"
      >
        <h2 className="text-lg font-semibold mb-4">
          Add New Snippet
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Snippet Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Navbar Component v2"
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="JSX">JSX</option>
              <option value="TSX">TSX</option>
              <option value="JavaScript">JavaScript</option>
              <option value="CSS">CSS</option>
              <option value="HTML">HTML</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Code
            </label>
            <textarea
              rows={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !code.trim()}
            className="px-4 py-2 bg-indigo-600 rounded disabled:opacity-50"
          >
            Add Snippet
          </button>
        </div>
      </motion.div>
    </div>
  );
}
