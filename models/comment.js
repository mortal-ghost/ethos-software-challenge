const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    type: {
        type: Boolean,
        required: true 
    },
    content: {
        type: String,
        required: true
    },
});