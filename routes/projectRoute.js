const express = require('express');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const authenticatedUser = require('../utils/authenticatedUser');
const authorizedRole = require('../utils/authorizedRole');

const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProject)
  .post(authenticatedUser, authorizedRole, projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(authenticatedUser, authorizedRole, projectController.updateProject)
  .delete(authenticatedUser, authorizedRole, projectController.deleteProject);

router
  .route('/:id/task')
  .get(taskController.getAllTask)
  .post(authenticatedUser, authorizedRole, taskController.createTask);

router
  .route('/:id/task/:taskId')
  .get(taskController.getTask)
  .patch(authenticatedUser, authorizedRole, taskController.updateTask)
  .delete(authenticatedUser, authorizedRole, taskController.deleteTask);

router
  .route('/:id/task/:taskId/assign')
  .patch(authenticatedUser, authorizedRole, taskController.assignUsersToTask);

router.route('/:id/task/:taskId/status').patch(taskController.updateTaskStatus);

module.exports = router;
