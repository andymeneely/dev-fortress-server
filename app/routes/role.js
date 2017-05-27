const roleController = require('../controllers/role');
const express = require('express');

const router = express.Router();

/**
 * @api {get} /role Get Roles
 * @apiName GetRoles
 * @apiGroup Role
 *
 * @apiDescription
 * Retrieve all user Roles.
 *
 * @apiSuccess {Object[]}   roles       List of Roles.
 * @apiSuccess {Number}     roles.id    Primary key.
 * @apiSuccess {String}     roles.name  Name of the role; Unique.
 */
router.get('/', roleController.getRoles);

/**
 * @api {get} /role/:id/users Get Users by Role
 * @apiName GetRoleUsers
 * @apiGroup Role
 *
 * @apiDescription
 * Retrieve all Users in a given Role
 *
 * @apiParam   {Number}     id          The ID of the Role to filter by.
 *
 * @apiSuccess {Object[]}   users             List of Users.
 * @apiSuccess {Number}     users.id          Primary key.
 * @apiSuccess {String}     users.username    Username; unique.
 * @apiSuccess {Boolean}    users.is_admin    Indicates whether or not the User is an Administrator.
 * @apiSuccess {String}     users.created_at  ISO String timestamp of when the User was created.
 */
router.get('/:id/users', roleController.getRoleUsers);

/**
 * @api {post} /role Create a Role
 * @apiName CreateRole
 * @apiGroup Role
 *
 * @apiDescription
 * Create a new user Role.
 *
 * @apiParam   {String}     name  Name of the new role.
 *
 * @apiSuccess {Number}     id    Primary key.
 * @apiSuccess {String}     name  Name of the role; Unique.
 */
router.post('/', roleController.createRole);

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
