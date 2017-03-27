const teamController = require('../controllers/team');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

// Optional: include a query param 'game_id' to return Teams for a specific game.
// router.get(
//   '/',
//   teamController.getTeams
// );

// router.get(
//   '/:team_id',
//   teamController.getTeamById
// );

// router.patch(
//   '/:team_id',
//   authenticationMiddleware.validateAuthenticationAttachUser,
//   authenticationMiddleware.verifyProfessor,
//   teamController.updateExistingTeamType
// );

router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationMiddleware.verifyProfessor,
  teamController.createTeam
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
