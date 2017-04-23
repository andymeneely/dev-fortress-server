/**
 * @module /socket/emitters
 */
function emitToSocket(socket, eventName, eventData) {
  socket.emit(eventName, eventData);
}

function emitToSocketRoom(socket, room, eventName, eventData) {
  socket.to(room).emit(eventName, eventData);
}

function emitInfoEventResults(socket, eventResultName, didSucceed, message) {
  const eventData = {
    event: eventResultName,
    message,
    didSucceed,
  };
  emitToSocket(socket, 'info', eventData);
}

function emitInfoFromSocketToRoom(socket, eventResultName, didSucceed, message, room) {
  const eventData = {
    event: eventResultName,
    message,
    didSucceed,
  };
  emitToSocketRoom(socket, room, 'info', eventData);
}

module.exports = {
  emitToSocket,
  emitInfoEventResults,
  emitInfoFromSocketToRoom,
};
