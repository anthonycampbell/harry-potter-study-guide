var express = require('express');
var router = express.Router();
var subject_controller = require('../controllers/subjectController');

router.get('/', subject_controller.index);
router.post('/', subject_controller.subject_create);
router.get('/subject/:id', subject_controller.subject_detail_get);
router.post('/subject/:id', subject_controller.subject_detail_post);

module.exports = router;