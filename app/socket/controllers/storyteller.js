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

function storeSocketIdStorytellerId(socket, storytellerId, callback) {
  const socketId = String(socket.id);
  redis.set(socketId, storytellerId, callback);
}

function storeStorytellerInfo(storyteller, callback) {
  const jsonString = JSON.stringify(storyteller);
  redis.set(`storyteller_${storyteller.id}`, jsonString, callback);
}

function storeStorytellerGamesList(storytellerId, gameIdList, callback) {
  redis.rpush(`storyteller_${storytellerId}_games`, ...gameIdList);
  callback();
}

function updateStorytellerGamesList(socket, callback) {
  getStorytellerId(socket, (id) => {
    gameController.getGamesByStorytellerId(id, (games) => {
      const gameIdList = [];
      games.forEach((game) => {
        gameIdList.push(game.id);
      });
      storeStorytellerGamesList(id, gameIdList, () => {
        emitters.storytellerEmitters.emitStorytellerGames(socket, games);
        if (callback) callback();
      });
    });
  });
}

function updateStorytellerInfo(socket, callback) {
  getStoryteller(socket, (user) => {
    storeStorytellerInfo(user, callback);
  });
}

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
