const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs'); // Changed to bcryptjs

exports.getLogin = (req, res) => { 
    if(req.session && req.session.userId) {
      return res.redirect('/profile')
    }
    res.render('login', { userId: req.session.userId, messages: req.flash() })
}
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userRepository.findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
          console.log('error')
            req.flash('error', 'Wrong input, Try again')
            return res.status(401).redirect('/login');
        }

        // Set user session
        req.session.userId = user._id;
        res.redirect('/profile');
    } catch (err) {
        res.status(500).redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).redirect('/');
        }
        res.status(200).redirect('/');
    });
};