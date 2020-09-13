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
    var chats = {}
    var ids = {}

    io.on('connection', (socket) => {
        socket.on('newChat', (friend) => {
            let hope = cookie.parse(socket.handshake.headers.cookie);
            jwt.verify(hope['jwt'], 'secret', function(err, decoded){
                async.series([
                    function(cb) {
                        Chat.findOne({ $or: [{participants: [decoded.id, friend]}, {participants: [friend, decoded.id]}] })
                        .exec(function(err, chat){
                            if (!chat) {
                                let newChat = new Chat;
                                newChat.participants.push(decoded.id);
                                newChat.participants.push(friend);
                                newChat.save((err, chat) => {
                                    socket.join(chat.id);
                                    cb(null, chat);
                                });
                                return;
                            } else {
                                socket.join(chat.id);
                                cb(null, chat);
                                return;
                            }
                        });
                    }], (err, results) => {
                        socket.emit('chat', {id: results[0].id, messages: results[0].messages})
                });
            });
        });
        socket.on('message', (data) => {
            let hope = cookie.parse(socket.handshake.headers.cookie);
            jwt.verify(hope['jwt'], 'secret', function(err, decoded){
                async.waterfall([
                    function(cb){
                        let newMessage = new Message;
                        newMessage.writer = decoded.id;
                        newMessage.data = data.message;
                        newMessage.save();
                        cb(null, newMessage.id);
                    },
                    function(newMessage, cb){
                        Chat.findByIdAndUpdate(data.chat, {$push: {messages: newMessage} }, (err) => {
                            if (err){
                                console.log(err);
                                return;
                            }
                            cb(null);
                        });
                    }], (err, result) => {
                        io.to(data.chat).emit('newMessage', data.message);
                    });
            });
        });
    });

    router.post('/', function(req, res, next){
        res.send('nothing');
        /*passport.authenticate('jwt', {session: false}, function(err, user, info){
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
        })(req, res, next);*/
    });
    
    return router;
}