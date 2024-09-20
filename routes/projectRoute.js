const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProject)
  .post(projectController.createProject);

module.exports = router;
