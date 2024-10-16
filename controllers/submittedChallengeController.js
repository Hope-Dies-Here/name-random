const submittedChallengeRepository = require('../repositories/submittedChallengeRepository');
const challengeRepository = require('../repositories/challengeRepository');
const { body, validationResult } = require('express-validator');
const _ = require("lodash")
exports.getSubmitChallenge = async (req, res) => {
    try {
        const availableChallenges = await challengeRepository.findByStatus('open');
        res.status(201).render('submit', { userId: req.session.userId, challenges: availableChallenges});
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
};

exports.submitChallenge = [
  // Add sanitizers and validators
  body('challengeId').trim().escape(),
  body('link').trim().isURL().withMessage('Invalid URL').escape(),
  body('description').trim().escape(),
  body('name').optional().trim().escape(),
  body('challengeName').optional().trim().escape(),
  
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', 'Validation failed. Please correct the inputs.');
        return res.redirect('/submit');
      }

      const dataExist = await submittedChallengeRepository.findByUserAndChallenge(req.session.userId, req.body.challengeId);

      if (dataExist && dataExist.length > 0) {
        req.flash('error', `Don't submit twice!!`);
        return res.redirect('/submit');
      }

      const bodyData = {
        challenge: req.body.challengeId,
        submittedBy: req.session.userId,
        link: req.body.link,
        description: req.body.description,
        name: req.body.name || req.body.challengeName,
      };

      const submission = await submittedChallengeRepository.submitChallenge(bodyData);

      res.status(201).redirect(`/challenges/${req.body.challengeName}`);
    } catch (err) {
      console.log(err);
      res.status(500).send({ Err: 'Server Error, Try Again Later' });
    }
  },
];

exports.getUpdateChallenge = async (req, res) => {
    try {
        const challenge = await challengeRepository.findById(req.params.id);
        const submittedChallenge = await submittedChallengeRepository.findSubmittedData(req.params.id)
        
          
        if(!submittedChallenge) {
          req.flash('error', 'No data found!')
          return res.redirect('/challenges')
        }
        
        res.status(201).render('updateSubmittedData', { userId: req.session.userId, challenge: submittedChallenge.challenge, data: submittedChallenge || [] });
    } catch (err) {
      console.log(err)
        res.status(500).send({"Err": "Server Error, Try Again Latter"});
    }
};


exports.updateChallenge = [
  // Add sanitizers and validators
  body('challengeName').optional().trim().escape(),
  body('description').optional().trim().escape(),
  body('link').trim().isURL().withMessage('Invalid URL').escape(),
  
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', 'Validation failed. Please correct the inputs.');
        return res.redirect('/challenges');
      }

      const updatedData = await submittedChallengeRepository.updateSolution(req.params.id, req.body);

      if (!updatedData) {
        req.flash('error', 'Try Again!');
        return res.redirect('/challenges');
      }

      req.flash('success', 'Updated!');
      res.status(201).redirect(`/challenges/${req.body.challengeName}`);
    } catch (err) {
      console.log(err);
      res.status(500).send({ Err: 'Server Error, Try Again Later' });
    }
  },
];

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

// exports.rateChallenge = async (req, res) => {
//     try {
//         await submittedChallengeRepository.updateRating(req.body.submittedChallengeId, {
//             userId: req.session.userId,
//             value: req.body.rating,
//         });
//         res.status(200).json({ message: 'Rating added successfully', isRated: true });
//     } catch (err) {
//         res.status(500).json({ message: 'Rate adding failed', isRated: false });
//     }
// };

// Function to submit a new rating
exports.rateChallenge = async (req, res) => {
    try {
        const { challengeId, rating } = req.body;
        const userId = req.session.userId
        
        // Find the submitted challenge
        const submittedChallenge = await submittedChallengeRepository.findSubmittedData(challengeId);
        
        if (!submittedChallenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        // Check if the user has already rated this challenge
        const existingRating = submittedChallenge.ratings.find(r => r.userId == userId);
        
        const existingRatingIndex = submittedChallenge.ratings.findIndex(r => r.userId == userId);
        
        if (existingRating) {
            submittedChallenge.ratings[existingRatingIndex].rating = rating;
          // Save the updated submitted challenge
          await submittedChallengeRepository.update(submittedChallenge._id, submittedChallenge);
          
          return res.json({ message: 'Rating updated successfully', ratings: submittedChallenge.ratings, isRated: true });
        }
        
        // Check for self rating
        const selfRating = submittedChallenge.submittedBy._id == userId;
        
        if (selfRating) {
            return res.status(400).json({ message: "Don't rate your self!"});
        }

        // Add the new rating
        submittedChallenge.ratings.push({ userId, rating });
        
        // Save the updated submitted challenge
        await submittedChallengeRepository.update(submittedChallenge._id, submittedChallenge);
        const av = _.sumBy(submittedChallenge.ratings, 'rating')
        res.status(200).json({ message: 'Rating submitted successfully', ratings: submittedChallenge.ratings, isRated: true });
    } catch (err) {
      console.log(err)
        res.status(500).json({ message: 'Rate adding failed', isRated: false });
    }
};

// Function to update an existing rating
exports.updateRating = async (req, res) => {
    try {
        const { challengeId, newRating } = req.body;
        const userId = req.session.userId
        
        // Find the submitted challenge
        const submittedChallenge = await submittedChallengeRepository.findByChallengeId(challengeId);
        
        if (!submittedChallenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // Find the existing rating for the user
        const existingRatingIndex = submittedChallenge.ratings.findIndex(r => r.userId === userId);
        
        if (existingRatingIndex === -1) {
            return res.status(400).json({ message: 'You have not rated this challenge yet' });
        }

        // Update the existing rating
        submittedChallenge.ratings[existingRatingIndex].rating = newRating;
        
        // Save the updated submitted challenge
        await submittedChallengeRepository.update(submittedChallenge._id, submittedChallenge);
        
        res.json({ message: 'Rating updated successfully', ratings: submittedChallenge.ratings, isRated: true });
    } catch (err) {
        res.status(500).json({ message: 'Rate updating failed', isRated: false });
    }
};