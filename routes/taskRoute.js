const express = require('express');

const router = express.Router();
const taskController = require('../controllers/taskController');

router.route('/').post(taskController.createTask);
router.route('/:id/status').patch(taskController.updateTaskStatus);

module.exports = router;
