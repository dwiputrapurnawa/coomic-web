const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ["Admin", "Super Admin"]
    },
}, {timestamps: true});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;