const SubmittedChallenge = require('../models/submittedChallenge');

class SubmittedChallengeRepository {
    async submitChallenge(submissionData) {
        const submission = new SubmittedChallenge(submissionData);
        return await submission.save();
    }

    async findByChallenge(challengeId) {
        return await SubmittedChallenge.find({ challenge: challengeId }).populate('submittedBy');
    }
    
    async findByUser(userId) {
        return await SubmittedChallenge.find({ submittedBy: userId }).populate('submittedBy');
    }
    
    async findSubmittedData(userId) {
        return await SubmittedChallenge.findOne({ submittedBy: userId }).populate('submittedBy');
    }

    async deleteSubmittedData(id) {
        return await SubmittedChallenge.deleteOne({ _id: id })
    }

    async updateRating(submittedChallengeId, rating) {
        const submission = await SubmittedChallenge.findById(submittedChallengeId);
        submission.rating.push(rating);
        return await submission.save();
    }
    
    async updateSolution(submittedChallengeId, data) {
        return await SubmittedChallenge.updateOne({ _id: submittedChallengeId}, {
          name: data.name || data.challengeName,
          link: data.link,
          description: data.description
        });
    }
}

module.exports = new SubmittedChallengeRepository();
