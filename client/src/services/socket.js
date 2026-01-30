import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://snapcode-backend.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  timeout: 60000,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
  reconnectionDelayMax: 10000,
  transports: ["websocket", "polling"],
});

export default socket;
