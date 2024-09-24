const express = require('express');
const teamController = require('../controllers/teamController');
// const requiredRole = require('../utils/getRole')

const router = express.Router();

router.route('/').post(teamController.createTeam);

module.exports = router;
