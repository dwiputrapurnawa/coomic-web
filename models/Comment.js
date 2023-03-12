const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true,
    },
    commentSection: {
        type: String,
        enum: ["comic", "chapter"]
    },
    parentId: String,
}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
    commentSchema,
    Comment,
}