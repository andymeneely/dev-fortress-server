const gameController = require('../controllers/game');
const authMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

// GET all Games
router.get(
  '/',
  authMiddleware.validateAuthentication,
  gameController.getGames
);

// CREATE a new Game
router.post(
  '/',
  authMiddleware.validateAuthenticationAttachUser,
  authMiddleware.verifyProfessor,
  gameController.createGame
);

// GET Game by id
router.get(
  '/:id',
  authMiddleware.validateAuthentication,
  gameController.getGameById
);

// PATCH Game by id
router.patch(
  '/:id',
  authMiddleware.validateAuthenticationAttachUser,
  authMiddleware.verifyProfessor,
  gameController.updateGame
);

module.exports = router;
