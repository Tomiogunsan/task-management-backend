const express = require('express');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');

const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProject)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router
  .route('/:id/task')
  .get(taskController.getAllTask)
  .post(taskController.createTask);

router
  .route('/:id/task/:taskId')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

router
  .route('/:id/task/:taskId/assign')
  .patch(taskController.assignUsersToTask);

module.exports = router;
