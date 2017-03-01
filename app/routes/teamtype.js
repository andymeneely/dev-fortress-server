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
router.put(
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

module.exports = router;
