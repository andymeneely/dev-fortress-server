const Server = require('socket.io');

const ioOptions = {
  path: '/socket.io',
  serveClient: false,
};

const io = new Server(ioOptions);

module.exports = io;
