import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://snapcode-backend.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  // Give backend time to wake up (e.g. Render free tier cold start ~30–60s)
  timeout: 60000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 10000,
});

export default socket;
