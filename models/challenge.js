const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    name: { type: String, required: true, set: value => value.trim()},
    level: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    status: { type: String, enum: ['open', 'pending', 'closed'], required: true },
    expPointReward: { type: Number, required: true },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    language: { type: String },
    deadline: { type: Date }
});

module.exports = mongoose.model('Challenge', challengeSchema);
