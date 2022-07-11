const pool = require('./dbConfig');

const trendController = async (req, res) => {
    let context = {
        'title': 'TRENDS',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    const trends = await pool.query(`SELECT * FROM trend;`);
    const trendsList = trends.rows;
    context['trendsList'] = trendsList;
    res.render('trends', context);
}


module.exports = {
    trendController
}