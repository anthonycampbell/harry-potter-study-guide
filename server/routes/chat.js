const user = require('../models/user');
const chat = require('../models/chat');
const message = require('../models/message');

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

    io.on('connection', (socket) => {
        socket.on('newChat', (friend) => {
            let hope = cookie.parse(socket.handshake.headers.cookie);
            jwt.verify(hope['jwt'], 'secret', function(err, decoded){
                console.log(friend);
                console.log(decoded.id);
                async.series([
                    function(cb) {
                        Chat.findOne({participants: {$all: [decoded.id, friend], $size: 2} })
                        .exec(function(err, chat){
                            if (!chat) {
                                let newChat = new Chat;
                                newChat.participants.push(decoded.id);
                                newChat.participants.push(friend);
                                console.log('newchat', newChat);
                                newChat.save((err, chat) => { 
                                    socket.join(chat.id);
                                    cb(null, chat);
                                } );
                                return
                            } else {
                                socket.join(chat.id);
                                cb(null, chat);
                            }
                        });
                    }], (err, results) => {
                        console.log(results);
                        socket.emit('chat', {id: results[0].id, messages: results[0].messages})
                    });
            });
        });
        socket.on('message', (data) => {
            io.to(data.chat).emit('newMessage', data.message);
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