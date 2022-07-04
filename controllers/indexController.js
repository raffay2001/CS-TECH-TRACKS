const showIndexPage = (req, res) => {
    const picture = req.user.picture;
    let context = {
        'user': req.user.name,
        'profilePic': picture
    }
    console.log(picture);
    res.render('index', context);
}

module.exports = showIndexPage;