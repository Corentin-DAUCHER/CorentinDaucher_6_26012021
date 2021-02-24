//Import du user et password pour MongoDB

//Initialisation du module dotenv

const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error
}

//Initialisation des variables

const userName = process.env.userName;

const userPassword = process.env.userPassword;

//Import du module express

const express = require('express');

//Import du module body-parser

const bodyParser = require('body-parser');

//Import du module helmet

const helmet = require('helmet');

//Import du module mongoose

const mongoose = require('mongoose');

//Import des routes

const usersRoutes = require('./routes/users');

const saucesRoutes = require('./routes/sauces');

//Initialisation de express

const app = express();

//Import du module path

const path = require('path');

//Import du module express-rate-limit

const rateLimit = require('express-rate-limit');

//Initialisation de rate limit

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});

//Initialisation de l'URIS pour la connexion à MongoDB

const URIS = 'mongodb+srv://' + userName + ':' + userPassword + '@cluster-0.lvh0y.mongodb.net/P6_DataBase?retryWrites=true&w=majority';

//Connexion à MongoDB

mongoose.connect(URIS, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});

//Initialisation des headers

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

//Export du module app

module.exports = app;
