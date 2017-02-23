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
  authenticationMiddleware.validateAuthenticationAttachUser,
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
  authenticationMiddleware.validateAuthenticationAttachUser, // verify token and attach user to res
  authenticationMiddleware.verifyAdministrator,              // verifyAdministrator middleware
  userController.setRoles
);
router.post(
  '/login',
  authenticationController.login
);
router.post(
  '/refresh',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationController.refreshToken
);
module.exports = router;
