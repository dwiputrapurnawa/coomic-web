const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
    userEmail: String,
    reaction: {
        type: String,
        enum: ["Upvote", "Funny", "Love", "Suprised", "Angry", "Sad"]
    }
}, {timestamps: true})

module.exports = {
    reactionSchema,
}