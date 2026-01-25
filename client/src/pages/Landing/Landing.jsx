import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold">
          SnapCode Room
        </h1>

        <p className="text-gray-400">
          A disposable coding room for fast teams.
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={() => navigate("/create")}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
          >
            Create a Room
          </button>

          <button
            onClick={() => navigate("/join")}
            className="w-full sm:w-auto px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition"
          >
            Join a Room
          </button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-500 mt-4">
          No signup required. Rooms auto-expire.
        </p>
      </motion.div>
    </div>
  );
}
