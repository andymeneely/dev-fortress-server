const eventController = require('../controllers/event');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

// GET all events
router.get(
  '/',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationMiddleware.verifyProfessor,
  eventController.getEvents
);

// GET a specific event
router.get(
  '/:id',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationMiddleware.verifyProfessor,
  eventController.getEventById
);

// CREATE a new user
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationMiddleware.verifyProfessor,
  eventController.createEvent
);

// UPDATE a specific event
router.patch(
  '/id',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationMiddleware.verifyProfessor,
  eventController.createEvent
);
