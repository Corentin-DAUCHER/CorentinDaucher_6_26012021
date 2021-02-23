//Import du model

const User = require('../models/users');

//Import du module jsonwebtoken pour la gestion des token

const jwt = require('jsonwebtoken');

//Import du module Bcrypt pour hasher le mot de passe

const bcrypt = require('bcrypt');

//Import du module sanitize

const sanitized = require('sanitized');

//SIGNUP

exports.signup = (req, res, next) => {

    //Initialisation de l'email et du password

    const email = req.body.email.toLowerCase();

    const password = req.body.password;

    //sanitize des données

    sanitized(email);
    sanitized(password);

    //Appel de la fonction signup

    signup(res, email, password);

}

//LOGIN

exports.login = (req, res, next) => {

    //Initialisation de l'email et du password

    const email = req.body.email.toLowerCase();

    const password = req.body.password;

    //sanitize des données

    sanitized(email);
    sanitized(password);

    //Appel de la fonction login

    login(res, email, password);
    
}

//SIGN UP FUNCTION

function signup(res, email, password) {

    //Création d'un user

    const user = new User();

    //Initialisation de userId qui prend la valeur de user._id

    user.userId = user._id;

    //Initialisation de user.email avec email

    user.email = email;

    //Hashage du password

    bcrypt.hash(password, 8)
    .then(hash => {

        //Initialisation de user.password avec le hash

        user.password = hash;

    })
    .catch(error => {

        console.log('Error with Bcrypt hash !' + error);
        res.status(400).json({error: 'Error with Bcrypt hash !', error});

    })

    //Sauvegarde du user dans la BDD

    user.save()
    .then(() => {

        console.log('User created !');
        res.status(201).json({message: 'User created !'});

    })
    .catch(error => {

        console.log('Failed to create user !' + error);
        res.status(400).json({error: 'Failed to create user !', error})

    })

};

//LOGIN FUNCTION

function login(res, email, password){

    //Trouve le user via son email

    User.findOne({email: email})
    .then(user => {

        //Initialisation de passwordInDb à partir de user.password

        const passwordInDb = user.password;

        //Comparaison du password dans le body et du password dans la BDD

        bcrypt.compare(password, passwordInDb)
        .then(valid => {

            //Si le password ne correspond pas

            if(!valid){

                console.log('Wrong password !');
                return res.status(401).json({error: 'Wrong password !'});

            }

            //Log du compte connecté

            console.log('Connected as ' + user.email);

            //Appel de la fonction sendResponse

            sendResponse(user, res);

        })

    })
    .catch(error => {

        console.log('User not found !' + error);
        res.status(400).json({error: 'User not found !', error});

    })

};

//SEND RESPONSE

function sendResponse(user, res){

    //Initialisation de userId avec user._id

    const userId = user._id;

    //Retourne le userId et le token généré via le module jsonwebtoken avec un temps d'expiration de 24h

    return res.status(200).json({

        userId: userId,
        token: jwt.sign(
            {userId: userId},
            'RANDOM_TOKEN_SECRET',
            {expiresIn: '24h'}
        )

    })

};