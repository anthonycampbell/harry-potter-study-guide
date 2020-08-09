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
    var async = require('async');
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
            async.series([
                function(cb){
                    Chat.find({participants: {$all: [user.id, req.body.friend], $size: 2} } )
                    .exec(function(err, chats){
                        cb(null, chats);
                    });
                },
                function(cb){
                    User.findById(req.body.friend).exec(function(err, friend){
                        cb(null, friend);
                    })
                }
            ], function(err, results){
                if (results[0].length === 0){
                    const newChat = new Chat();
                    newChat.participants.push(user.id);
                    newChat.participants.push(req.body.friend);
                    newChat.save();
                    console.log(newChat);
                } else {
                    res.send(results[0].messages);
                }
            }); 
        })(req, res, next);
    });
    
    return router;
}