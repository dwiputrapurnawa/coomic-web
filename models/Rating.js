const mongoose = require("mongoose");


const ratingSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    userEmail: String,
    comicId: String,
}, {timestamp: true})

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = {
    ratingSchema,
    Rating,
}