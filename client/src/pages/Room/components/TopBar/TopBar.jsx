import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InviteModal from "../InviteModal/InviteModal";

/**
 * TopBar
 * - App title
 * - Active users
 * - Native Share + Copy link
 * - QR Code modal
 * - Expiry countdown
 * - Light/Dark toggle
 * - Leave room
 */
export default function TopBar({
  users = [],
  roomId,
  expiresAt
}) {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  /* ---------------- THEME ---------------- */

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setDarkMode(storedTheme === "dark");

    document.documentElement.classList.toggle(
      "dark",
      storedTheme === "dark"
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((p) => !p);

  /* ---------------- INVITE LINK ---------------- */

  const inviteLink = `${window.location.protocol}//${window.location.host}/room/${roomId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Failed to copy link");
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "SnapCode Room",
        text: "Join my coding room",
        url: inviteLink
      });
    } else {
      copyLink();
    }
  };

  /* ---------------- EXPIRY TIMER ---------------- */

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const diff = expiresAt - Date.now();

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  /* ---------------- LEAVE ---------------- */

  const leaveRoom = () => {
    sessionStorage.removeItem("adminRoomId");
    navigate("/");
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-[56px] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-2 border-b border-gray-800 bg-gray-950"
      >
        {/* Left */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
          <div className="font-semibold text-white">
            SnapCode Room
          </div>

          <span className="text-xs text-gray-400">
            {users.length} online
          </span>

          {expiresAt && (
            <span className="text-xs text-gray-400">
              Expires in: {timeLeft || "--"}
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700"
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <button
            onClick={shareLink}
            className="px-3 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700"
          >
            Share
          </button>

          <button
            onClick={() => setShowInvite(true)}
            className="px-3 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700"
          >
            QR
          </button>

          <button
            onClick={leaveRoom}
            className="px-3 py-1 text-xs bg-red-600 rounded hover:bg-red-500"
          >
            Leave
          </button>
        </div>
      </motion.div>

      {showInvite && (
        <InviteModal
          link={inviteLink}
          onClose={() => setShowInvite(false)}
        />
      )}
    </>
  );
}
