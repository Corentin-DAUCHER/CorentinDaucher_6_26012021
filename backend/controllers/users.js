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

                if(isPasswordCorrect(users, email, password)){

                    sendResponse(users, email, res);

                }else{

                    console.log('Wrong password !');
                    return res.status(400).json({error: 'Wrong password !'});

                }

            }else{

                console.log('No users with this email !');
                return res.status(400).json({error: 'No users with this email !'});

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

//GET USER INDEX

function getUserIndex(users, email, res) {

    let j = 0;

    for(i in users){

        const emailInDb = users[i].email;

        bcrypt.compare(email, emailInDb)
        .then(valid => {

            if(valid){

                j = i;

                return j;
            }

        })
        .catch(error => {

            console.log('Error with Bcrypt compare !' + error);
            return res.status(400).json({error: 'Error with Bcrypt compare !', error});

        })

    }

};

//IS PASSWORD CORRECT

function isPasswordCorrect(users, email, password, res){

    const i = getUserIndex(users, email, res);

    const passwordInDb = users[i].password;

    bcrypt.compare(password, passwordInDb)
    .then(valid => {

        if(valid){

            return true;    

        }else{

            return false;

        }

    })

};

//SEND RESPONSE

function sendResponse(users, email, res){

    const i = getUserIndex(users, email, res);

    const userId = users[i]._id;

    return res.status(200).json({

        userId: userId,
        token: jwt.sign(
            {userId: userId},
            'RANDOM_TOKEN_SECRET',
            {expiresIn: '24h'}
        )

    })

};