const SubmittedChallenge = require("../models/submittedChallenge");

class SubmittedChallengeRepository {
  async submitChallenge(submissionData) {
    const submission = new SubmittedChallenge(submissionData);
    return await submission.save();
  }

  async findByChallenge(challengeId) {
    return await SubmittedChallenge.find({ challenge: challengeId }).populate(
      "submittedBy challenge"
    );
  }

  async findByUser(userId) {
    return await SubmittedChallenge.find({ submittedBy: userId }).populate("challenge submittedBy");
  }
  
  async findByUserAndChallenge(userId, challengeId) {
    return await SubmittedChallenge.find({ submittedBy: userId, challenge: challengeId }).populate("challenge submittedBy");
  }

  async findSubmittedData(id) {
    return await SubmittedChallenge.findOne({ _id: id })
      .populate("submittedBy")
      .populate("challenge");
  }
  
  async findById(id) {
    return await SubmittedChallenge.findOne({ _id: id });
  }

  async deleteSubmittedData(id) {
    return await SubmittedChallenge.deleteOne({ _id: id });
  }

  async deleteByChallengeId(id) {
    return await SubmittedChallenge.deleteMany({ challenge: id });
  }

  async deleteByUserId(id) {
    return await SubmittedChallenge.deleteMany({ submittedBy: id });
  }

  async updateRating(submittedChallengeId, rating) {
    const submission = await SubmittedChallenge.findById(submittedChallengeId);
    submission.rating.push(rating);
    return await submission.save();
  }

  async updateSolution(submittedChallengeId, data) {
    return await SubmittedChallenge.updateOne(
      { _id: submittedChallengeId },
      {
        name: data.name || data.challengeName,
        link: data.link,
        description: data.description
      }
    );
  }

  // Method to find a submitted challenge by challenge ID
  async findByChallengeId(challengeId) {
    return await SubmittedChallenge.findOne({ challenge: challengeId });
  }

  // Method to update a submitted challenge
  async update(id, updatedData) {
    return await SubmittedChallenge.findByIdAndUpdate(id, updatedData, {
      new: true
    });
  }
}

module.exports = new SubmittedChallengeRepository();
