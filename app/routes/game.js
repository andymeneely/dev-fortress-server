const gameController = require('../controllers/game');
const authMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /game Get Games
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
 * @apiParam   {Number}     [storyteller_id]  Filter Games matching the storyteller_id.
 *
 * @apiSuccess {Game[]}     games                 List of Games.
 * @apiSuccess {Number}     games.id              Primary key of the Game.
 * @apiSuccess {String}     games.name            Custom name of the Game.
 * @apiSuccess {String}     games.created_at      ISO String timestamp of when the Game was created.
 * @apiSuccess {Number}     games.current_round   The current round of the Game.
 * @apiSuccess {Number}     games.max_round       The round at which the Game will end.
 * @apiSuccess {Number}     games.round_phase     The current round phase the Game is in.
 *                                                  Dictates what actions can take place.
 * @apiSuccess {Number}     games.storyteller_id  The foreign key reference to the
 *                                                  Professor User running the Game session.
 * @apiSuccess {User}       [games.storyteller]   The User object representing the Storyteller.
 *                                                  Only returned when 'withRelated'=='storyteller'.
 */
router.get(
  '/',
  authMiddleware.validateAuthentication,
  gameController.getGames
);

/**
 * @api {post} /game Create Game
 * @apiName CreateGame
 * @apiGroup Game
 *
 * @apiDescription
 * Create a new Game. Requires authentication.
 *
 * @apiHeader  {String}   Authorization     Bearer [JWT_TOKEN]
 *
 * @apiParam   {String}   name              The name for the game; Unique.
 * @apiParam   {Number}   max_round         The number of rounds the game will last.
 * @apiParam   {Number}   [storyteller_id]  Optional. The ID of a User in the 'professor' role.
 *                                          Defaults to the User issuing the request.
 */
router.post(
  '/',
  authMiddleware.validateAuthenticationAttachEntity,
  authMiddleware.verifyProfessor,
  gameController.createGame
);

/**
 * @api {get} /game/:id Get Game by ID
 * @apiName GetGame
 * @apiGroup Game
 *
 * @apiDescription
 * Retrieve Game by ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization     Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}     :id               The ID of the game.
 *
 * @apiParam   {String}     [withRelated]     Query param. Specify which relations
 *                                              the Games should be returned with.
 *                                              Valid options include: 'storyteller' and 'teams'.
 *                                              One relation per 'withRelated' query param.
 *
 * @apiSuccess {Number}     id                Primary key.
 * @apiSuccess {String}     name              Custom name of the Game.
 * @apiSuccess {String}     created_at        ISO String timestamp of when the Game was created.
 * @apiSuccess {Number}     current_round     The current round of the Game.
 * @apiSuccess {Number}     max_round         The round at which the Game will end.
 * @apiSuccess {Number}     round_phase       The current round phase the Game is in.
 *                                              Dictates what actions/events are taking place.
 * @apiSuccess {Number}     storyteller_id    The foreign key reference to the
 *                                              Professor user running the Game session.
 * @apiSuccess {User}       [storyteller]     The User object representing the Storyteller.
 *                                              Only returned when 'withRelated'=='storyteller'.
 */
router.get(
  '/:id',
  authMiddleware.validateAuthentication,
  gameController.getGameById
);

/**
 * @api {patch} /game/:id Modify Game by ID
 * @apiName EditGame
 * @apiGroup Game
 *
 * @apiDescription
 * Modify an existing Game. Requires authentication.
 *
 * @apiHeader  {String}   Authorization       Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}   :id                 The ID of the Game to be modified.
 *
 * @apiParam   {String}   [name]              The name for the game; Unique.
 * @apiParam   {Number}   [max_round]         The number of rounds the game will last.
 * @apiParam   {Number}   [storyteller_id]    Optional. The ID of a User in the 'professor' role.
 *                                              Defaults to the User issuing the request.
 * @apiParam   {Number}   [current_round]     The current round of the Game.
 * @apiParam   {Number}   [round_phase]       The currend round phase the game is in.
 *                                              Dictates what actions/events are taking place.
 */
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
