const trendController = async (req, res) => {
    let context = {
        'title': 'TRENDS',
        'is_authenticated': false,
        'name': undefined,
        'picture': undefined
    }
    if (req.user) {
        context['is_authenticated'] = true;
        context['picture'] = req.user.picture;
        context['name'] = req.user.name;
    }
    res.render('trends', context);
}



module.exports = {
    trendController
}