const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();


// Load Models
require('./models/User');
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load Auth Routes
const auth = require("./routes/auth");
const index = require("./routes/index");
const stories = require('./routes/stories');

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {
    truncate,
    formatDate,
    stripTags,
    select,
    editIcon
} = require('./helpers/hbs');

// Map Global Promises
mongoose.Promise = global.Promise

// Connect Atlas MongoDB
mongoose.connect(keys.mongoURI, {
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

// Method-Override Middleware
app.use(methodOverride('_method'));

// Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});