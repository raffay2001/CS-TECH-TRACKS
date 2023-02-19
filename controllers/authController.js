const pool = require("./dbConfig")
const bcrypt = require("bcrypt")
const session = require("express-session")
const flash = require("express-flash")
const passport = require("passport")
const initializePassport = require("./passportConfig")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })

const showRegisterForm = (req, res) => {
  let context = {
    title: "SIGN UP",
    is_authenticated: false,
    name: undefined,
    picture: undefined,
  }
  if (req.user) {
    context["is_authenticated"] = true
    context["picture"] = req.user.picture
    context["name"] = req.user.name
  }
  res.render("signup", context)
}

const showLoginForm = (req, res) => {
  let context = {
    title: "SIGN IN",
    is_authenticated: false,
    name: undefined,
    picture: undefined,
  }
  if (req.user) {
    context["is_authenticated"] = true
    context["picture"] = req.user.picture
    context["name"] = req.user.name
  }
  res.render("signin", context)
}

const logoutController = (req, res, next) => {
  req.logout(req.user, (err) => {
    if (err) return next(err)
    req.flash("success_msg", "You have logged out !")
    res.redirect("/")
  })
}

const loginController = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signin",
  failureFlash: true,
})

const createUser = async (req, res) => {
  const { name, username, email, phone, city, street, zipcode, password, password2 } = req.body
  const intStreet = parseInt(street)
  const intZipCode = parseInt(zipcode)
  const profilePic = req.file.buffer.toString("base64")
  // console.log({ name, username, email, phone, city, intStreet, intZipCode, password, password2, profilePic });

  let errors = []

  if (
    !name ||
    !email ||
    !password ||
    !password2 ||
    !username ||
    !phone ||
    !city ||
    !zipcode ||
    !street
  ) {
    errors.push({ message: "Please Enter All Fields" })
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be altleast 6 characters" })
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" })
  }

  if (errors.length > 0) {
    const context = {
      title: "SIGN UP",
      errors: errors,
    }
    res.render("signup", context)
  } else {
    // Form Validation has passed
    let hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)

    pool.query(
      `SELECT * FROM users
            WHERE email = $1`,
      [email],
      (error, results) => {
        if (error) throw error
        console.log(results.rows)

        if (results.rows.length > 0) {
          errors.push({ message: "Email Already Registered" })
          res.render("signup", { errors: errors, title: "SIGN UP" })
        } else {
          pool.query(
            `INSERT INTO users (name, username, email, password, picture, phone, city, street, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, password`,
            [name, username, email, hashedPassword, profilePic, phone, city, intStreet, intZipCode],
            (error, message) => {
              if (error) throw error
              console.log(results.rows)
              req.flash("success_msg", "You are now registered, Please Log in!!")
              res.redirect("/signin")
            }
          )
        }
      }
    )
  }
}

module.exports = {
  showRegisterForm,
  showLoginForm,
  logoutController,
  loginController,
  createUser,
  upload,
}
