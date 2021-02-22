const User = require('../models/users');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const sanitized = require('sanitized');

//SIGNUP

exports.signup = (req, res, next) => {

    const email = req.body.email.toLowerCase();

    const password = req.body.password;

    sanitized(email);
    sanitized(password);

    signup(res, email, password);

}

//LOGIN

exports.login = (req, res, next) => {

    const email = req.body.email.toLowerCase();

    const password = req.body.password;

    sanitized(email);
    sanitized(password);

    login(res, email, password);
    
}

//SIGN UP

function signup(res, email, password) {

    User.find()
        .then(users => {

            if (isUsersEmpty(users)) {

                createUser(res, email, password);

            } else {

                if (isEmailAlreadyInUse(users, email)) {

                    console.log('Email already in use !');
                    return res.status(400).json({ error: 'Email already in use !' });

                } else {

                    createUser(res, email, password);

                }

            }

        })
        .catch(error => {

            console.log('Error with USERS Collection !' + error);
            res.status(400).json({ error: 'Error with USERS Collection !', error })

        })

};

//LOGIN

function login(res, email, password){

    User.find()
    .then(users => {

        if(isUsersEmpty(users)){

            console.log('Users collection is empty !');
            return res.status(400).json({error: 'Users collection is empty !'});

        }else{

            if(isEmailAlreadyInUse(users, email)){

                

            }

        }

    })
    .catch(error => {

        console.log('Error with USERS Collection !' + error);
        res.status(400).json({ error: 'Error with USERS Collection !', error })

    })

};

//IS USERS EMPTY

function isUsersEmpty(users) {

    if (users.length == 0) {

        return true;

    } else {

        return false;

    }

};

//CREATE USER

function createUser(res, email, password) {

    const user = new User();

    user.userId = user._id;

    bcrypt.hash(email, 8)
        .then(hash => {
            user.email = hash;

            bcrypt.hash(password, 8)
                .then(hash => {
                    user.password = hash;

                    user.save()
                        .then(() => res.status(201).json({ message: 'User created !' }))
                        .catch(error => {
                            res.status(400).json({ error: 'Echec de la création du user' + error })
                            console.log('Echec de la création du user' + error);
                        })

                })
                .catch(error => {
                    console.log('Erreur lors du hash !' + error);
                    res.status(400).json({ message: 'Erreur lors du hash !', error });
                })

        })
        .catch(error => {
            console.log('Erreur lors du hash !' + error);
            res.status(400).json({ message: 'Erreur lors du hash !', error });
        })
};

//IS EMAIL ALREADY IN USE

function isEmailAlreadyInUse(users, email) {

    let j = 0;

    for (i in users) {

        const emailInDb = users[i].email;

        bcrypt.compare(email, emailInDb)
            .then((valid) => {

                if (valid) {

                    j = 1;

                }

                if (j == 1) {

                    return true;

                }

                if (i == users.length - 1 && j == 0) {

                    return false;

                }

            })

    }

};