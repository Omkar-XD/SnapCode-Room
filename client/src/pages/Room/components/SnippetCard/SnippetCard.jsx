export default function SnippetCard({
  snippet,
  onDelete,
  onSelect
}) {
  const formattedTime = snippet.createdAt
    ? new Date(snippet.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;

  return (
    <div
      onClick={onSelect}
      className="border border-gray-800 bg-gray-900 rounded p-4 cursor-pointer hover:border-indigo-500 transition"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-white">
          {snippet.title}
        </h3>
        <span className="text-xs text-gray-400">
          {snippet.language}
        </span>
      </div>

      {/* Meta info */}
      <div className="text-xs text-gray-500 mb-2">
        Added by <span className="text-gray-300">{snippet.author}</span>
        {formattedTime && (
          <span className="ml-2">• {formattedTime}</span>
        )}
      </div>

      {/* Code */}
      <pre className="bg-gray-950 p-3 rounded text-sm overflow-x-auto">
        {snippet.code}
      </pre>

      {/* Actions */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(snippet.id);
          }}
          className="text-xs px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
