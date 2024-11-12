const express = require('express');

const router = express.Router();
const taskController = require('../controllers/taskController');
const getRole = require('../utils/getRole');

router.route('/').post(getRole('admin'), taskController.createTask);
// router.route('/:id/status').patch(taskController.updateTaskStatus);

module.exports = router;
