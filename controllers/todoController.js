const pool = require('./dbConfig');

const todoController = async (req, res) => {
    const user_id = req.user.id;
    let context = {
        'title': 'TODO LIST',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    const todos = await pool.query(`SELECT * FROM todo WHERE user_id = $1`, [user_id]);
    context['todos'] = todos.rows;
    res.render('todo', context);
}

const submitTodo = async (req, res) => {
    const { todo } = req.body;
    const user_id = req.user.id;
    await pool.query(`INSERT INTO todo (task, user_id) VALUES ($1, $2)`, [todo, user_id]);
    res.redirect('/todos');
}

const deleteTodo = async (req, res) => {
    const user_id = req.user.id;
    const todoId = req.params.id;
    const todoToBeDeleted = await pool.query(`SELECT * FROM todo WHERE id = $1 AND user_id = $2`, [todoId, user_id]);
    const todoToBeDeletedObj = todoToBeDeleted.rows[0];
    const { task } = todoToBeDeletedObj;
    console.log(task)
    await pool.query(`DELETE FROM todo WHERE id = $1 AND user_id = $2`, [todoId, user_id]);
    req.flash('success_msg', `Task: ${task} has been done! Keep up good work.`);
    res.redirect('/todos');
}


module.exports = {
    todoController,
    submitTodo,
    deleteTodo
}