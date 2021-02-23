//Import du module express

const express = require('express');

//Initialisation du router

const router = express.Router()

//Import du controller

const userCtrl = require('../controllers/users');

//Initialisation des route

router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

//Export du module

module.exports = router;