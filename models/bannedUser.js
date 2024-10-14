const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    reason: { type: String }
});

module.exports = mongoose.model('BannedUser', userSchema);