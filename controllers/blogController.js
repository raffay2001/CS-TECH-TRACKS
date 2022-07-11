const flash = require('express-flash');
const pool = require('./dbConfig');

const blogController = async (req, res) => {
    let context = {
        'title': 'BLOGS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
    }
    const user_id = req.user.id;
    // code for fetching up all the blogs
    const allBlogs = await pool.query(`SELECT * FROM blog`);
    const allUsers = await pool.query(`SELECT name, picture, id FROM users WHERE id IN (SELECT user_id FROM blog);`);
    const blogsList = allBlogs.rows;
    for (let i = 0; i < blogsList.length; i++) {
        const rawDate = blogsList[i]['created_at'];
        const date = `${rawDate}`;
        const dateList = date.split(' ');
        const blogPublishDate = `${dateList[2]}-${dateList[1]}-${dateList[3]}`;
        blogsList[i]['created_at'] = blogPublishDate;
    }
    context['blogs'] = blogsList;
    context['users'] = allUsers.rows;
    res.render('blogs', context);
}

const showBlog = async (req, res) => {
    let context = {
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
    }
    const blog_id = req.query.id;
    const user_id = req.user.id;
    // code for fetching from the database below:
    const blogList = await pool.query(`SELECT * FROM blog WHERE id = $1`, [blog_id]);
    const blogAuthorList = await pool.query(`SELECT name, picture, id FROM users WHERE id = (SELECT user_id FROM blog WHERE id = $1)`, [blog_id]);
    const blog = blogList.rows[0];
    const user = blogAuthorList.rows[0];

    const rawDate = blog['created_at'];
    const date = `${rawDate}`;
    const dateList = date.split(' ');
    const blogPublishDate = `at ${dateList[2]}-${dateList[1]}-${dateList[3]} on ${dateList[0]}`;
    blog['created_at'] = blogPublishDate;

    context['title'] = blog['title'];
    context['blog'] = blog;
    context['user'] = user;
    res.render('blog_detail', context);

}


const showBlogForm = async (req, res) => {
    let context = {
        'title': 'POST A BLOG',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture,
    }

    // code for inserting the blog in the database 

    res.render('add_blog', context);

}


const submitBlog = async (req, res) => {
    const { title, tag, picture, content } = req.body;
    const user_id = req.user.id;
    // inserting blog in dB:
    await pool.query(`INSERT INTO blog (title, content, picture, tag, user_id) VALUES ($1, $2, $3, $4, $5)`, [title, content, picture, tag, user_id], (error, results) => {
        if (error) throw error;
        console.log('Blog Inserted!!');
    });
    req.flash('success_msg', `Your blog: ${title} is posted on the site!`);
    res.redirect('/post-blog');
}

module.exports = {
    blogController,
    showBlog,
    showBlogForm,
    submitBlog
}