const mongoose = require("mongoose");
const {commentSchema} = require("./Comment");
const {reactionSchema} = require("./Reaction");

const chapterSchema = new mongoose.Schema({
    comicTitle: String,
    number: Number,
    chapterPath: String,
    pages: [String],
    comments: [commentSchema],
    reactions: [reactionSchema]
}, {timestamps: true});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = {
    chapterSchema,
    Chapter,
}

