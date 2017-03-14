const teamtypeController = require('../controllers/teamtype');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

router.get(
  '/',
  authenticationMiddleware.validateAuthentication,
  teamtypeController.getTeamTypes
);
router.get(
  '/:id',
  authenticationMiddleware.validateAuthentication,
  teamtypeController.getTeamTypeById
);
router.patch(
  '/:id',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationMiddleware.verifyProfessor,
  teamtypeController.updateExistingTeamType
);
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationMiddleware.verifyProfessor,
  teamtypeController.createTeamType
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
