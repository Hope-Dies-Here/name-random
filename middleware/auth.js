module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next(); // Proceed to the next middleware or controller
    } else {
      // flash error here
        req.flash('error', 'Login to Access The Page')
        res.redirect('/login')
        
    }
};