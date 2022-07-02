const LocalStrategy = require('passport-local').Strategy;
const pool = require('./dbConfig');
const bcrypt = require('bcrypt');
const flash = require('express-flash');


function initialize(passport) {

    const authenticateUser = (email, password, done) => {
        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], (error, results) => {
                if (error) throw error;
                console.log(results.rows);

                if (results.rows.length > 0) {
                    const user = results.rows[0];

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        else if (isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: 'Password is not Correct' });
                        }
                    });
                }
                else {
                    return done(null, false, { message: 'Email is not registered' });
                }
            }
        );
    }

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        pool.query(
            `SELECT * FROM users WHERE id = $1`, [id], (error, results) => {
                if (error) throw error;
                return done(null, results.rows[0])
            }
        );
    });

}

module.exports = initialize;