import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    uuid: {
        type: String,
        required: true,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ]
});

module.exports = mongoose.model('File', FileSchema);