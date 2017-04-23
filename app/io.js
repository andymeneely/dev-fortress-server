const Server = require('socket.io');
const authMiddleware = require('./socket/middleware/authentication');
const handlers = require('./socket/handlers/handlers');

const ioOptions = {
  path: '/socket.io',
  serveClient: false,
};

const io = new Server(ioOptions);

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} has connected`);
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} has disconnected`);
  });
  socket.on('authenticate_team', (token) => {
    authMiddleware.validateTeamToken(socket, token, () => {
      handlers.registerTeamHandlers(socket);
    });
  });
});

module.exports = io;
