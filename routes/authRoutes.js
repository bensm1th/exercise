const   Authentication      = require('../controllers/authentication'),
        passportService     = require('../services/passport'),
        passport            = require('passport');

const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
}