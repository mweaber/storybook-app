const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require("./routes/auth");

const app = express();

app.get('/', (req, res) => {
    res.send("Working");
});





// Use Routes
app.use('/auth', auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});