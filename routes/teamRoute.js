const express = require('express');
const teamController = require('../controllers/teamController');
// const requiredRole = require('../utils/getRole')

const router = express.Router();

router.route('/').post(teamController.createTeam);

router.route('/:id/add-member').patch(teamController.addMembers);

module.exports = router;

// 66f292af1d3d27a8740760a9 : teamId
// 66f2902bd9102193c4008df6 : memberId
// 66f29070d9102193c4008dfa : memberId
