const todoController = async(req, res) => {
    let context = {
        'title': 'TODO LIST',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    res.render('todo', context);
}



module.exports = {
    todoController
}