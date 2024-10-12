const challengeRepository = require('../repositories/challengeRepository');
const submittedChallengeRepository = require('../repositories/submittedChallengeRepository');

exports.home = async (req, res) => {
    try {
        const challenges = await challengeRepository.getAllChallenges()
        res.render("index", { userId: req.session.userId, challenges });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.listChallenges = async (req, res) => {
    try {
        const challenges = await challengeRepository.getAllChallenges();
        res.render("challenges", { userId: req.session.userId, challenges });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.viewChallenge = async (req, res) => {
    try {
        const challenge = await challengeRepository.findByName(req.params.name);
        console.log(challenge)
        const submittedChallenges = await submittedChallengeRepository.findByChallenge(challenge._id);
        res.render("challenge", { userId: req.session.userId, challenge, submittedChallenges });
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};
