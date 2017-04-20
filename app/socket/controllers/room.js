/**
 * @module socket/controllers/room
 */
const redis = require('../../redis');

/**
 * Retrieve the list of rooms from Redis, forward to callback.
 * @param {Function} callback the callback: function(err, rooms)
 */
function getRooms(callback) {
  redis.llen('rooms', (err, length) => {
    redis.lrange('rooms', 0, length, callback);
  });
}

/**
 * Join a socket to a room.
 * @param {Socket} socket the socket.io socket
 * @param {String} room the room to join
 */
function joinRoom(socket, room) {
  socket.join(room);
  console.log(`Socket ${socket.id} has joined room: ${room}`);
  socket.emit('info', `You've joined room: ${room}`);
  socket.to(room).emit('info', `Socket ${socket.id} has entered the room`);
}

module.exports = {
  getRooms,
  joinRoom,
};
