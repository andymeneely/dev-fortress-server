const userController = require('../controllers/user');
const authenticationController = require('../controllers/authentication');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

// GET all users
router.get(
  '/',  // route
  authenticationMiddleware.validateAuthentication,  // isAuthenticated middleware
  userController.getUsers  // the controller
);
// GET a specific user
router.get(
  '/:id',
  authenticationMiddleware.validateAuthentication,  // isAuthenticated middleware
  userController.getUserById
);
// CREATE a new user
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyAdministrator,
  userController.registerNewUser
);
// DELETE a user
router.delete(
  '/:id',
  authenticationMiddleware.validateAuthentication,  // isAuthenticated middleware
  userController.deleteUserById
);
router.patch(
  '/:id/roles',
  authenticationMiddleware.validateAuthenticationAttachEntity, // verify token and attach user to res
  authenticationMiddleware.verifyAdministrator,              // verifyAdministrator middleware
  userController.setRoles
);
router.post(
  '/login',
  authenticationController.login
);
router.post(
  '/refresh',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationController.refreshToken
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
