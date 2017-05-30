const teamController = require('../controllers/team');
const authController = require('../controllers/authentication');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /team Get Teams
 * @apiName GetTeams
 * @apiGroup Team
 *
 * @apiDescription
 * Retrieve all Teams.
 *
 * @apiParam   {String}   [game_id]           Query param to return teams for a specified game.
 *
 * @apiSuccess {Team[]}   teams               List of teams.
 * @apiSuccess {Number}   teams.id            Primary key.
 * @apiSuccess {String}   teams.name          The custom name for the team.
 * @apiSuccess {Boolean}  teams.mature        Indicates whether or not the team is 'mature'.
 * @apiSuccess {Number}   teams.resources     The amount of resources the team has to spend.
 * @apiSuccess {Number}   teams.mindset       The amount of hacker mindset the team has earned.
 * @apiSuccess {Number}   teams.teamtype_id   ID of the TeamType with which the team is associated.
 * @apiSuccess {Number}   teams.game_id       ID of the Game with which the team is associated.
 * @apiSuccess {String}   teams.link_code     Random alphanumeric string used to auth with the API.
 */
router.get(
  '/',
  teamController.getTeams
);

/**
 * @api {get} /team/:id Get Team by ID
 * @apiName GetTeam
 * @apiGroup Team
 *
 * @apiDescription
 * Retrieve Team by its ID.
 *
 * @apiParam   {String}   :id           The ID of the team to retrieve.
 *
 * @apiSuccess {Number}   id            Primary key.
 * @apiSuccess {String}   name          The custom name for the team.
 * @apiSuccess {Boolean}  mature        Indicates whether or not the team is 'mature'.
 * @apiSuccess {Number}   resources     The amount of resources the team has to spend.
 * @apiSuccess {Number}   mindset       The amount of hacker mindset the team has earned.
 * @apiSuccess {Number}   teamtype_id   ID of the TeamType with which the team is associated.
 * @apiSuccess {Number}   game_id       ID of the Game with which the team is associated.
 * @apiSuccess {String}   link_code     Random alphanumeric string used to auth with the API.
 */
router.get(
  '/:id',
  teamController.getTeamById
);

/**
 * @api {post} /team Create a Team
 * @apiName CreateTeam
 * @apiGroup Team
 *
 * @apiDescription
 * Create a new Team. Requires authentication.
 *
 * @apiHeader {String}   Authorization   Bearer [JWT_TOKEN]
 *
 * @apiParam {Number}    teamtype_id     ID of the TeamType with which the team is associated.
 * @apiParam {Number}    game_id         ID of the Game with which the team is associated.
 * @apiParam {String}    [name]          The custom name for the team.
 * @apiParam {Boolean}   [mature]        Indicates whether or not the team is 'mature'.
 * @apiParam {Number}    [resources]     The amount of resources the team has to spend.
 * @apiParam {Number}    [mindset]       The amount of hacker mindset the team has earned.
 *
 * @apiSuccess {Number}   id             Primary key.
 * @apiSuccess {String}   name           The custom name for the team.
 * @apiSuccess {Boolean}  mature         Indicates whether or not the team is 'mature'.
 * @apiSuccess {Number}   resources      The amount of resources the team has to spend.
 * @apiSuccess {Number}   mindset        The amount of hacker mindset the team has earned.
 * @apiSuccess {Number}   teamtype_id    ID of the TeamType with which the team is associated.
 * @apiSuccess {Number}   game_id        ID of the Game with which the team is associated.
 * @apiSuccess {String}   link_code      Random alphanumeric string used to auth with the API.
 */
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  teamController.createTeam
);

/**
 * @api {patch} /team/:id Modify Team by ID
 * @apiName EditTeam
 * @apiGroup Team
 *
 * @apiDescription
 * Modify a Team given its ID. Currently only supports Teams updating their 'name' field.
 * Requires Team authentication.
 *
 * @apiHeader  {String}   Authorization Bearer [JWT_TOKEN]
 *
 * @apiParam   {String}   :id           The ID of the team to modify.
 * @apiParam   {String}   name          The custom name for the team; Unique.
 *
 * @apiSuccess {Number}   id            Primary key.
 * @apiSuccess {String}   name          The custom name for the team. Defaults to TeamType name.
 * @apiSuccess {Boolean}  mature        Indicates whether or not the team is 'mature'.
 * @apiSuccess {Number}   resources     The amount of resources the team has to spend.
 * @apiSuccess {Number}   mindset       The amount of hacker mindset the team has earned.
 * @apiSuccess {Number}   teamtype_id   ID of the TeamType with which the team is associated.
 * @apiSuccess {Number}   game_id       ID of the Game with which the team is associated.
 * @apiSuccess {String}   link_code     Random alphanumeric string used to auth with the API.
 */
router.patch(
  '/:id',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  teamController.updateExistingTeam
);

/**
 * @api {post} /team/login Modify Team by ID
 * @apiName LoginTeam
 * @apiGroup Team
 *
 * @apiDescription
 * Authenticate a Team given a valid link_code.
 *
 * @apiParam   {String}  link   The link_code of an existing Team.
 *
 * @apiSuccess {String}  token  The new JWT Token.
 */
router.post(
  '/login',
  authenticationMiddleware.validateTeamAttachTeam,
  authController.refreshToken
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
