// importing all the core dependencies 
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passportConfig');
const userRouter = require('./routes/authRoutes');
const indexRouter = require('./routes/indexRoutes');

// initializing all the core modules 
initializePassport(passport);
const app = express();
const PORT = process.env.port || 4000;

// setting up all the important middlewares 
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',

    resave: false,

    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




// defining the index routes 
app.use('', indexRouter);

// defining the auth routes 
app.use('/users', userRouter);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


