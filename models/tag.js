var mongoose = require('mongoose');
var TagSchema = new mongoose.Schema({
    tag: String,
    comment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
});
module.exports = mongoose.model('Tag', TagSchema);
