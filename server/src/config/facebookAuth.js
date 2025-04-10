const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name', 'photos'] // Important pour avoir email, photo, etc.
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Certains profils Facebook n'ont pas d'email dispo si ce n’est pas autorisé
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        let user = await User.findOne({ email });

        if (!user) {
          // Nouvel utilisateur Facebook
          user = await User.create({
            firstName: profile.name.givenName || '',
            lastName: profile.name.familyName || '',
            email: email || `${profile.id}@facebook.com`, // fallback
            image: profile.photos[0]?.value,
            provider: 'facebook',
            providerId: profile.id,
            facebookId: profile.id,
            facebookAccessToken: accessToken,
            isVerified: true,
          });
        }

        const jwtToken = generateAccessToken(user);
        const refreshJwt = generateRefreshToken(user);

        user.refreshToken = refreshJwt;
        await user.save();

        return done(null, { user, jwtToken, refreshJwt });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
