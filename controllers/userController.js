const userRepository = require('../repositories/userRepository');
const submittedChallengeRepo = require('../repositories/submittedChallengeRepository');
const bcrypt = require('bcryptjs'); // Changed to bcryptjs

exports.profile = async (req, res) => {
    try {
        const completedChallenges = await submittedChallengeRepo.findByUser(req.session.userId)
        const user = await userRepository.findById(req.session.userId);
        res.render("profile", {user, completedChallenges, userId: req.session.id});
    } catch (err) {
      console.log(err)
        res.status(500).send(err);
    }
};

exports.user = async (req, res) => {
    try {
      const user = await userRepository.findByUsername(req.query.username);
      
        if(user._id == req.query.username) {
          return res.redirect('/profile')
        }
        
        if(req.query.username && user._id){
          const completedChallenges = await submittedChallengeRepo.findByUser(user._id)
          return res.render("seeProfile", { user, completedChallenges, userId: req.session.id });
      }
      
      res.send('No user Found')
    } catch (err) {
      console.log(err)
        res.status(500).send(err);
    }
};

exports.getUpdateUser = async (req, res) => {
    try {
      const user = await userRepository.findById(req.session.userId);
        
      res.render("updateForUser", { user, userId: req.session.id });
      
    } catch (err) {
      console.log(err)
        res.status(500).send(err);
    }
};

exports.updateUser = async (req, res) => {
    try {
        
        const updatedUser = await userRepository.updateUser(req.session.userId, req.body)
        return res.redirect("/profile");
      
      res.send('No user Found')
    } catch (err) {
      console.log(err)
        res.status(500).send(err);
    }
};

exports.getApproval = async (req, res) => {
    try {
        const users = await userRepository.getApproval();
        res.render("approval", {users});
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.approval = async (req, res) => {
    try {
        const { name, username, password, githubLink } = req.body;
        const userExists = await userRepository.findByUsername(req.body.username)
        if(userExists) {
          req.flash('error', 'username is used by others, try different one')
          return res.redirect("/register")
           
        }
        const timeStamp = Date.now()
        const newUser = await userRepository.sendToApproval({
            name,
            username,
            password: password,
            githubLink,
            timeStamp
        });
        req.session.approval = 'pending'
        req.session.approvalaId = timeStamp
        
        console.log(newUser)
        res.status(201).redirect('/status');
    } catch (err) {
      console.log(err)
        req.flash('error', 'Error, Please Try Again')
        res.status(500).redirect('/register');
      }
};

exports.register = async (req, res) => {
    try {
        const { name, username, password, githubLink, timeStamp } = req.body;
        const badge = "Rookie"
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing with bcryptjs
        const newUser = await userRepository.createUser({
            name,
            username,
            password: hashedPassword,
            badge,
            githubLink,
        });
        
        await userRepository.findAndDeleteApproval(timeStamp)
        res.status(201).json({ isReg: true });
    } catch (err) {
        res.status(500).json({ isReg: false, err });
    }
};

exports.reject = async (req, res) => {
      console.log("rejected")
    try {
      const { name, username, password, githubLink, timeStamp } = req.body;
      await userRepository.findAndDeleteApproval(timeStamp)
      res.status(200).json({ isReg: true });
      
    } catch (e) {
      console.log(e)
      res.status(500).json({ isReg: false, e });
    }
  
}

exports.getStatus = async (req, res) => {
    try {
        const appStatus = await userRepository.findApproval(req.session.approvalaId)
        if(appStatus) {
          return res.render("done", { userId: req.session.userId, approval: req.session.approval});
        }
        
        return res.redirect('/register');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getRegister = async (req, res) => {
  
    try {
        const appStatus = await userRepository.findApproval(req.session.approvalaId)
        if(appStatus) {
          return res.redirect('/status');
        }
        
        res.render("register", { userId: req.session.userId, messages: req.flash() });
    } catch (err) {
      console.log(err)
        req.flash('error', 'Error, Please Try Again')
        res.status(500).render("register", { userId: req.session.userId, messages: req.flash() });
        // res.status(500).send(err);
    }
};
