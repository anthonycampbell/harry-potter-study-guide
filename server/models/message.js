var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    writer: {type: Schema.Types.ObjectId, ref:'User', required: true},
    data: {type: String, required: true},
    date: {type: String, default: Date.now},
});

module.exports = mongoose.model('Message', messageSchema);