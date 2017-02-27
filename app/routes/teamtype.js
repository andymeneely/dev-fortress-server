const teamtypeController = require('../controllers/teamtype');
const express = require('express');

const router = express.Router();

router.get('/', teamtypeController.getTeamTypes);
router.post('/', teamtypeController.createTeamType);

module.exports = router;
