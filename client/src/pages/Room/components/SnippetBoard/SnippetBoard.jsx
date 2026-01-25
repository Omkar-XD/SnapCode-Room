import { useEffect, useState } from "react";
import socket from "../../../../services/socket";
import SnippetCard from "../SnippetCard/SnippetCard";
import AddSnippetModal from "../AddSnippetModal/AddSnippetModal";

/**
 * SnippetBoard
 * - Renders snippets
 * - Emits add/delete
 * - Mobile + desktop responsive
 */
export default function SnippetBoard({
  roomId,
  onSelectSnippet,
  systemMessages
}) {
  const [snippets, setSnippets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    socket.on("load-snippets", (data) => {
      setSnippets(data);
    });

    socket.on("snippet-added", (snippet) => {
      setSnippets((prev) => [snippet, ...prev]);
    });

    socket.on("snippet-deleted", (snippetId) => {
      setSnippets((prev) =>
        prev.filter((s) => s.id !== snippetId)
      );
      onSelectSnippet(null);
    });

    socket.on("message-added", ({ snippetId, message }) => {
      setSnippets((prev) =>
        prev.map((s) =>
          s.id === snippetId
            ? { ...s, messages: [...s.messages, message] }
            : s
        )
      );
    });

    return () => {
      socket.off("load-snippets");
      socket.off("snippet-added");
      socket.off("snippet-deleted");
      socket.off("message-added");
    };
  }, [onSelectSnippet]);

  const handleAddSnippet = (snippet) => {
    socket.emit("add-snippet", { roomId, snippet });
    setIsModalOpen(false);
  };

  const handleDeleteSnippet = (snippetId) => {
    socket.emit("delete-snippet", { roomId, snippetId });
  };

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Header / Action bar */}
      <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-300">
          Snippets
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 text-sm bg-indigo-600 rounded hover:bg-indigo-500 transition"
        >
          + Add
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* System messages */}
        {systemMessages?.length > 0 && (
          <div className="space-y-1 text-xs text-gray-400">
            {systemMessages.map((msg, idx) => (
              <div key={idx} className="italic text-center">
                — {msg.username}{" "}
                {msg.type === "join" ? "joined" : "left"} —
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {snippets.length === 0 && (
          <div className="border border-dashed border-gray-700 rounded-lg p-6 text-center text-gray-500 text-sm">
            No snippets yet. Add one to start collaborating.
          </div>
        )}

        {/* Snippet list */}
        <div className="space-y-4">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onDelete={handleDeleteSnippet}
              onSelect={() => onSelectSnippet(snippet)}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <AddSnippetModal
          onAdd={handleAddSnippet}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
