const mongoose = require("mongoose");

const {commentSchema} = require("./Comment");
const {chapterSchema} = require("./Chapter");
const {ratingSchema} = require("./Rating");

const comicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    titlePath: String,
    thumbnail: String,
    synopsis: String,
    author: String,
    chapters: [chapterSchema],
    genres: [String],
    rating: [ratingSchema],
    status: {
        type: String,
        enum: ["Ongoing", "Complete", "Hiatus", "Dropped", "Coming Soon"]
    },
    type: {
        type: String,
        enum: ["Manga", "Manhwa", "Manhua"]
    },
    comments: [commentSchema]
}, {timestamps: true});

const Comic = mongoose.model("Comic", comicSchema);

module.exports = {
    comicSchema,
    Comic,
};