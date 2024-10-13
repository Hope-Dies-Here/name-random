const challengeRepository = require('../repositories/challengeRepository');
const submittedChallengeRepository = require('../repositories/submittedChallengeRepository');
const userRepository = require('../repositories/userRepository');
exports.getLogin = (req, res) => { 
    res.render('./admin/login', { userId: req.session.userId, messages: req.flash() })
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (username == 'aidmn' && password == 'aa') {
            // Set user session
            req.session.admin = true;
            return res.status(200).redirect('/admin/challenges');
        }

        req.flash('error', 'Wrong input, Try again')
        res.redirect('/login');
    } catch (err) {
        res.status(500).redirect('/login');
    }
};

exports.getHome = async (req, res) => {
  res.render('home', { userId: req.session.userId})
}

exports.getAddChallenge = async (req, res) => {
  res.render('addChallenge', { userId: req.session.userId})
}

exports.addChallenge = async (req, res) => {
  const { name, level, expPointReward, instruction, description, deadline } = req.body
  const newChallenge = challengeRepository.createChallenge(req.body)
  res.redirect('/admin/challenges')
}

exports.getUpdateChallenge = async (req, res) => {
  const name = req.params.name
  const challenge = await challengeRepository.findByName(name)
  res.render('updateChallenge', { challenge })
}

exports.updateChallenge = async (req, res) => {
  try {
    const id = req.params.id
    const newChallenge = await challengeRepository.updateChallenge(id, req.body)
    res.redirect('/admin/challenges')
    
  } catch (e) {
    console.log(e)
    res.send(e)
  }
}

exports.deleteChallenge = async (req, res) => {
  const name = req.params.name
  const ch = await challengeRepository.findByName(name)
  await challengeRepository.deleteChallenge(name)
  await submittedChallengeRepository.deleteByChallengeId(ch._id)
  res.redirect(`/admin/challenges`)
}

exports.getChallenges = async (req, res) => {
  const challenges = await challengeRepository.getAllChallenges()
  res.render('challengeLists', { userId: req.session.userId, challenges })
}

exports.getUsers = async (req, res) => {
  const users = await userRepository.getUsers()
  res.render('usersList', { users })
}

exports.deleteUser = async (req, res) => {
  const users = await userRepository.deleteUser(req.params.id)
  await submittedChallengeRepository.deleteByUserId(req.params.id)
  res.redirect('/admin/usersList')
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).redirect('/');
        }
        res.status(200).redirect('/');
    });
};