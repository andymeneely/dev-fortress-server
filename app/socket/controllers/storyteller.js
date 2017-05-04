/**
 * @module /socket/controllers/storyteller
 */
const redis = require('../../redis');
const userController = require('./user');
const gameController = require('./game');
const roomController = require('./room');
const emitters = require('../emitters');

function getStorytellerId(socket, callback) {
  const socketId = socket.id;
  redis.get(socketId).then(callback);
}

function getStoryteller(socket, callback) {
  getStorytellerId(socket, (userId) => {
    userController.getUserById(userId, callback);
  });
}

/**
 * Store the unique socket id and storyteller id combo in redis.
 * Used for easy authorization and user/team model retrieval.
 * @param {Socket.io} socket         the client socket
 * @param {Integer}   storytellerId  the user id for the connected socket
 * @param {Function}  callback       the function to call when complete
 */
function storeSocketIdStorytellerId(socket, storytellerId, callback) {
  const socketId = String(socket.id);
  redis.set(socketId, storytellerId, callback);
}

/**
 * Store the representation of a storyteller in redis.
 * @param {JSON}     storyteller the storyteller user model
 * @param {Function} callback    the function to call when complete
 */
function storeStorytellerInfo(storyteller, callback) {
  const jsonString = JSON.stringify(storyteller);
  redis.set(`storyteller_${storyteller.id}`, jsonString, callback);
}

/**
 * Store a collection of games in redis.
 * @param {Integer}   storytellerId the id of the storyteller
 * @param {Integer[]} gameIdList    the array list of game ids with
 *                                  which to associate the storyteller
 */
function storeStorytellerGamesList(storytellerId, gameIdList, callback) {
  redis.rpush(`storyteller_${storytellerId}_games`, ...gameIdList);
  callback();
}

/**
 * Retrieves an up-to-date collection of Games for the storyteller. Updates their state in redis.
 * @param {Socket.io} socket   the client socket
 * @param {Function}  callback (optional) the function to call when complete
 */
function updateStorytellerGamesList(socket, callback) {
  getStorytellerId(socket, (id) => {
    gameController.getGamesByStorytellerId(id, (games) => {
      const gameIdList = games.map(element => element.id);
      storeStorytellerGamesList(id, gameIdList, () => {
        emitters.storytellerEmitters.emitStorytellerGames(socket, games);
        if (callback) callback();
      });
    });
  });
}

/**
 * Retrieves an up-to-date representation of the Storyteller. Updates its state in redis.
 * @param {Socket.io} socket the client socket
 * @param {Function}  client the function to call when complete
 */
function updateStorytellerInfo(socket, callback) {
  getStoryteller(socket, (user) => {
    storeStorytellerInfo(user, callback);
  });
}

/**
 * Join a storyteller to their requested game room, if authorized.
 * @param {Socket.io} socket   the client socket
 * @param {Integer}   gameId   the id of the game to join
 * @param {Function}  callback the function to call when complete
 */
function joinGameRoom(socket, gameId, callback) {
  getStoryteller(socket, (storyteller) => {
    gameController.getGameById(gameId, (game) => {
      // Ensure the game exists, and that the User is the storyteller of that game
      if (game && game.storyteller_id === storyteller.id) {
        roomController.joinGameRoom(socket, gameId, callback);
      }
    });
  });
}

module.exports = {
  storeSocketIdStorytellerId,
  updateStorytellerInfo,
  updateStorytellerGamesList,
  joinGameRoom,
};
