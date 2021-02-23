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

//SIGN UP FUNCTION

function signup(res, email, password) {

    const user = new User();

    user.userId = user._id;

    user.email = email;

    bcrypt.hash(password, 8)
    .then(hash => {

        user.password = hash;

    })
    .catch(error => {

        console.log('Error with Bcrypt hash !' + error);
        res.status(400).json({error: 'Error with Bcrypt hash !', error});

    })

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

    User.findOne({email: email})
    .then(user => {

        const passwordInDb = user.password;

        bcrypt.compare(password, passwordInDb)
        .then(valid => {

            if(!valid){

                console.log('Wrong password !');
                res.status(401).json({error: 'Wrong password !'});

            }

            console.log('Connected as ' + user.email);

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

    const userId = user._id;

    return res.status(200).json({

        userId: userId,
        token: jwt.sign(
            {userId: userId},
            'RANDOM_TOKEN_SECRET',
            {expiresIn: '24h'}
        )

    })

};