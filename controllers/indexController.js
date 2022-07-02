const showIndexPage = (req, res) => {
    let context = {
        'user': req.user.name
    }
    res.render('index', context);
}

module.exports = showIndexPage;