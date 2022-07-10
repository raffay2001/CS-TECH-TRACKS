const showIndexPage = (req, res) => {
    let context = {
        'title': 'CS TECH TRACKS',
        'is_authenticated': false,
        'name': undefined,
        'picture': undefined
    }
    if (req.user) {
        context['is_authenticated'] = true;
        context['picture'] = req.user.picture;
        context['name'] = req.user.name;
        const name = req.user.name;
        req.flash('success_msg', `Welcome Back ${name}!`);
    }
    res.render('home', context);
}




module.exports = {
    showIndexPage
};