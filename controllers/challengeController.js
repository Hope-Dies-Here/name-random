const challengeRepository = require("../repositories/challengeRepository");
const submittedChallengeRepository = require("../repositories/submittedChallengeRepository");

exports.home = async (req, res) => {
  try {
    const challenges = await challengeRepository.getAllChallenges();
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
    function timeAgo(pastDate) {
      const now = Date.now();
      const diffInMs = now - pastDate;
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);

      if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else {
        return `${diffInWeeks} weeks ago`;
      }
    }
    
    function daysLeft(deadline) {
    const now = Date.now();
    const deadlineTime = new Date(deadline).getTime();
    const diffInMs = deadlineTime - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert ms to days

    if (diffInDays > 0) {
        return `${diffInDays} days left`;
    } else if (diffInDays === 0) {
        return `Deadline is today`;
    } else {
        return `${Math.abs(diffInDays)} days ago (passed)`;
    }
}

    const challenge = await challengeRepository.findByName(req.params.name);
    const submittedChallenges =
      await submittedChallengeRepository.findByChallenge(challenge._id);
    
    res.render("challenge", {
      userId: req.session.userId,
      challenge,
      submittedChallenges, timeAgo, daysLeft
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
