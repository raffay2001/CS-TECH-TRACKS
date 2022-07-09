const express = require('express');
const { showIndexPage } = require('../controllers/indexController');
const flash = require('express-flash');
const { showSigninForm } = require('../controllers/indexController');
const { showRegisterForm } = require('../controllers/authController');
const { showLoginForm } = require('../controllers/authController');
const { logoutController } = require('../controllers/authController');
const { loginController } = require('../controllers/authController');
const { createUser } = require('../controllers/authController');
const { showAboutUsPage } = require('../controllers/aboutUsController');
const { roadmapController } = require('../controllers/roadmapController');
const { trendController } = require('../controllers/trendController');
const { blogController } = require('../controllers/blogController');
const { upload } = require('../controllers/authController');
const router = express.Router();

// middleware for protecting the views to be used later 
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash('info_msg', 'You are not logged in, Please log in to view!');
        res.redirect('/signin');
    }
}


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

// route for home page 
router
    .route('/')
    .get(showIndexPage);

// route for sign up 
router
    .route('/signup')
    .get(checkAuthenticated, showRegisterForm)
    .post(upload.single('profile_pic'), createUser);

// route for sign in 
router
    .route('/signin')
    .get(checkAuthenticated, showLoginForm)
    .post(loginController);

// route for logout
router
    .route('/logout')
    .get(logoutController);

// route for about page 
router
    .route('/about')
    .get(showAboutUsPage)


// route for roadmaps page and roadmap detail page
// for all roadmaps  
router
    .route('/roadmaps')
    .get(checkNotAuthenticated, roadmapController)

// for individual roadmap 

// route for trends page 
router
    .route('/trends')
    .get(checkNotAuthenticated, trendController)

// route for blogs page
router
    .route('/blogs')
    .get(checkNotAuthenticated, blogController)


module.exports = router;
