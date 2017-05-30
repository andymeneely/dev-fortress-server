const rumorControlller = require('../controllers/rumor');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

// all routes require authentication middleware
router.use(
  authenticationMiddleware.validateAuthenticationAttachEntity
);

/**
 * @api {get} /rumor Get Rumors
 * @apiName GetRumors
 * @apiGroup Rumor
 *
 * @apiDescription
 * Retrieve all Rumors. Requires authentication.
 *
 * @apiHeader  {String}     Authorization          Bearer [JWT_TOKEN]
 *
 * @apiSuccess {Rumor[]}    rumors                 List of rumors.
 * @apiSuccess {Number}     rumors.id              Primary key.
 * @apiSuccess {String}     rumors.name            Title of the rumor.
 * @apiSuccess {String}     rumors.description     A brief explanation of the rumor.
 * @apiSuccess {Number}     rumors.event_id        The Event ID with which the rumor is associated.
 * @apiSuccess {Boolean}    rumors.disabled        Indicates whether or not the rumor is disabled.
 */
router.get(
  '/',
  rumorControlller.getRumors
);

/**
 * @api {get} /rumor/:id Get Rumor by ID
 * @apiName GetRumor
 * @apiGroup Rumor
 *
 * @apiDescription
 * Retrieve a Rumor given its ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization          Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}     :id                    ID of the Rumor to retrieve.
 *
 * @apiSuccess {Number}     id              Primary key.
 * @apiSuccess {String}     name            Title of the rumor.
 * @apiSuccess {String}     description     A brief explanation of the rumor.
 * @apiSuccess {Number}     event_id        The Event ID with which the rumor is associated.
 * @apiSuccess {Boolean}    disabled        Indicates whether or not the rumor is disabled.
 */
router.get(
  '/:id',
  rumorControlller.getRumorById
);

/**
 * @api {post} /rumor Create Rumor
 * @apiName CreateRumor
 * @apiGroup Rumor
 *
 * @apiDescription
 * Create a new Rumor. Requires authentication.
 *
 * @apiHeader  {String}     Authorization          Bearer [JWT_TOKEN]
 *
 * @apiParam {String}     name         Title of the new rumor.
 * @apiParam {String}     description  A brief explanation of the new rumor.
 * @apiParam {Number}     event_id     The Event ID with which the new rumor is associated.
 * @apiParam {Boolean}    [disabled]   Optional. Indicates whether or not the new rumor is disabled.
 *
 * @apiSuccess {Number}   id           Primary key.
 * @apiSuccess {String}   name         Title of the rumor.
 * @apiSuccess {String}   description  A brief explanation of the rumor.
 * @apiSuccess {Number}   event_id     The Event ID with which the rumor is associated.
 * @apiSuccess {Boolean}  disabled     Indicates whether or not the rumor is disabled.
 */
router.post(
  '/',
  authenticationMiddleware.verifyProfessor,
  rumorControlller.createRumor
);

/**
 * @api {post} /rumor/:id Modify Rumor by ID
 * @apiName CreateRumor
 * @apiGroup Rumor
 *
 * @apiDescription
 * Modify an existing Rumor given its ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization          Bearer [JWT_TOKEN]
 *
 * @apiParam {Number}     :id            The ID of the Rumor to be modified.
 *
 * @apiParam {String}     [name]         Title of the new rumor.
 * @apiParam {String}     [description]  A brief explanation of the new rumor.
 * @apiParam {Number}     [event_id]     The Event ID with which the new rumor is associated.
 * @apiParam {Boolean}    [disabled]     Indicates whether or not the new rumor is disabled.
 *
 * @apiSuccess {Number}     id           Primary key.
 * @apiSuccess {String}     name         Title of the rumor.
 * @apiSuccess {String}     description  A brief explanation of the rumor.
 * @apiSuccess {Number}     event_id     The Event ID with which the rumor is associated.
 * @apiSuccess {Boolean}    disabled     Indicates whether or not the rumor is disabled.
 */
router.patch(
  '/:id',
  authenticationMiddleware.verifyProfessor,
  rumorControlller.updateExistingRumor
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
