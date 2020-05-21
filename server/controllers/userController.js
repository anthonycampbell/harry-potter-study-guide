const validator = require('express-validator');
const bcrypt = require('bcryptjs');
var User = require('../models/user');


exports.register = [
    //validate 
    validator.body('username', 'username must be between 6 and 30 characters')
        .trim()
        .isLength({min:1, max:30}),
    validator.body('email')
        .trim()
        .isLength({min:1})
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be valid'),
    validator.body('password', 'password must be between 6 and 30 characters')
        .trim()
        .isLength({min:1, max:30}),
    
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