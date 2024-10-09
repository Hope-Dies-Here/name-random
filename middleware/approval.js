module.exports = (req, res, next) => {
    if (req.session && req.session.approval == 'pending') {
        // res.redirect('/status')
        return next(); // Proceed to the next middleware or controller
    } else {
      // flash error here
        // res.redirect('/register')
        return next(); // Proceed to the next middleware or controller
    }
};