const mitigationController = require('../controllers/mitigation');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /mitigation Get Mitigations
 * @apiName GetMitigations
 * @apiGroup Mitigation
 *
 * @apiDescription
 * Retrieve all Mitigations, optionally by Event ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization         Bearer [JWT_TOKEN]
 *
 * @apiParam   {Integer}    [event_id]            Filter the results that match a given Event ID.
 * @apiParam   {String}     [withRelated]         Return valid relations on the model.
 *                                                  Valid relations include: 'event'
 *
 * @apiSuccess {Object[]}   mitigations           List of Mitigations.
 * @apiSuccess {Integer}    mitigations.id        Primary key.
 * @apiSuccess {String}     mitigations.type      Logic identifier
 *                                                  'ANY_ANY' => "If ANY Team does ANY Action...".
 * @apiSuccess {JSON}       mitigations.data      JSON representation of logic.
 *                                                  List of Actions, and TeamTypes, reward value.
 * @apiSuccess {Integer}    mitigations.event_id  Foreign key reference to the ID of the Event.
 */
router.get(
  '/',
  authenticationMiddleware.validateAuthentication,
  mitigationController.getMitigations
);

/**
 * @api {get} /mitigation/:id Get Mitigation
 * @apiName GetMitigation
 * @apiGroup Mitigation
 *
 * @apiDescription
 * Retrieve Mitigation by ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization         Bearer [JWT_TOKEN]
 *
 * @apiParam   {String}     [withRelated]         Return valid relations on the model.
 *                                                  Valid relations include: 'event'.
 * @apiParam   {Integer}    :id                   Primary key of the mitigation being queried
 *
 * @apiSuccess {Integer}    id        Primary key.
 * @apiSuccess {String}     type      Logic identifier
 *                                      'ANY_ANY' => "If ANY Team does ANY Action...".
 * @apiSuccess {JSON}       data      JSON representation of logic.
 *                                      List of Actions, list of TeamTypes, reward value.
 * @apiSuccess {Integer}    event_id  Foreign key reference to the ID of the Event.
 *
 * @apiError   MitigationNotFound   The <code>id</code> of the Mitigation was not found.
 */
router.get(
  '/:id',
  authenticationMiddleware.validateAuthentication,
  mitigationController.getMitigationById
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
