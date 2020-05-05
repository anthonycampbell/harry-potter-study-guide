var express = require('express');
var router = express.Router();
var subject_controller = require('../controllers/subjectController');

router.get('/', subject_controller.index);

module.exports = router;