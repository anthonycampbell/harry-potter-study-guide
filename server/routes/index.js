var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/harry_potter_study_guide');
});

module.exports = router;
