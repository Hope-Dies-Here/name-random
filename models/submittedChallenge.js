const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submittedChallengeSchema = new Schema({
    name: { type: String },
    description: { type: String },
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ratings: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, rating: { type: Number } }],
    link: { type: String, required: true },
    uploadedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubmittedChallenge', submittedChallengeSchema);
