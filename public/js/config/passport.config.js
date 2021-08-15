const LocalStrategy = require('passport-local').Strategy;
const {findByUsername, getUserbyId} = require('../../../models/user.model');
const bcrypt = require('bcryptjs');

const initialize = (passport) => {
    const authenticateUser = async (username, password, done) => {
        console.log(username);
        console.log(password);

        const user = await findByUsername(username);
        if (user == null){
            const mgs = "<b>User is inactive <a href='/user/otp/" + username + "'>Activate account</a></b>";
            return done(null, false, {message: mgs});
        }

        try {
            if (await bcrypt.compare(password, user.password)){
                if (user.is_active === 0){
                    const mgs = "<b>User is inactive <a href='/user/otp/" + username + "'>Activate account</a></b>";
                    return done(null, false, {message: mgs});
                }
                else{
                    console.log(user);
                    console.log("login successful");
                    return done(null, user);
                }
            } else {
                return done(null, false, {message: "Wrong username or password"});
            }
        } catch (error) {
            return done(error);
        }
    } 

    passport.use(new LocalStrategy({ usernameField: 'user_name'}, authenticateUser));

    passport.serializeUser( (user, done) => done(null, user.id) );

    passport.deserializeUser( (id, done) => {
        return done(null, getUserbyId(id));
    });
};

module.exports = initialize;