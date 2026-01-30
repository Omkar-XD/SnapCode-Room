const {
  createRoom,
  getRoom,
  validateRoomPassword,
  isRoomExpired,
  rooms,
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers
} = require("./roomStore");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /**
     * CREATE ROOM (ADMIN)
     */
    socket.on("create-room", (data) => {
      const roomId = data?.roomId;
      if (!roomId || typeof roomId !== "string") {
        socket.emit("room-created-error", "Invalid room id");
        return;
      }
      const expiresIn = Number(data?.expiresIn) || 6 * 60 * 60 * 1000;
      createRoom({
        roomId,
        password: data?.password ?? null,
        expiresIn,
      });
      socket.emit("room-created", { roomId });
      console.log(`Room created: ${roomId}`);
    });

    /**
     * JOIN ROOM
     */
    socket.on("join-room", ({ roomId, password, username }) => {
      // 🛑 Prevent duplicate joins
      if (socket.rooms.has(roomId)) return;

      const room = getRoom(roomId);

      if (!room) {
        socket.emit("join-error", "Room does not exist");
        return;
      }

      if (isRoomExpired(room)) {
        delete rooms[roomId];
        socket.emit("join-error", "Room expired");
        return;
      }

      if (!validateRoomPassword(room, password)) {
        socket.emit("join-error", "Invalid room password");
        return;
      }

      if (!username || !username.trim()) {
        socket.emit("join-error", "Username required");
        return;
      }

      // Join socket.io room
      socket.join(roomId);

      // Track user safely
      addUserToRoom(roomId, socket.id, username);

      // Emit initial data to THIS user
      socket.emit("load-snippets", room.snippets);

      // 🔥 SEND USERNAMES ONLY (frontend-safe)
      io.to(roomId).emit(
        "room-users",
        getRoomUsers(roomId).map((u) => u.username)
      );

      // Notify others
      socket.to(roomId).emit("system-message", {
        type: "join",
        username,
        timestamp: Date.now()
      });

      console.log(`${username} joined room ${roomId}`);
    });

    /**
     * ADD SNIPPET
     */
    socket.on("add-snippet", ({ roomId, snippet }) => {
      const room = getRoom(roomId);
      if (!room) return;

      snippet.messages = [];
      room.snippets.unshift(snippet);

      io.to(roomId).emit("snippet-added", snippet);
    });

    /**
     * DELETE SNIPPET
     */
    socket.on("delete-snippet", ({ roomId, snippetId }) => {
      const room = getRoom(roomId);
      if (!room) return;

      room.snippets = room.snippets.filter(
        (s) => s.id !== snippetId
      );

      io.to(roomId).emit("snippet-deleted", snippetId);
    });

    /**
     * CONTEXTUAL CHAT (PER SNIPPET)
     */
    socket.on("add-message", ({ roomId, snippetId, message }) => {
      const room = getRoom(roomId);
      if (!room) return;

      const snippet = room.snippets.find(
        (s) => s.id === snippetId
      );
      if (!snippet) return;

      snippet.messages.push(message);

      io.to(roomId).emit("message-added", {
        snippetId,
        message
      });
    });

    /**
     * DISCONNECT
     */
    socket.on("disconnect", () => {
      Object.keys(rooms).forEach((roomId) => {
        const removedUser = removeUserFromRoom(roomId, socket.id);

        if (removedUser) {
          io.to(roomId).emit("system-message", {
            type: "leave",
            username: removedUser.username,
            timestamp: Date.now()
          });

          io.to(roomId).emit(
            "room-users",
            getRoomUsers(roomId).map((u) => u.username)
          );

          console.log(
            `${removedUser.username} left room ${roomId}`
          );
        }
      });

      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = setupSocket;
