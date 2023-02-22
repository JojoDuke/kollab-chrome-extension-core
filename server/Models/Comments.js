const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    comment_text: {
        type: String,
        required: true,
    }
});

const CommentsModel = mongoose.model("comments", CommentsSchema);
module.exports = CommentsModel;