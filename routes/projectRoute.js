const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProject)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject);

module.exports = router;
