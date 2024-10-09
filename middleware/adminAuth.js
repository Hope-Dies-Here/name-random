module.exports = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next(); // Proceed to the next middleware or controller
    } else {
      // flash error here
        res.redirect('/admin/login')
    }
};