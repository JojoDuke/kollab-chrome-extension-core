const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    comment_text: {
        type: String,
        required: true,
    },
    comment_time: {
        type: String,
        required: true,
    },
    comment_resolved: {
        type: Boolean,
        required: false,
    }
});

const CommentsModel = mongoose.model("comments", CommentsSchema);
module.exports = CommentsModel;