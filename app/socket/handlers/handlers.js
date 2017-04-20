/**
 * @module /socket/handlers/handlers
 */
const teamController = require('../controllers/team');
const gameController = require('../controllers/game');

/**
 * Register event handlers for Team events.
 * @param {Socket} socket the socket.io socket
 */
function registerTeamHandlers(socket) {
  // Retrieve Team info
  socket.on('get_team_info', () => {
    teamController.getTeam(socket, (err, team) => {
      socket.emit('team_info', team);
      console.log(`Team Info: ${team}`);
    });
  });

  // Retrieve Game info
  socket.on('get_game_info', () => {
    teamController.getTeam(socket, (teamErr, team) => {
      const teamJson = JSON.parse(team);
      gameController.getGame(teamJson.game_id, (gameErr, game) => {
        socket.emit('game_info', game);
        console.log(`Game Info: ${game}`);
      });
    });
  });

  // Join the namespace for the Game
  socket.on('join_game_room', () => {
    teamController.joinGameRoom(socket);
  });
}

module.exports = {
  registerTeamHandlers,
};
