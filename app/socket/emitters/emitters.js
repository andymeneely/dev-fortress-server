/**
 * @module /socket/emitters
 */
function emitToSocket(socket, eventName, eventData) {
  socket.emit(eventName, eventData);
}

function emitInfoEventResults(socket, eventResultName, didSucceed, message) {
  const eventData = {
    event: eventResultName,
    message,
    didSucceed,
  };
  emitToSocket(socket, 'info', eventData);
}

module.exports = {
  emitToSocket,
  emitInfoEventResults,
};
