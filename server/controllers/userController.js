const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var User = require('../models/user');
var UserFriendship = require('../models/userFriendship');
var passport = require('passport');
var async = require('async');

exports.register = [
    //validate 
    validator.body('username', 'username must be between 4 and 30 characters')
        .trim()
        .isLength({min:4, max:30}),
    validator.body('email')
        .trim()
        .isLength({min:1})
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be valid'),
    validator.body('password', 'password must be between 4 and 30 characters')
        .trim()
        .isLength({min:4, max:30}),
    
    //sanitize
    validator.sanitizeBody('*').escape(),
    validator.sanitizeBody('email').normalizeEmail(),

    //process request
    (req, res, next) => {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json(errors);
        }
        User.findOne({email: req.body.email}).exec( (err, found_email) => {
            if (err) {
                return next(err);
            }
            if (found_email) {
                return res.status(400).json({ email: 'Email already exists.'});
            }
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err){
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        });
    }
]

exports.login = [
    //validate
    validator.body('email')
        .trim()
        .isLength({min:1})
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be valid'),
    validator.body('password', 'password must be between 4 and 30 characters')
        .trim()
        .isLength({min:4, max:30}),
    //sanitize
    validator.sanitizeBody('*').escape(),
    validator.sanitizeBody('email').normalizeEmail(),
    //process request
    (req, res, next) => {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json(errors);
        }
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({email}).exec( (err, user) => {
            if (err){
                next(err);
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch){
                    const payload = {id: user.id};
                    jwt.sign(payload,
                            'secret', 
                            { expiresIn: 31556926 }, // a year
                            (err, token) => {
                                if (err) {
                                    console.log(err);
                                }
                                res.cookie('jwt', token, {httpOnly: true});
                                res.json({success: true, 'jwt': token});
                            });
                } else {
                    return res.status(400).json({passwordIncorrect: "Password incorrect"})
                }
            });
        })
    }
]

exports.logout = function(req, res, next){
    res.clearCookie('jwt', {httpOnly: true});
    res.send('cookie cleared');
}

exports.friends_get = function(req, res, next){
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        let friends = [];
        if (err) { return next(err) }
        if (!user) { return res.send({status: 'Logged out'}) }
        async.map(user.friends, function(friend, done){
            User.findById( friend ).exec(done);
        }, function (err, results){
            for (let i = 0; i < results.length; i++){
                friends.push(results[i].username);
            }
            res.json({friends: friends});
        }); 
    })(req, res, next);
} 

exports.friends_post = function(req, res, next){
    //validate
    //sanitize
    //process
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        if (err) { return next(err) }
        if (!user) { return res.send({status: 'Logged out'}) }
        User.findOne({ email: req.body.friend}).exec(function(err, friend){
            console.log(friend.id)
            if (err){return next(err)}
            if (!friend) { return res.send('they dont exist')} 
            if (user.friends.includes( req.body.friend )){
                return res.send('You already added this friend');
            }
            User.findByIdAndUpdate(user.id, 
                                   {$push: {friends: friend.id}}, 
                                   function(err, con){
                                       if(err){ return next(err) } 
                                       res.send('friend added');
                                   });
            
        });
    })(req, res, next);
}

exports.send_friend_request = function(req, res, next){
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        if (err) { return next(err) }
        if (!user) { return res.send({status: 'Logged out'}) }
        User.findOne({ email: req.body.friend }).exec(function(err, friend){
            console.log(friend);
            if (err){return next(err)}
            if (!friend){return res.send('they dont exist')}
            var friendRequest = new UserFriendship({ requester: user.id,
                                                     recipient: friend.id,
                                                     status: 1 }); // 1 means request made
            friendRequest.save(function(err){
                if(err){ return next(err)}
                console.log('request saved');
                res.send('request sent ');
            });
        });
    })(req, res, next);
}

exports.get_friend_requests = function(req, res, next){
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        let requests = []
        if (err) { return next(err) } 
        if (!user) { return res.send({status: 'Logged out'}) }
        UserFriendship.find({ recipient: user.id }).exec(function(err, results){
            if (err) {return next(err)}
            if (!results) { console.log('no requests') }
            async.map(results, function(item, done) {
                User.findById(item.requester).exec(done)
            }, function (err, things){
                for (let i = 0; i < things.length; i++){
                    requests.push(things[i].username);
                }
                res.json({requests: requests});
            });
        });
    })(req, res, next);
}

/*exports.verify = function(req, res, next){
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        if(err){ return next(err); }
        if (!user){ return res.send({'isLoggedIn': false}); }
        req.login(user, {session: false},  function(err){
            if (err){ return next(err); }
            return res.json({'isLoggedIn': true});
        });
    })(req, res, next); 
}*/