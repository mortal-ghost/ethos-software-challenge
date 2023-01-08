var mongoose = require('mongoose');
var AudioSchema = new mongoose.Schema({
    name : String,
    path : String,
    id   : String,
    userid: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
});
module.exports = mongoose.model('Audio', AudioSchema);
