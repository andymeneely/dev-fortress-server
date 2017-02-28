const teamtypeController = require('../controllers/teamtype');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

router.get('/', teamtypeController.getTeamTypes);
router.get('/:id', teamtypeController.getTeamTypeById);
router.post(
  '/',
  authenticationMiddleware.validateAuthenticationAttachUser,
  authenticationMiddleware.verifyProfessor,
  teamtypeController.createTeamType
);

module.exports = router;
