const roleController = require('../controllers/role');
const express = require('express');

const router = express.Router();

// GET a person
router.get('/', roleController.getRoles);
router.post('/', roleController.createRole);
router.get('/:id/users', roleController.getRoleUsers);

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
