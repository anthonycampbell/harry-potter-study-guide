var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SubjectSchema = new Schema({
    title: {type: String, required: true},
    fields: [{type: String, required: true}],
    entries: [{type: Schema.Types.ObjectId, ref: 'Entry'}],
    color: {type: String}
});

module.exports = mongoose.model('Subject', SubjectSchema);