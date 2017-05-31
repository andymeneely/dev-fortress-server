/**
 * @module /socket/handlers/handlers
 */
const teamController = require('../controllers/team');
const storytellerController = require('../controllers/storyteller');
const gameController = require('../controllers/game');
const authMiddleware = require('../../socket/middleware/authentication');
const redis = require('../../redis');
const io = require('../../io');

/**
 * Register event listeners and handler callbacks for a team socket.
 * Internal function.
 * Called by initializeTeam().
 * @param socket the socket to which listeners are attached.
 */
function registerTeamHandlers(socket) {
  /**
   * Update the Team model in redis.
   * Pre-reqs: 'authenticate_team',
   * Response emits: TODO emit to team info event channel
   */
  socket.on('update_team', () => {
    teamController.updateTeamInfo(socket, () => {});
  });

  /**
   * Adds an Action to the pending actions list for the Team. Updates list in redis.
   * Pre-reqs: 'authenticate_team',
   * Response emits: 'selected_actions_update' broadcast to room with a json object
   *                 whose keys are all Team ids, and values are the id's of the actions
   *                 they've selected.
   */
  socket.on('select_action', (actionId) => {
    teamController.updatePendingTeamAction(socket, actionId, 'add', () => {});
  });

  /**
   * Removes an Action from the pending actions list for the Team. Updates list in redis.
   * Pre-reqs: 'authenticate_team',
   * Response emits: 'selected_actions_update' broadcast to room with a json object
   *                 whose keys are all Team ids, and values are the id's of the actions
   *                 they've selected.
   */
  socket.on('deselect_action', (actionId) => {
    teamController.updatePendingTeamAction(socket, actionId, 'remove', () => {});
  });
}

/**
 * Register event listeners and handler callbacks for a storyteller socket.
 * Internal function.
 * Called by initializedStoryteller().
 * @param socket the socket to which listeners are attached.
 */
function registerStorytellerHandlers(socket) {
  /**
   * Retrieve all games from the database for which the user is the storyteller,
   * cache them in redis, and emit the collection via an array to the private 'games_list'
   * channel of the client socket.
   * Pre-reqs: 'authenticate_storyteller'
   * Response emits: 'games_list' - private
   */
  socket.on('update_games_list', () => {
    storytellerController.updateStorytellerGamesList(socket, () => {});
  });

  /**
   * Join a game room: 'game_[id]'.
   * Pre-reqis: 'authenticate_storyteller',
   *            storyteller.id === game.storyteller_id
   * Response emits: 'info' - broadcast, room: 'game_[id]'
   *                 'info' - private
   * @param {Integer} gameId the ID of the game room to which the storyteller should join.
   */
  socket.on('join_game_room', (gameId) => {
    storytellerController.joinGameRoom(socket, gameId);
  });

  /**
   * Start an existing, configured game.
   * Initialize the game model state.
   * Informs 'game_[id]' room via broadcast to 'game_info' channel.
   * Pre-reqs: 'authenticate_storyteller',
   *           storyteller.id === game.storyteller_id
   * @param {Integer} gameId the ID of the game to start.
   */
  socket.on('start_game', (gameId) => {
    // console.log(`Socket ${socket.id} has started Game ID ${gameId}`);
    // TODO: start_game logic
    storytellerController.isGameStoryteller(socket, gameId, (isValid) => {
      if (isValid) {
        gameController.startGame(gameId);
      }
    });
  });

  /**
   * Proceed to the next round.
   * Informs 'game_[id]' room via broadcast to 'game_info' channel.
   * Pre-reqs: 'authenticate_storyteller',
   *           storyteller.id === game.storyteller_id
   * @param {Integer} gameId the ID of the relevant game.
   */
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
 * This method is intended to be called following a successful 'authenticate_team'.
 * @param {Socket} socket the socket.io socket
 * @param {Integer} teamId the id of the team being initialized
 */
function initializeTeam(socket, teamId) {
  // Store the socketID, teamID association in redis.
  teamController.storeSocketIdTeamId(socket, teamId, () => {
    // Store the socket's Team model in redis.
    teamController.updateTeamInfo(socket, () => {
      // Join the room of the game to which the Team belongs: 'game_[id]'
      teamController.joinGameRoom(socket, () => {
        // Register all listeners for client emits.
        registerTeamHandlers(socket);
      });
    });
  });
}

/**
 * Initialize a Storyteller socket.
 * This method is intended to be called following a successful 'authenticate_storyteller'.
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

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected.`);

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected.`);
    const socketId = String(socket.id);
    redis.del(socketId);
  });
  socket.on('authenticate_team', (token) => {
    authMiddleware.validateTeamToken(socket, token, (teamId) => {
      initializeTeam(socket, teamId);
    });
  });
  socket.on('authenticate_storyteller', (token) => {
    authMiddleware.validateUserToken(socket, token, (userId) => {
      initializeStoryteller(socket, userId);
    });
  });
});

module.exports = {
  initializeTeam,
  initializeStoryteller,
};
