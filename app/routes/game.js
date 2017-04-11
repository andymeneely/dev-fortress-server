const gameController = require('../controllers/game');
const authMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /game Get All Games
 * @apiName GetGames
 * @apiGroup Game
 *
 * @apiDescription
 * Retrieve all Games. Requires authentication.
 *
 * @apiHeader  {String}     Authorization     Bearer [JWT_TOKEN]
 *
 * @apiParam   {String}     [withRelated]     Specify which relations
 *                                              the Games should be returned with.
 *                                              Valid options include: 'storyteller' and 'teams'.
 *                                              One relation per 'withRelated' query param.
 *
 * @apiParam   {Integer}    [storyteller_id]  Filter Games matching the storyteller_id.
 *
 * @apiSuccess {Game[]}     games                 List of Games.
 * @apiSuccess {Integer}    games.id              Primary key of the Game.
 * @apiSuccess {String}     games.name            Custom name of the Game.
 * @apiSuccess {String}     games.created_at      ISO String timestamp of when the Game was created.
 * @apiSuccess {Integer}    games.current_round   The current round of the Game.
 * @apiSuccess {Integer}    games.max_round       The round at which the Game will end.
 * @apiSuccess {Integer}    games.round_phase     The current round phase the Game is in.
 *                                                  Dictates what actions can take place.
 * @apiSuccess {Integer}    games.storyteller_id  The foreign key reference to the
 *                                                  Professor User running the Game session.
 * @apiSuccess {User}       [games.storyteller]   The User object representing the Storyteller.
 *                                                  Only returned when 'withRelated' == 'storyteller'.
 */
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

/**
 * @api {get} /game Get Game by ID
 * @apiName GetGame
 * @apiGroup Game
 *
 * @apiDescription
 * Retrieve Game by ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization     Bearer [JWT_TOKEN]
 *
 * @apiParam   {String}     [withRelated]     Specify which relations
 *                                              the Games should be returned with.
 *                                              Valid options include: 'storyteller' and 'teams'.
 *                                              One relation per 'withRelated' query param.
 *
 * @apiSuccess {Integer}    id                Primary key.
 * @apiSuccess {String}     name              Custom name of the Game.
 * @apiSuccess {String}     created_at        ISO String timestamp of when the Game was created.
 * @apiSuccess {Integer}    current_round     The current round of the Game
 * @apiSuccess {Integer}    max_round         The round at which the Game will end.
 * @apiSuccess {Integer}    round_phase       The current round phase the Game is in.
 *                                              Dictates what actions can take place.
 * @apiSuccess {Integer}    storyteller_id    The foreign key reference to the
 *                                              Professor user running the Game session.
 * @apiSuccess {User}       [storyteller]     The User object representing the Storyteller.
 *                                              Only returned when 'withRelated' == 'storyteller'.
 */
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
