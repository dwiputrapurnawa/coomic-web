const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
    numberOfChapter: Number,
    pages: [],
}, {timestamps: true});

const comicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    titlePath: String,
    thumbnail: String,
    synopsis: {
        type: String,
    },
    author: String,
    chapters: [chapterSchema],
    genres: [String],
    rating: {
        type: Number,
        min: 1,
        max: 6
    },
    status: {
        type: String,
        enum: ["Ongoing, Complete", "Hiatus", "Dropped", "Coming Soon"]
    },
    type: {
        type: String,
        enum: ["Manga", "Manhwa", "Manhua"]
    }
}, {timestamps: true});

const Comic = mongoose.model("Comic", comicSchema);

module.exports = {
    comicSchema,
    Comic,
};