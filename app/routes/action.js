const actionController = require('../controllers/action');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

// GET all Actions
router.get(
  '/',
  authenticationMiddleware.validateAuthentication,
  actionController.getActions
);

// GET a specific Action
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
