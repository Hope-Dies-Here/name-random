const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    experiencePoint: { type: Number, default: 0 },
    githubLink: { type: String },
    bio: { type: String },
    timeStamp: { type: Number, required: true }
});

module.exports = mongoose.model('Approval', userSchema);
