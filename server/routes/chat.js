const user = require('../models/user');

module.exports = function(io){
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var Message = require('../models/message');
    var User = require('../models/user');
    var Chat = require ('../models/chat');
    var cookie = require('cookie');
    var jwt = require('jsonwebtoken');
    var connectedUsers = {}

    io.on('connection', (socket) => {
        let hope = cookie.parse(socket.handshake.headers.cookie);
        jwt.verify(hope['jwt'], 'secret', function(err, decoded){
            connectedUsers[decoded.id] = socket;
        });
        socket.on('message', (data) => {
            socket.emit('chat', data.message);
            if (connectedUsers[data.id]){
                connectedUsers[data.id].emit('chat', data.message);
            }
        });
    });

    router.post('/', function(req, res, next){
        passport.authenticate('jwt', {session: false}, function(err, user, info){
            Chat.find({participants: {$all: [user.id, req.body.friend], $size: 2} } )
            .exec(function(err, chats){
                let ret = [];
                for(let i = 0; i < chats.length; i++){
                    console.log(chats[0]);
                    ret = chats[0].messages;
                }
                res.send(ret);
            });
        })(req, res, next);
    });
    
    return router;
}