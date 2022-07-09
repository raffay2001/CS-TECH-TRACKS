const roadmapController = async(req, res) => {
    let context = {
        'title': 'ROADMAPS',
        'is_authenticated': false,
        'name': undefined,
        'picture': undefined
    }
    if (req.user) {
        context['is_authenticated'] = true;
        context['picture'] = req.user.picture;
        context['name'] = req.user.name;
    }
    res.render('roadmaps', context);
}



module.exports = {
    roadmapController
}