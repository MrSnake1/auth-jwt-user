const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pages = require('./routes/pages');
dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {useUnifiedTopology: true, useNewUrlParser: true}, () => {
    console.log('Connected to database!');
});

const authRoute = require('./routes/auth');

const secureRoute = require('./routes/secure');

app.use(express.json());

app.use(express.static('public'));

app.use('/api/user', authRoute);

app.use('/api/secure', secureRoute);

app.use('/', pages);

app.listen(3000, () => {
    console.log('Server running');
});