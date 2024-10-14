const Challenge = require('../models/challenge');

class ChallengeRepository {
    async getAllChallenges() {
        return await Challenge.find().sort({ _id: -1});
    }

    async findByName(name) {
        return await Challenge.findOne({ name });
    }
    
    async findById(id) {
        return await Challenge.findOne({ _id: id });
    }
    
    async findByStatus(status) {
        return await Challenge.find({ status });
    }

    async deleteChallenge(name) {
        return await Challenge.deleteOne({ name });
    }

    async updateChallenge(id, data) {
      try {
        const { 
          name,
          level,
          status,
          expPointReward,
          instructions,
          description,
          language,
          deadline
        } = data
        
        return await Challenge.updateOne({ _id: id }, {
          name: name.trim(),
          level: level,
          status: status,
          expPointReward: expPointReward,
          instructions: instructions,
          descriptipn: description,
          language: language,
          deadline: deadline,
        }, { new: true })
      } catch (e) {
        console.log(e)
      }
    }

    async createChallenge(challengeData) {
        const challenge = new Challenge(challengeData);
        return await challenge.save();
    }
}

module.exports = new ChallengeRepository();
