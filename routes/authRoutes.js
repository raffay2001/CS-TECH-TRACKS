const express = require('express');
const { showRegisterForm } = require('../controllers/authController');
const { showLoginForm } = require('../controllers/authController');
const { logoutController } = require('../controllers/authController');
const { loginController } = require('../controllers/authController');
const { createUser } = require('../controllers/authController');
const router = express.Router();


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/dashboard');
    }
    next();
}

router
    .route('/register')
    .get(checkAuthenticated, showRegisterForm)
    .post(createUser);

router
    .route('/login')
    .get(checkAuthenticated, showLoginForm)
    .post(loginController);

router
    .route('/logout')
    .get(logoutController);



module.exports = router;