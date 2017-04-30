/**
 * @module socket/middleware/authentication
 */
const authLib = require('../../lib/authentication');
const emitters = require('../emitters');
const teamController = require('../controllers/team');
const userController = require('../controllers/user');
const gameController = require('../controllers/game');
const has = require('has');

/**
 * Validate a token of a given type.
 * @param {Socket} socket     the socket io socket
 * @param {String} token      the JWT auth token
 * @param {String} tokenType  'USER' or 'TEAM'
 */
function validateToken(socket, token, tokenType, next) {
  let message;
  let didSucceed;
  authLib.verifyToken(token, (err, decoded) => {
    if (err || !decoded || !has(decoded, 'type') || !has(decoded, 'id') || decoded.type !== tokenType) {
      message = 'Could not verify token!';
      didSucceed = false;
    } else {
      message = `${tokenType} ${decoded.id} has authenticated successfully!`;
      didSucceed = true;
    }
    const emitChannel = tokenType === 'USER' ? 'authenticate_storyteller' : 'authenticate_team';
    emitters.generalEmitters.emitInfoEventResults(socket, emitChannel, didSucceed, message);
    if (didSucceed) {
      next(decoded);
    }
  });
}

/**
 * Validate a given team token.
 * @param {Socket} socket the socket io socket
 * @param {String} token  the team's auth token
 */
function validateTeamToken(socket, token, next) {
  validateToken(socket, token, 'TEAM', (tokenData) => {
    teamController.storeSocketIdTeamId(socket, tokenData.id, next);
  });
}

/**
 * Validate that the User is a storyteller
 */
function validateUserStoryteller(socket, userId, next) {
  // TODO: Do we want logic to check that the user is a storyteller of a game?
  userController.getUserById(userId, (user) => {
    next(user.id);
    // gameController.getGamesByStorytellerId(user.id, (games) => {
    //   if (games.length > 0) next(user.id);
    // });
  });
}

/**
 * Validate a given user token.
 * @param {Socket} socket the socket io socket
 * @param {String} token  the user's auth token
 */
function validateUserToken(socket, token, next) {
  validateToken(socket, token, 'USER', (tokenData) => {
    validateUserStoryteller(socket, tokenData.id, next);
  }
  );
}

module.exports = {
  validateTeamToken,
  validateUserToken,
};
