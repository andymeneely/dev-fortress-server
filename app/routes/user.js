const userController = require('../controllers/user');
const authenticationController = require('../controllers/authentication');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /user Get Users
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiDescription
 * Retrieve all Users. Requires authentication.
 *
 * @apiHeader  {String}     Authorization     Bearer [JWT_TOKEN]
 *
 * @apiSuccess {Object[]}   users             List of Users.
 * @apiSuccess {Number}     users.id          Primary key.
 * @apiSuccess {String}     users.username    Username; unique.
 * @apiSuccess {Boolean}    users.is_admin    Indicates whether or not the User is an Administrator.
 * @apiSuccess {String}     users.created_at  ISO String timestamp of when the User was created.
 */
router.get(
  '/',  // route
  authenticationMiddleware.validateAuthentication,  // isAuthenticated middleware
  userController.getUsers  // the controller
);

/**
 * @api {get} /user/:id Get User by ID
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiDescription
 * Retrieve a User by ID. Requires authentication.
 *
 * @apiHeader  {String}     Authorization     Bearer [JWT_TOKEN]
 *
 * @apiParam   {Number}     :id         User's primary key
 *
 * @apiSuccess {Number}     id          Primary key.
 * @apiSuccess {String}     username    Username; unique.
 * @apiSuccess {Boolean}    is_admin    Indicates whether or not the User is an Administrator.
 * @apiSuccess {String}     created_at  ISO String timestamp of when the User was created.
 */
router.get(
  '/:id',
  authenticationMiddleware.validateAuthentication,  // isAuthenticated middleware
  userController.getUserById
);

/**
 * @api {post} /user Create New User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiDescription
 * Create a new User. Requires Administrator authentication.
 *
 * @apiHeader  {String}     Authorization     Bearer [JWT_TOKEN]
 *
 * @apiParam {String}   username    Unique username for the User.
 * @apiParam {String}   password    Password for the User.
 * @apiParam {String}   email       Unique email address of the User.
 * @apiParam {Boolean}  [is_admin]  Set `true` for Admin account.
 *
 * @apiSuccess {Number}   id        Primary key of the new User.
 * @apiSuccess {String}   username  Username of the new User.
 */
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyAdministrator,
  userController.registerNewUser
);

/**
 * @api {delete} /user/:id Delete User by ID
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiDescription
 * Delete an existing User. Requires administrator authentication.
 *
 * @apiHeader {String}  Authorization  Bearer [JWT_TOKEN]
 *
 * @apiParam  {String}  :id            ID of the User to be deleted.
 */
router.delete(
  '/:id',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyAdministrator,
  userController.deleteUserById
);

/**
 * @api {patch} /user/:id/roles Set User Role
 * @apiName AttachUserRole
 * @apiGroup User
 *
 * @apiDescription
 * Attach an existing User to a Role. Requires Administrator authentication.
 *
 * @apiHeader  {String}     Authorization     Bearer [JWT_TOKEN]
 *
 * @apiParam {String}   :id         Primary key for the existing User.
 * @apiParam {Number}   [add]       The Role ID to add the User to.
 * @apiParam {Number}   [remove]    The Role ID to remove the User from.
 */
router.patch(
  '/:id/roles',
  authenticationMiddleware.validateAuthenticationAttachEntity,
  authenticationMiddleware.verifyAdministrator,
  userController.setRoles
);

/**
 * @api {post} /user/login Login to User Account
 * @apiName UserLogin
 * @apiGroup User
 *
 * @apiDescription
 * Login to an existing User account.
 *
 * @apiParam {String}   username    The username for the User.
 * @apiParam {String}   password    The password for the User.
 *
 * @apiSuccess {String} token   The JWT token with which to send authenticated requests.
 */
router.post(
  '/login',
  authenticationController.login
);

/**
 * @api {post} /user/refresh Refresh JWT Token
 * @apiName UserRefreshToken
 * @apiGroup User
 *
 * @apiDescription
 * Refresh the JWT token of the User making the request. Requires authentication.
 *
 * @apiHeader  {String}     Authorization   Bearer [JWT_TOKEN]
 *
 * @apiSuccess {String}     token           A new JWT token with which
 *                                          to send authenticated requests.
 */
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
