const pool = require('./dbConfig');

const blogController = async(req, res) => {
    let context = {
        'title': 'BLOGS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
    }
    res.render('blogs', context);
}

const showBlog = async (req, res) => {
    const blog_id = req.params.id;
    const user_id = req.user.id;
    // code for fetching from the database below:

    let context = {
        'title': 'BLOG DETAIL PAGE',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
    }

    res.render('blog_detail', context);
    
}


const addBlog = async (req, res) => {
    let context = {
        'title': 'POST A BLOG',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
    }

    // code for inserting the blog in the database 

    res.render('add_blog', context);

}

module.exports = {
    blogController,
    showBlog,
    addBlog
}