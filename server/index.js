const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const setupSocket = require("./socket");
const { rooms, isRoomExpired, deleteRoom } = require("./roomStore");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setupSocket(io);

/**
 * ROOM CLEANUP JOB
 * Runs every 60 seconds
 */
setInterval(() => {
  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    if (isRoomExpired(room)) {
      deleteRoom(roomId);
      console.log(`Room expired and deleted: ${roomId}`);
    }
  });
}, 60 * 1000);

/**
 * ✅ CRITICAL FIX: USE RENDER PORT
 */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
