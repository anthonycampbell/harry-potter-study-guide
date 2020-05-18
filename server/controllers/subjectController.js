const validator = require('express-validator');
var Subject = require('../models/subject.js');
var Entry = require('../models/Entry');
var async = require('async');

exports.index = function(req, res, next){
    Subject.find({}).exec(function(err, results){
        if (err){
            next(err);
        }
        //res.render('index', {title: 'Home', subjects: results});
        res.json({title: 'Home', subjects: results});
    });
}

exports.subject_create = function(req, res, next){
    res.json({subject: "create"});
}

exports.subject_detail_get = function(req, res, next){
    async.parallel({
        subject: function(callback){
            Subject.findById(req.params.id).exec(callback);
        },
        entries: function(callback){
            Entry.find({'subject': req.params.id}).exec(callback);
        }
    }, function(err, results){
        if (err){
            next(err);
        }
        res.json({title: results.subject.title, subject: results.subject, entries: results.entries});
        //res.render('subject_detail', {title: results.subject.title, subject: results.subject, entries: results.entries});
    });
}

exports.subject_detail_post = function (req, res, next) {
    res.json({subject: "detail post"});
    /*validator.body('name', 'name required').trim().isLength({min: 1}),
    validator.sanitize('name').escape(),
    (req, res, next) => {
        const errors = validator.validationResult(req)
        var entry = new Entry({
            
        })
    }*/
}