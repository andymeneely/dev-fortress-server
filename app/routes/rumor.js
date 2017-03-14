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
