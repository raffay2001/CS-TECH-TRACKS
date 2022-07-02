const express = require('express');
const indexController = require('../controllers/indexController');
const router = express.Router();

// middleware for protecting the views to be used later 
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/users/login');
    }
}

router
    .route('/')
    .get(checkNotAuthenticated, indexController);

module.exports = router;
