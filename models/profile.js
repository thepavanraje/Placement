const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    contact: String
});

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;