const submittedChallengeRepository = require('../repositories/submittedChallengeRepository');
const challengeRepository = require('../repositories/challengeRepository');

exports.getSubmitChallenge = async (req, res) => {
    try {
        const availableChallenges = await challengeRepository.findByStatus('open');
        res.status(201).render('submit', { userId: req.session.userId, challenges: availableChallenges});
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

exports.submitChallenge = async (req, res) => {
    try {
          const dataExist = await submittedChallengeRepository.findByUser(req.session.userId)
          if(dataExist && dataExist.length > 0) {
            console.log(dataExist)
            req.flash('error', `Don't submit twice!!`)
            return res.redirect('/submit')
          }
        
        const bodyData = {
            challenge: req.body.challengeId,
            submittedBy: req.session.userId,
            link: req.body.link,
            description: req.body.description,
            name: req.body.name || req.body.challengeName,
        }
       
        const submission = await submittedChallengeRepository.submitChallenge(bodyData);
        
        res.status(201).redirect(`/challenges/${req.body.challengeName}`);
    } catch (err) {
      console.log(err)
        res.status(500).send({"Err": "Server Error, Try Again Latter"});
    }
};

exports.getUpdateChallenge = async (req, res) => {
    try {
        const challenge = await challengeRepository.findById(req.params.id);
        const submittedChallenge = await submittedChallengeRepository.findSubmittedData(req.session.userId)
        
          
        if(!submittedChallenge) {
          req.flash('error', 'No data found!')
          return res.redirect('/challenges')
        }
        
        res.status(201).render('updateSubmittedData', { userId: req.session.userId, challenge, data: submittedChallenge || [] });
    } catch (err) {
      console.log(err)
        res.status(500).send({"Err": "Server Error, Try Again Latter"});
    }
};

exports.updateChallenge = async (req, res) => {
    try {
        const updatedData = await submittedChallengeRepository.updateSolution(req.params.id, req.body)
        
          console.log(updatedData)
        if(!updatedData) {
          req.flash('error', 'Try Again!')
          return res.redirect('/challenges')
        }
        
        req.flash('success', 'Updated!')
        res.status(201).redirect(`/challenges/${req.body.challengeName}`);
    } catch (err) {
      console.log(err)
        res.status(500).send({"Err": "Server Error, Try Again Latter"});
    }
};

exports.deleteChallenge = async (req, res) => {
    try {
        const deletedData = await submittedChallengeRepository.deleteSubmittedData(req.params.id)
        
        if(!deletedData) {
          req.flash('error', 'Try Again!')
          return res.redirect('/challenges')
        }
        
        req.flash('success', 'Deleted!')
        res.status(201).redirect(`/challenges`);
    } catch (err) {
      console.log(err)
        res.status(500).send({"Err": "Server Error, Try Again Latter"});
    }
};

exports.rateChallenge = async (req, res) => {
    try {
        await submittedChallengeRepository.updateRating(req.body.submittedChallengeId, {
            userId: req.user._id,
            value: req.body.rating,
        });
        res.status(200).json({ message: 'Rating added successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
};
