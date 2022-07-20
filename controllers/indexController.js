const pool = require('./dbConfig');
const showIndexPage = async (req, res) => {
    let context = {
        'title': 'CS TECH TRACKS',
        'is_authenticated': false,
        'name': undefined,
        'picture': undefined,
    }
    if (req.user) {
        context['is_authenticated'] = true;
        context['picture'] = req.user.picture;
        context['name'] = req.user.name;
        const name = req.user.name;
        req.flash('success_msg', `Welcome Back ${name}!`);
    }

    const allTestimonials = await pool.query(`SELECT * FROM testimonial`); 
    const  allTestimonialList = allTestimonials.rows;
    // console.log(allTestimonialList);
    context['testimonials'] = allTestimonialList;

    res.render('home', context);
}




module.exports = {
    showIndexPage
};