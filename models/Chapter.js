const mongoose = require("mongoose");
const {commentSchema} = require("./Comment");

const chapterSchema = new mongoose.Schema({
    number: Number,
    chapterPath: String,
    pages: [String],
    comments: [commentSchema]
}, {timestamps: true});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = {
    chapterSchema,
    Chapter,
}

