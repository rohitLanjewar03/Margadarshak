const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const userModel = require('./models/user');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const { authenticateToken } = require('./middleware');
require('./passport-setup'); // Import passport configuration

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'thismustbesecret', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

const SECRET_KEY = "shhhhhh"; 

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to dashboard.
        res.redirect('/dashboard');
    }
);

// Regular login and register routes
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', (req, res) => {
    let { username, email, password, contact, role } = req.body;

    if (!['student', 'teacher'].includes(role)) {
        return res.status(400).send("Invalid role");
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(500).send("Error during registration");

            let newUser = await userModel.create({
                username,
                email,
                password: hash,
                contact,
                role 
            });

            let token = jwt.sign({ email, role }, SECRET_KEY, { expiresIn: '1h' }); 
            res.cookie("token", token, { httpOnly: true });
            newUser.save();
            res.redirect('dashboard');
        });
    });
});

app.get('/register', (req, res) => {
    res.render('signup');
});

app.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User not found");

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) return res.status(500).send("Error comparing passwords");

            if (!result) {
                res.redirect('/login'); 
            } else {
                let token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
                res.cookie("token", token, { httpOnly: true });
                res.redirect('/dashboard'); 
            }
        });
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

app.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { user: req.user });
});

app.get('/logout', (req, res) => {
    req.logout(); // Logout using passport
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); 
    res.redirect('/');
});

app.listen(5000, (req, res) => {
    console.log('Listening on port 5000');
});
