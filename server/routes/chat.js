module.exports = function(io){
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var Message = require('../models/message');
    var User = require('../models/user');
    var Chat = require ('../models/chat');

    io.on('connection', (socket) => {
        console.log('user connected to messages');
        socket.emit('chat', { chat: 'route' });
        socket.on('chat message', (data) => {
            console.log(data);
        });
    });

    router.get('/', function(req, res){
        res.send('messages');
    });
    
    return router;
}