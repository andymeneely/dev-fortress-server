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
  authMiddleware.validateAuthenticationAttachEntity,
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
  authMiddleware.validateAuthenticationAttachEntity,
  authMiddleware.verifyProfessor,
  gameController.updateGame
);

/**
 * Generate 404s.
 * Only use this at the bottom of custom route handlers.
 */
router.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    request: req.body,
  });
});

module.exports = router;
