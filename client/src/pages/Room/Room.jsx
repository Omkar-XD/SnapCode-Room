import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import socket from "../../services/socket";

import TopBar from "./components/TopBar/TopBar";
import SnippetBoard from "./components/SnippetBoard/SnippetBoard";
import ContextPanel from "./components/ContextPanel/ContextPanel";
import PasswordPrompt from "./components/PasswordPrompt/PasswordPrompt";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [passwordRequired, setPasswordRequired] = useState(false);
  const [users, setUsers] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  const username = localStorage.getItem("username");

  const isAdmin =
    sessionStorage.getItem("adminRoomId") === roomId;

  const joinPassword = location.state?.password || null;

  // prevents duplicate join emits
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    const handleJoinError = () => {
      setPasswordRequired(true);
    };

    const handleUsers = (users) => {
      setUsers(users);
    };

    const handleSystemMessage = (message) => {
      setSystemMessages((prev) => [...prev, message]);
    };

    const handleRoomMeta = ({ expiresAt }) => {
      setExpiresAt(expiresAt);
    };

    socket.on("join-error", handleJoinError);
    socket.on("room-users", handleUsers);
    socket.on("system-message", handleSystemMessage);
    socket.on("room-meta", handleRoomMeta);

    const emitJoin = () => {
      if (hasJoinedRef.current) return;

      hasJoinedRef.current = true;

      const payload = { roomId, username };
      if (!isAdmin && joinPassword) {
        payload.password = joinPassword;
      }

      socket.emit("join-room", payload);
    };

    if (socket.connected) {
      emitJoin();
    } else {
      socket.once("connect", emitJoin);
    }

    return () => {
      socket.off("join-error", handleJoinError);
      socket.off("room-users", handleUsers);
      socket.off("system-message", handleSystemMessage);
      socket.off("room-meta", handleRoomMeta);
    };
  }, [roomId, username, isAdmin, joinPassword, navigate]);

  /* ---------- PASSWORD FLOW ---------- */

  if (passwordRequired) {
    return (
      <PasswordPrompt
        onSubmit={(password) => {
          setPasswordRequired(false);

          socket.emit("join-room", {
            roomId,
            username,
            password
          });
        }}
      />
    );
  }

  /* ---------- MAIN UI (NO LOADER BY DESIGN) ---------- */

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      <TopBar
        users={users}
        roomId={roomId}
        expiresAt={expiresAt}
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="w-full md:w-[70%] border-r border-gray-800 overflow-y-auto">
          <SnippetBoard
            roomId={roomId}
            onSelectSnippet={setSelectedSnippet}
            systemMessages={systemMessages}
          />
        </div>

        <div className="w-full md:w-[30%] overflow-y-auto border-t md:border-t-0 md:border-l border-gray-800">
          <ContextPanel
            roomId={roomId}
            snippet={selectedSnippet}
            systemMessages={systemMessages}
          />
        </div>
      </div>
    </div>
  );
}
