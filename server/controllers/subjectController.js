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

exports.subject_detail = function(req, res, next){
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
        console.log(results.entries);
        res.render('subject_detail', {title: results.subject.title, subject: results.subject, entries: results.entries});
    });
}

