const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load User model
const User = mongoose.model('users');


module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            // callbackURL: keys.absoluteURI + '/auth/google/callback',
            callbackURL:'/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log(refreshToken);
            console.log(callbackURL);
            console.log(profile);
            console.log(callbackURL);
            const userImage = profile.photos[0].value;
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            // console.log(image);
            // console.log(userImage);

            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: userImage
            }

            // Check for Exisiting User
            User.findOne({
                googleID: profile.id
            }).then(user => {
                if(user) {
                    // Return User
                    done(null, user);
                } else {
                    // Create User
                    new User(newUser)
                        .save()
                        .then(user => done(null, user))
                        .catch(err => console.log(err));
                }
            })
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });
}
