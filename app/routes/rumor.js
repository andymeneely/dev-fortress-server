const rumorControlller = require('../controllers/rumor');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

router.use(
  authenticationMiddleware.validateAuthenticationAttachUser
);

router.get(
  '/',
  rumorControlller.getRumors
);
router.post(
  '/',
  authenticationMiddleware.verifyProfessor,
  rumorControlller.createRumor
);
router.get(
  '/:id',
  rumorControlller.getRumorById
);
router.patch(
  '/:id',
  authenticationMiddleware.verifyProfessor,
  rumorControlller.updateExistingRumor
);

module.exports = router;
