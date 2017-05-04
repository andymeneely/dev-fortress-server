/**
 * @module /socket/handlers/handlers
 */
const teamController = require('../controllers/team');
const storytellerController = require('../controllers/storyteller');
const gameController = require('../controllers/game');

function registerTeamHandlers(socket) {
  socket.on('update_team', () => {
    teamController.updateTeamInfo(socket, () => {});
  });
}

function registerStorytellerHandlers(socket) {
  socket.on('update_games_list', () => {
    storytellerController.updateStorytellerGamesList(socket, () => {});
  });

  socket.on('join_game_room', (gameId) => {
    storytellerController.joinGameRoom(socket, gameId);
  });

  socket.on('start_game', (gameId) => {
    console.log(`Socket ${socket.id} has started Game ID ${gameId}`);
    // TODO: start_game logic
  });

  socket.on('next_round', (gameId) => {
    storytellerController.isGameStoryteller(socket, gameId, (isValid) => {
      if (isValid) {
        gameController.nextRound(gameId);
      }
    });
  });
}

/**
 * Initialize a Team socket.
 * @param {Socket} socket the socket.io socket
 * @param {Integer} teamId the id of the team being initialized
 */
function initializeTeam(socket, teamId) {
  teamController.storeSocketIdTeamId(socket, teamId, () => {
    teamController.updateTeamInfo(socket, () => {
      teamController.joinGameRoom(socket, () => {
        registerTeamHandlers(socket);
      });
    });
  });
}

/**
 * Initialize a Storyteller socket.
 * @param {Socket} socket the socket.io socket
 * @param {Integer} storytellerId the id of the storyteller being initialized
 */
function initializeStoryteller(socket, storytellerId) {
  storytellerController.storeSocketIdStorytellerId(socket, storytellerId, () => {
    storytellerController.updateStorytellerInfo(socket, () => {
      storytellerController.updateStorytellerGamesList(socket, () => {
        registerStorytellerHandlers(socket);
      });
    });
  });
}

module.exports = {
  initializeTeam,
  initializeStoryteller,
};
