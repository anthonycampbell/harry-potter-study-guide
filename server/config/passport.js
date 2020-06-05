var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        User.findOne({id: jwt_payload.id}, function (err, user) {
            if (err){
                return done(err, false);
            }
            if (user){
                return done(null, user)
            }
            //user doesnt exist
            return done(null, false);
        });
    }));
};