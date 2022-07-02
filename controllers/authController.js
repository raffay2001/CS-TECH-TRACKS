const pool = require('./dbConfig');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passportConfig');


const showRegisterForm = (req, res) => {
    res.render('register');
}

const showLoginForm = (req, res) => {
    res.render('login');
}

const logoutController = (req, res, next) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        req.flash('success_msg', 'You have logged out');
        res.redirect('/users/login');
    });
}

const loginController = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
});

const createUser = async (req, res) => {
    const { name, email, password, password2 } = req.body;
    console.log({ name, email, password, password2 });

    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: 'Please Enter All Fields' });
    }

    if (password.length < 6) {
        errors.push({ message: 'Password should be altleast 6 characters' });
    }

    if (password !== password2) {
        errors.push({ message: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('register', { 'errors': errors });
    } else {
        // Form Validation has passed
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (error, results) => {
            if (error) throw error;
            console.log(results.rows);

            if (results.rows.length > 0) {
                errors.push({ message: 'Email Already Registered' })
                res.render('register', { 'errors': errors })
            } else {
                pool.query(
                    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`, [name, email, hashedPassword], (error, message) => {
                        if (error) throw error;
                        console.log(results.rows);
                        req.flash('success_msg', 'You are now registered, Please Log in!!');
                        res.redirect('/users/login');
                    }
                );
            }
        }
        );
    }
}

module.exports = {
    showRegisterForm
    , showLoginForm
    , logoutController
    , loginController
    , createUser
}




