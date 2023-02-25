const mongoose = require("mongoose");
const {comicSchema} = require("./Comic");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    bookmark: [comicSchema],
    role: {
        type: String,
        enum: ["User"]
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;