module.exports = function(io){
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var Message = require('../models/message');
    var User = require('../models/user');
    var Chat = require ('../models/chat');

    io.on('connection', (socket) => {
        console.log('user connected to messages');
        //socket.emit('chat', { chat: 'route' });
        socket.on('message', (data) => {
            console.log('server' + data);
            socket.emit('chat', data);
        });
    });

    router.post('/', function(req, res, next){
        passport.authenticate('jwt', {session: false}, function(err, user, info){
            Chat.find({participants: {$all: [user.id, req.body.friend], $size: 2} } )
            .exec(function(err, chats){
                let ret = [];
                for(let i = 0; i< chats.length; i++){
                    console.log(chats[0]);
                    ret = chats[0].messages;
                }
                res.send(ret);
            });
        })(req, res, next);
    });
    
    return router;
}