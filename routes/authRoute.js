const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
/**
 * @openapi
 * /auth:
 *   post:
 *     tag:
 *         -Signup
 *          -login
 *          -logout
 *     responses:
 *       200:
 *         description: Success
 */

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logOut', authController.logOut);

module.exports = router;
