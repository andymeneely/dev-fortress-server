const eventController = require('../controllers/event');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /event Get Events
 * @apiName GetEvents
 * @apiGroup Event
 *
 * @apiDescription
 * Retrieve all Events. Requires authentication.
 *
 * @apiHeader  {String}     Authorization           Bearer [JWT_TOKEN]
 *
 * @apiSuccess {Event[]}    events                 List of events.
 * @apiSuccess {Number}     events.id              Primary key.
 * @apiSuccess {String}     events.name            Title of the event.
 * @apiSuccess {String}     events.description     A brief explanation of the event.
 * @apiSuccess {Number}     events.default_damage  The default amount of company damage inflicted.
 * @apiSuccess {Boolean}    events.disabled        Indicates whether or not the event is disabled.
 */
router.get(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  eventController.getEvents
);

/**
 * @api {get} /event/:id Get Event by ID
 * @apiName GetEvent
 * @apiGroup Event
 *
 * @apiDescription
 * Retrieve an Event by its ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization          Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}     :id                    The ID of the Event to retrieve.
 *
 * @apiSuccess {Event[]}    events                 List of events.
 * @apiSuccess {Number}     events.id              Primary key.
 * @apiSuccess {String}     events.name            Title of the event.
 * @apiSuccess {String}     events.description     A brief explanation of the event.
 * @apiSuccess {Number}     events.default_damage  The default amount of company damage inflicted.
 * @apiSuccess {Boolean}    events.disabled        Indicates whether or not the event is disabled.
 */
router.get(
  '/:id',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  eventController.getEventById
);

/**
 * @api {post} /event Create new Event
 * @apiName CreateEvent
 * @apiGroup Event
 *
 * @apiDescription
 * Create a new Event. Requires authentication.
 *
 * @apiHeader  {String}     Authorization          Bearer [JWT_TOKEN]
 *
 * @apiParam   {String}  name            Title of the new event.
 * @apiParam   {String}  description     A brief explanation of the new event.
 * @apiParam   {Number}  default_damage  The default amount of company damage inflicted.
 * @apiParam   {Boolean} [disabled]      Optional. Indicates whether or not the event is disabled.
 *                                         Defaults to 'false'.
 *
 * @apiSuccess {Number}  id              Primary key.
 * @apiSuccess {String}  name            Title of the event.
 * @apiSuccess {String}  description     A brief explanation of the event.
 * @apiSuccess {Number}  default_damage  The default amount of company damage inflicted.
 * @apiSuccess {Boolean} disabled        Indicates whether or not the event is disabled.
 */
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  eventController.createEvent
);

/**
 * @api {patch} /event/:id Modify Event by ID
 * @apiName EditEvent
 * @apiGroup Event
 *
 * @apiDescription
 * Modify an existing Event. Requires authentication.
 *
 * @apiHeader  {String}     Authorization          Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}  :id               The ID of the Event to be modified.
 * @apiParam   {String}  [name]            Title of the event.
 * @apiParam   {String}  [description]     A brief explanation of the event.
 * @apiParam   {Number}  [default_damage]  The default amount of company damage inflicted.
 * @apiParam   {Boolean} [disabled]        Indicates whether or not the event is disabled.
 *
 * @apiSuccess {Number}  id              Primary key.
 * @apiSuccess {String}  name            Title of the event.
 * @apiSuccess {String}  description     A brief explanation of the event.
 * @apiSuccess {Number}  default_damage  The default amount of company damage inflicted.
 * @apiSuccess {Boolean} disabled        Indicates whether or not the event is disabled.
 */
router.patch(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  eventController.updateEvent
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
