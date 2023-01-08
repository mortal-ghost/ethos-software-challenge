var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
    title : String,
    timestampMinutes: String,
    timestampSeconds: String,
    content: String,
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
});
module.exports = mongoose.model('Comment', CommentSchema);
