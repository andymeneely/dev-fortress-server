/**
 * @module socket/controllers/room
 */
const emitters = require('../emitters/emitters');

/**
 * Join a socket to a room.
 * @param {Socket} socket the socket.io socket
 * @param {String} room the room to join
 */
function joinRoom(socket, room) {
  socket.join(room);
  emitters.emitInfoEventResults(socket, 'join room', true, `You've joined room: ${room}`);
  emitters.emitInfoFromSocketToRoom(socket, 'join room', true, `Socket ${socket.id} has entered the room`, room);
}

module.exports = {
  joinRoom,
};
