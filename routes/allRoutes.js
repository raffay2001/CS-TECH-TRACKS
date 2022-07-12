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
const { showRoadmap } = require('../controllers/roadmapController');
const { showGuidedProject } = require('../controllers/roadmapController');
const { showQuiz } = require('../controllers/roadmapController');
const { markMilestoneAsDone } = require('../controllers/roadmapController');
const { trendController } = require('../controllers/trendController');
const { blogController } = require('../controllers/blogController');
const { showBlog } = require('../controllers/blogController');
const { showBlogForm } = require('../controllers/blogController');
const { submitBlog } = require('../controllers/blogController');
const {submitComment} = require('../controllers/blogController');
const {deleteComment} = require('../controllers/blogController');
const { profileController } = require('../controllers/profileController');
const { updateProfile } = require('../controllers/profileController');
const { updateProfilePicture } = require('../controllers/profileController');
const { todoController } = require('../controllers/todoController');
const { submitTodo } =  require('../controllers/todoController');
const { deleteTodo } =  require('../controllers/todoController');
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
    .get(showAboutUsPage);


// route for roadmaps page and roadmap detail page
// for all roadmaps  
router
    .route('/roadmaps')
    .get(checkNotAuthenticated, roadmapController);

// for individual roadmap 
router
    .route('/roadmap')
    .get(checkNotAuthenticated, showRoadmap);

// route for marking the milestone as done 
router
    .route('/mark-as-done')
    .get(checkNotAuthenticated, markMilestoneAsDone);

// route for the guided project of the roadmap 
router
    .route('/guided-project')
    .get(checkNotAuthenticated, showGuidedProject)

// route for the quiz of the roadmap
router
    .route('/quiz')
    .get(checkNotAuthenticated, showQuiz)

// route for trends page 
router
    .route('/trends')
    .get(checkNotAuthenticated, trendController);

// route for blogs page
router
    .route('/blogs')
    .get(checkNotAuthenticated, blogController);

// route for the individual blog 
router
    .route('/blog')
    .get(checkNotAuthenticated, showBlog)
    .post(checkNotAuthenticated, submitComment);

// route for deleting a comment 
router
    .route('/delete-comment')
    .get(checkNotAuthenticated, deleteComment);

// route for posting a blog 
router 
    .route('/post-blog')
    .get(checkNotAuthenticated, showBlogForm)
    .post(checkNotAuthenticated, submitBlog);

    

// route for rendering the profile page 
router
    .route('/profile')
    .get(checkNotAuthenticated, profileController);
// route for updating the general profile information of user 
router
    .route('/upate-profile')
    .post(updateProfile);
// route for updating the profile picture of the user
router
    .route('/update-profile-picture')
    .post(upload.single('req_profile_pic'), updateProfilePicture);

// route for the todo list page 
router
    .route('/todos')
    .get(checkNotAuthenticated, todoController)

// route for submitting a todo 
router
    .route('/submit-todo')
    .post(submitTodo);

// route for deleting a todo 
router
    .route('/delete-todo/:id')
    .get(deleteTodo)


module.exports = router;
