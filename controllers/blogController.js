const blogController = async(req, res) => {
    let context = {
        'title': 'BLOGS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    res.render('blogs', context);
}



module.exports = {
    blogController
}