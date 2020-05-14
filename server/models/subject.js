var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SubjectSchema = new Schema({
    title: {type: String, required: true},
    fields: [{type: String, required: true}]
});

SubjectSchema.virtual('url').get(function(){
    return '/harry_potter_study_guide/subject/'+this._id;
});

module.exports = mongoose.model('Subject', SubjectSchema);