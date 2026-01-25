import { io } from "socket.io-client";

const socket = io(
  "https://snapcode-backend.onrender.com",
  { autoConnect: false }
);

export default socket;
