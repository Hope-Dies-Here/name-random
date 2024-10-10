const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const challengeController = require('../controllers/challengeController');
const submittedChallengeController = require('../controllers/submittedChallengeController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const userAuth = require('../middleware/auth');
const updateSolutionAuth = require('../middleware/updateSolutionAuth');

//default route
router.get('/', challengeController.home);

// Auth Routes
router.get('/login', authController.getLogin);
router.post('/login', authController.login);

router.get('/logout', userAuth, authController.logout);

//user registration
router.get('/register', userController.getRegister);
router.post('/approval', userController.approval);
router.post('/admin/register', userController.register);
router.post('/admin/reject', userController.reject);

//admin aprroves the post
router.post('/register', adminAuth, userController.register);

router.get('/status', userController.getStatus);

// User Profile Routes
router.get('/profile', userAuth, userController.profile);

// Challenge Routes
router.get('/challenges', challengeController.listChallenges);
router.get('/challenges/:name', challengeController.viewChallenge);

// Submitted Challenges
router.get('/submit', userAuth, submittedChallengeController.getSubmitChallenge);
router.post('/submit', userAuth, submittedChallengeController.submitChallenge);

//rating
router.post('/rate', userAuth, submittedChallengeController.rateChallenge);

// update submitted challenge
router.get('/update/:id', userAuth, updateSolutionAuth, submittedChallengeController.getUpdateChallenge);
router.post('/update/:id', userAuth, updateSolutionAuth, submittedChallengeController.updateChallenge);
router.post('/delete/:id', userAuth, updateSolutionAuth, submittedChallengeController.deleteChallenge);

// admin
router.get('/admin/login', adminController.getLogin);
router.post('/admin/login', adminController.login);

// admin home page
router.get('/admin/home', adminAuth, adminController.getHome);
router.get('/admin/approval', adminAuth, userController.getApproval);

router.get('/admin/challenges', adminController.getChallenges);

router.get('/admin/challenges/:name', adminController.getUpdateChallenge);
router.post('/admin/challenges/:id', adminController.updateChallenge);

router.post('/admin/deleteChallenge/:name', adminController.deleteChallenge);

router.get('/admin/addChallenge', adminController.getAddChallenge);
router.post('/admin/addChallenge', adminController.addChallenge);

module.exports = router;