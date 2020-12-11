var express = require('express');
var router = express.Router();
var subject_controller = require('../controllers/subjectController');
var passport = require('passport');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');

module.exports = function(wssShare, backend){
    var shareCon = backend.connect();
    var doc = shareCon.get('subjects', 'newTables');
    doc.fetch(function(err) {
        if (err) throw err;
        if (doc.type === null) {
            doc.create({ tables: [{ title: null, fields: []}]});
        }
    });
    wssShare.on('connection', function(ws) {
        var stream = new WebSocketJSONStream(ws);
        backend.listen(stream);
    });
    router.get('/', subject_controller.index);
    router.post('/', subject_controller.subject_create);
    router.get('/subject/:id', subject_controller.subject_detail_get);
    router.post('/subject/:id', subject_controller.subject_detail_post);
    return router;
} 



