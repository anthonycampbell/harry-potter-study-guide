var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');
var passport = require('passport');

/* GET home page. */
router.post('/register', user_controller.register);
router.post('/login', user_controller.login);
router.post('/logout', passport.authenticate('jwt', {session: false}), user_controller.logout);
router.get('/friends', user_controller.friends_get);
router.post('/friends', user_controller.friends_post);
//router.get('/verify', user_controller.verify);


module.exports = router;
