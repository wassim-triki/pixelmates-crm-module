const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // New Google user, create account
          const defaultRole = await require('../models/Role').findOne({ name: 'Client' });

          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            image: profile.photos[0]?.value, // Store Google profile picture
            provider: 'google',
            providerId: profile.id,
            isVerified: true,
            role: defaultRole ? defaultRole._id : null
          });
        } else {
          // User exists but might not have Google provider info
          // Update the user with Google provider info if needed
          if (user.provider !== 'google') {
            user.provider = 'google';
            user.providerId = profile.id;
            user.isVerified = true;

            // Don't update the user's name or email as they might have customized it
            // But we can update the profile picture if they don't have one
            if (!user.image && profile.photos[0]?.value) {
              user.image = profile.photos[0].value;
            }

            // Save the changes but don't use findOneAndUpdate to avoid the duplicate key error
            await user.save();
          }
        }

        // Generate JWT tokens
        const jwtToken = generateAccessToken(user);
        const refreshJwt = generateRefreshToken(user);

        user.refreshToken = refreshJwt;
        await user.save();

        return done(null, { user, jwtToken, refreshJwt });
      } catch (error) {
        return done(error, null);
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
