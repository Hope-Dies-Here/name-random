const submittedChallengeRepository = require("../repositories/submittedChallengeRepository")

module.exports = async (req, res, next) => {
  const submittedChallenge = await submittedChallengeRepository.findSubmittedData(req.params.id)
  if(submittedChallenge.submittedBy._id != req.session.userId) {
      req.flash('error', 'No data found!')
      return res.redirect('/challenges')
  } else {
    return next()
  }
}