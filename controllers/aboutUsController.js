const showAboutUsPage = (req, res) => {
    let context = {
        'title': 'ABOUT US',
        'is_authenticated': false,
        'name': undefined,
        'picture': undefined
    }
    if (req.user) {
        context['is_authenticated'] = true;
        context['picture'] = req.user.picture;
        context['name'] = req.user.name;
    }
    res.render('about', context)
}


module.exports = {
    showAboutUsPage
}