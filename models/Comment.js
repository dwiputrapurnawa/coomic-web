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
}, {timestamps: true});

commentSchema.add({
    reply: [commentSchema]
});

module.exports = {
    commentSchema,
}