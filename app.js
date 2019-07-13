const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const app = express();


// Load User Models
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Auth Routes
const auth = require("./routes/auth");
const index = require("./routes/index");

// Load Keys
const keys = require('./config/keys');

// Map Global Promises
mongoose.Promise = global.Promise

// Connect Atlas MongoDB
mongoose.connect(keys.mongoURI,{
    useNewUrlParser: true  
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// Middleware Express-Session/Cookie Parser
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})


// Use Routes
app.use('/', index);
app.use('/auth', auth);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});