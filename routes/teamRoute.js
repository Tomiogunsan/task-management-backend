const express = require('express');
const teamController = require('../controllers/teamController');
const authenticatedUser = require('../utils/authenticatedUser');
const authorizedRole = require('../utils/authorizedRole');

const router = express.Router();

router
  .route('/')
  .get(teamController.getAllTeam)
  .post(authenticatedUser, authorizedRole, teamController.createTeam);

router
  .route('/:id/member')
  .get(teamController.getAllTeamMembers)
  .patch(authenticatedUser, authorizedRole, teamController.addMembers);
router
  .route('/:id/assign-project')
  .patch(authenticatedUser, authorizedRole, teamController.assignProject);
router.route('/:id/member/:memberId').get(teamController.getTeamMemberDetails);

module.exports = router;

// 66f292af1d3d27a8740760a9 : teamId
// 66f2902bd9102193c4008df6 : memberId
// 66f29070d9102193c4008dfa : memberId
// 66febe0fd6eee3004a7d1755
