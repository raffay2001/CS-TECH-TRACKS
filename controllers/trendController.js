const trendController = async (req, res) => {
    let context = {
        'title': 'TRENDS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    res.render('trends', context);
}



module.exports = {
    trendController
}