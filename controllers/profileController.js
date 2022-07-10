const profileController = async(req, res) => {
    let context = {
        'title': 'PROFILE',
        'is_authenticated': false,
        'name': undefined,
        'picture': undefined
    }
    if (req.user) {
        context['is_authenticated'] = true;
        context['picture'] = req.user.picture;
        context['name'] = req.user.name;
    }
    res.render('profile', context);
}



module.exports = {
    profileController
}