const userPassword = require('./userPassword');

const user = userPassword;

const name = user.name;
const password = user.password;

const express = require('express');

const bodyParser = require('body-parser');

const helmet = require('helmet');

const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');

const saucesRoutes = require('./routes/sauces');

const app = express();

const path = require('path');

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});

const URIS = 'mongodb+srv://' + name + ':' + password + '@cluster-0.lvh0y.mongodb.net/P6_DataBase?retryWrites=true&w=majority';

mongoose.connect(URIS, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());

app.use(bodyParser.json());

app.use('/api/auth', limiter);

app.use('/api/auth', usersRoutes);

app.use('/api/sauces', saucesRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
