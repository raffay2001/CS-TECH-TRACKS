const todoController = async(req, res) => {
    let context = {
        'title': 'TODO LIST',
        'is_authenticated': false,
        'name': undefined,
        'picture': undefined
    }
    if (req.user) {
        context['is_authenticated'] = true;
        context['picture'] = req.user.picture;
        context['name'] = req.user.name;
    }
    res.render('todo', context);
}



module.exports = {
    todoController
}