var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

/* GET home page. */
router.post('/register', user_controller.register);

module.exports = router;
