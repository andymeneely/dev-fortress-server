const teamtypeController = require('../controllers/teamtype');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /teamtype Get TeamTypes
 * @apiName GetTeamTypes
 * @apiGroup TeamType
 *
 * @apiDescription
 * Retrieve all TeamTypes. Requires authentication.
 *
 * @apiHeader  {String}      Authorization                Bearer [JWT_TOKEN]
 *
 * @apiSuccess {TeamType[]}  teamtypes                    List of teamtypes.
 * @apiSuccess {Number}      teamtypes.id                 Primary key.
 * @apiSuccess {String}      teamtypes.name               The name of the teamtype.
 * @apiSuccess {Boolean}     teamtypes.initial_mature     The default 'mature' value for Teams
 *                                                          created from this teamtype.
 * @apiSuccess {Number}      teamtypes.initial_resources  The default amount of resources a Team
 *                                                          of this type has to spend.
 * @apiSuccess {Number}      teamtypes.initial_mindset    The default amount of hacker mindset a
 *                                                          Team of this type has earned.
 **/
router.get(
  '/',
  authenticationMiddleware.validateAuthentication,
  teamtypeController.getTeamTypes
);

/**
 * @api {get} /teamtype/:id Get TeamType by ID
 * @apiName GetTeamType
 * @apiGroup TeamType
 *
 * @apiDescription
 * Retrieve a TeamType by its ID. Requires authentication.
 *
 * @apiHeader  {String}      Authorization      Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}      :id                The ID of the teamtype to retrieve.
 *
 * @apiSuccess {Number}      id                 Primary key.
 * @apiSuccess {String}      name               The name of the teamtype.
 * @apiSuccess {Boolean}     initial_mature     The default 'mature' value for Teams
 *                                                          created from this teamtype.
 * @apiSuccess {Number}      initial_resources  The default amount of resources a Team
 *                                                          of this type has to spend.
 * @apiSuccess {Number}      initial_mindset    The default amount of hacker mindset a
 *                                                          Team of this type has earned.
 **/
router.get(
  '/:id',
  authenticationMiddleware.validateAuthentication,
  teamtypeController.getTeamTypeById
);

/**
 * @api {post} /teamtype Create new TeamType
 * @apiName CreateTeamType
 * @apiGroup TeamType
 *
 * @apiDescription
 * Create a new TeamType. Requires authentication.
 *
 * @apiHeader  {String}      Authorization      Bearer [JWT_TOKEN]
 *
 * @apiSuccess {Number}      id                 Primary key.
 * @apiSuccess {String}      name               The name of the teamtype.
 * @apiSuccess {Boolean}     initial_mature     The default 'mature' value for Teams
 *                                                          created from this teamtype.
 * @apiSuccess {Number}      initial_resources  The default amount of resources a Team
 *                                                          of this type has to spend.
 * @apiSuccess {Number}      initial_mindset    The default amount of hacker mindset a
 *                                                          Team of this type has earned.
 **/
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  teamtypeController.createTeamType
);

/**
 * @api {patch} /teamtype/:id Modify TeamType by ID
 * @apiName EditTeamType
 * @apiGroup TeamType
 *
 * @apiDescription
 * Modify a TeamType given its ID. Requires authentication.
 *
 * @apiHeader  {String}      Authorization        Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}      :id                  The ID of the teamtype to be modified.
 * @apiParam   {String}      [name]               The name of the teamtype.
 * @apiParam   {Boolean}     [initial_mature]     The default 'mature' value for Teams
 *                                                  created from this teamtype.
 * @apiParam   {Number}      [initial_resources]  The default amount of resources a Team
 *                                                  of this type has to spend.
 * @apiParam   {Number}      [initial_mindset]    The default amount of hacker mindset a
 *                                                  Team of this type has earned.
 *
 * @apiSuccess {Number}      id                 Primary key.
 * @apiSuccess {String}      name               The name of the teamtype.
 * @apiSuccess {Boolean}     initial_mature     The default 'mature' value for Teams
 *                                                created from this teamtype.
 * @apiSuccess {Number}      initial_resources  The default amount of resources a Team
 *                                                of this type has to spend.
 * @apiSuccess {Number}      initial_mindset    The default amount of hacker mindset a
 *                                                Team of this type has earned.
 **/
router.patch(
  '/:id',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  teamtypeController.updateExistingTeamType
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
