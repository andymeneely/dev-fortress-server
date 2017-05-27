const actionController = require('../controllers/action');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /action Get Actions
 * @apiName GetActions
 * @apiGroup Action
 *
 * @apiDescription
 * Retrieve all Actions. Requires authentication.
 *
 * @apiHeader  {String}     Authorization     Bearer [JWT_TOKEN]
 *
 * @apiSuccess {Action[]}   actions                 List of Actions.
 * @apiSuccess {Number}     actions.id              Primary key.
 * @apiSuccess {String}     actions.name            Title of the action.
 * @apiSuccess {String}     actions.description     A brief explanation of the action.
 * @apiSuccess {Number}     actions.devcaps_cost    The amount of DevCaps required by a team
 *                                                  to perform the action.
 * @apiSuccess {Number}     actions.mindset_reward  The amount of HackerMindset rewarded to a team
 *                                                  after performing the action.
 * @apiSuccess {Boolean}    actions.repeatable      Indicates whether or not an action may be
 *                                                  performed multiple times by a single team.
 * @apiSuccess {Boolean}    actions.requires_mature Indicates whether or not a team must be Mature
 *                                                  in order to perform the action.
 */
router.get(
  '/',
  authenticationMiddleware.validateAuthentication,
  actionController.getActions
);

/**
 * @api {get} /action/:id Get Action by ID
 * @apiName GetAction
 * @apiGroup Action
 *
 * @apiDescription
 * Retrieve an Action by its ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization   Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}     :id             The ID of the action.
 *
 * @apiSuccess {Number}     id              Primary key.
 * @apiSuccess {String}     name            Title of the action.
 * @apiSuccess {String}     description     A brief explanation of the action.
 * @apiSuccess {Number}     devcaps_cost    The total number of DevCaps required by a team
 *                                          to perform the action.
 * @apiSuccess {Number}     mindset_reward  The total number of HackerMindset rewarded to a team
 *                                          after performing the action.
 * @apiSuccess {Boolean}    repeatable      Indicates whether or not an action may be
 *                                          performed multiple times by a single team.
 * @apiSuccess {Boolean}    requires_mature Indicates whether or not a team must be Mature
 *                                          in order to perform the action.
 */
router.get(
  '/:id',
  authenticationMiddleware.validateAuthentication,
  actionController.getActionById
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
