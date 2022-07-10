const roadmapController = async(req, res) => {
    let context = {
        'title': 'ROADMAPS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    res.render('roadmaps', context);
}



module.exports = {
    roadmapController
}