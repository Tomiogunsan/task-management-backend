const express = require('express');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const getRole = require('../utils/getRole');

const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProject)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(getRole('admin'), projectController.updateProject)
  .delete(getRole('admin'), projectController.deleteProject);

router
  .route('/:id/task')
  .get(taskController.getAllTask)
  .post(getRole('admin'), taskController.createTask);

router
  .route('/:id/task/:taskId')
  .get(taskController.getTask)
  .patch(getRole('admin'), taskController.updateTask)
  .delete(getRole('admin'), taskController.deleteTask);

router
  .route('/:id/task/:taskId/assign')
  .patch(getRole('admin'), taskController.assignUsersToTask);

router.route('/:id/task/:taskId/status').patch(taskController.updateTaskStatus);

module.exports = router;
