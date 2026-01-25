const crypto = require("crypto");

const rooms = {};

/**
 * Hash room password (one-way)
 */
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Create a new room
 */
function createRoom({ roomId, password, expiresIn }) {
  if (rooms[roomId]) return;

  rooms[roomId] = {
    roomId,
    password: password ? hashPassword(password) : null,
    expiresAt: Date.now() + expiresIn,
    snippets: [],
    users: [] // { socketId, username }
  };
}

/**
 * Get room by ID
 */
function getRoom(roomId) {
  return rooms[roomId];
}

/**
 * Validate room password
 */
function validateRoomPassword(room, password) {
  if (!room.password) return true;
  if (!password) return false;
  return hashPassword(password) === room.password;
}

/**
 * Check if room expired
 */
function isRoomExpired(room) {
  return Date.now() > room.expiresAt;
}

/**
 * Delete room completely
 */
function deleteRoom(roomId) {
  delete rooms[roomId];
}

/**
 * Add user to room (SAFE)
 * - Prevent duplicate socket
 * - Prevent duplicate username
 */
function addUserToRoom(roomId, socketId, username) {
  const room = rooms[roomId];
  if (!room) return;

  // Remove old socket if exists
  room.users = room.users.filter(
    (u) => u.socketId !== socketId
  );

  // Prevent duplicate username
  const nameExists = room.users.some(
    (u) => u.username === username
  );
  if (nameExists) return;

  room.users.push({
    socketId,
    username
  });
}

/**
 * Remove user from room
 */
function removeUserFromRoom(roomId, socketId) {
  const room = rooms[roomId];
  if (!room) return null;

  const index = room.users.findIndex(
    (u) => u.socketId === socketId
  );

  if (index === -1) return null;

  const [removedUser] = room.users.splice(index, 1);
  return removedUser;
}

/**
 * Get all users in room
 */
function getRoomUsers(roomId) {
  const room = rooms[roomId];
  if (!room) return [];
  return room.users;
}

module.exports = {
  rooms,
  createRoom,
  getRoom,
  validateRoomPassword,
  isRoomExpired,
  deleteRoom,
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers
};
