const express = require('express');

const messageController = require('../controllers/messageController');

const router = express.Router();

router
  .route('')
  .get(messageController.getTeamMessages)
  .post(messageController.createMessage);

module.exports = router;
