const pool = require('./dbConfig');
const multer = require('multer');
const upload = multer({ 'storage': multer.memoryStorage() });

const profileController = async (req, res) => {
    let context = {
        'title': 'PROFILE',
        'is_authenticated': true,
        'name': req.user.name,
        'picture': req.user.picture
    }
    const user_id = req.user.id;
    const user = await pool.query(`SELECT * FROM users WHERE id = ($1)`, [user_id]);
    const userObject = user.rows[0];
    const { name, username, email, picture, phone, city, street, zipcode } = userObject;
    context['name'] = name;
    context['username'] = username;
    context['email'] = email;
    context['picture'] = picture;
    context['phone'] = phone;
    context['city'] = city;
    context['street'] = street;
    context['zipcode'] = zipcode;

    

    res.render('profile', context);
}


const updateProfile = async (req, res) => {
    const { reqname, requsername, reqemail, reqphone, reqcity, reqstreet, reqzipcode } = req.body;
    const user_id = req.user.id;
    const user = await pool.query(`SELECT * FROM users WHERE id = ($1)`, [user_id]);
    const userObject = user.rows[0];
    const { name, username, email, phone, city, street, zipcode } = userObject;

    if (name == reqname && username == requsername && email == reqemail && phone == reqphone && city == reqcity && street == reqstreet && zipcode == reqzipcode) {
        console.log('Entered 1st if !!');
        req.flash('info_msg', 'Please update information before saving!');
        res.redirect('/profile');
    }

    else {
        console.log('Entered 2nd if !!');
        await pool.query(`UPDATE users SET name = $1, username = $2, email = $3, phone = $4, city = $5, street = $6, zipcode = $7 WHERE id = $8 RETURNING id`, [reqname, requsername, reqemail, reqphone, reqcity, reqstreet, reqzipcode, user_id]);
        req.flash('success_msg', 'Profile Updated!');
        res.redirect('/profile');
    }

}

const updateProfilePicture = async (req, res) => {
    const reqProfilePicture = req.file.buffer.toString('base64');
    const user_id = req.user.id;
    const user = await pool.query(`SELECT * FROM users WHERE id = ($1)`, [user_id]);
    const userObject = user.rows[0];
    const { picture } = userObject;

    if (reqProfilePicture == picture) {
        req.flash('info_msg', 'Please upload a new profile picture');
        res.redirect('/profile');
    }

    else {
        await pool.query(`UPDATE users SET picture = $1 WHERE id = $2`, [reqProfilePicture, user_id]);
        req.flash('success_msg', 'Profile Picture Updated!');
        res.redirect('/profile');
    }

}


module.exports = {
    profileController,
    updateProfile,
    upload,
    updateProfilePicture
}