const eventController = require('../controllers/event');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

// GET all events
router.get(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  eventController.getEvents
);

// GET a specific event
router.get(
  '/:id',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  eventController.getEventById
);

// CREATE a new user
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyProfessor,
  eventController.createEvent
);

// UPDATE a specific event
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
