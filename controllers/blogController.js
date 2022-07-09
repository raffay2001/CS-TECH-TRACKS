const blogController = async(req, res) => {
    let context = {
        'title': 'BLOGS',
        'is_authenticated': false,
        'name': undefined,
        'picture': undefined
    }
    if (req.user) {
        context['is_authenticated'] = true;
        context['picture'] = req.user.picture;
        context['name'] = req.user.name;
    }
    res.render('blogs', context);
}



module.exports = {
    blogController
}