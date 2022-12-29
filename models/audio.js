var mongoose = require('mongoose');
var AudioSchema = new mongoose.Schema({
   
    name : String,
    path : String,
    id   : String,
    userid: String,
    comments: [{
        title : String,
        timestampMinutes: String,
        timestampSeconds: String,
        content: String
    }]

   
});
module.exports = mongoose.model('Audio', AudioSchema);
