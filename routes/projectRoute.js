const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.route('/').post(projectController.create);

module.exports = router;
