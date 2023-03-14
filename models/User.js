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
    bookmark: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comic'}],
    role: {
        type: String,
        enum: ["User"]
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;