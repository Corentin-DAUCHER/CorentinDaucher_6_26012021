const User = require('../models/users');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const sanitized = require('sanitized');

exports.signup = (req, res, next) => {

    let j = 0;

    const email = req.body.email.toLowerCase();

    const password = req.body.password;

    sanitized(email);
    sanitized(password);

    User.find()
        .then(users => {

            if (users.length == 0) {

                console.log('Creating New User !');

                const user = new User();

                bcrypt.hash(email, 8)
                    .then(hash => {
                        user.email = hash;
                    })
                    .catch(error => {
                        console.log('Erreur lors du hash !' + error);
                        res.status(400).json({ message: 'Erreur lors du hash !', error });
                    })

                bcrypt.hash(password, 8)
                    .then(hash => {
                        user.password = hash;
                    })
                    .catch(error => {
                        console.log('Erreur lors du hash !' + error);
                        res.status(400).json({ message: 'Erreur lors du hash !', error });
                    })

                user.userId = user._id;

                user.save()
                    .then(() => res.status(201).json({ message: 'User created !' }))
                    .catch(error => {
                        res.status(400).json({ error: 'Echec de la création du user' + error })
                        console.log('Failed to create user ' + error);
                    })

            } else {

                for (i in users) {

                    const emailInDb = users[i].email;

                    bcrypt.compare(email, emailInDb)
                        .then(valid => {
                            if (valid) {
                                j++;
                            }
                        })
                }

                if (j != 1) {

                    console.log('Creating New User !');

                    const user = new User();

                    bcrypt.hash(email, 8)
                        .then(hash => {
                            user.email = hash;
                        })
                        .catch(error => {
                            console.log('Erreur lors du hash !' + error);
                            res.status(400).json({ message: 'Erreur lors du hash !', error });
                        })

                    bcrypt.hash(password, 8)
                        .then(hash => {
                            user.password = hash;
                        })
                        .catch(error => {
                            console.log('Erreur lors du hash !' + error);
                            res.status(400).json({ message: 'Erreur lors du hash !', error });
                        })

                    user.userId = user._id;

                    user.save()
                        .then(() => res.status(201).json({ message: 'User created !' }))
                        .catch(error => {
                            res.status(400).json({ error: 'Echec de la création du user' + error })
                            console.log('Failed to create user ' + error);
                        })

                } else {
                    console.log('Error with j variable !');
                    return res.status(400).json({ error: 'Email already in use !' });
                }

            }

            console.log(j);

        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ message: 'Users collection is empty !' });
        })
}

exports.login = (req, res, next) => {

    const email = req.body.email.toLowerCase();

    const password = req.body.password;

    let currentUserId = '';

    let j = 0;

    sanitized(email);
    sanitized(password);

    User.find()
        .then(users => {

            if (users.length == 0) {
                console.log('No users found !');
            }

            for (i in users) {

                const emailInDb = users[i].email;

                const userId = users[i].userId;

                bcrypt.compare(email, emailInDb)
                    .then(valid => {
                        if (!valid) {

                            console.log('Searching emails !');

                            if (i == users.length - 1) {
                                console.log('All email checked !');
                            }

                        } else if (valid) {

                            if (i == users.length - 1) {
                                console.log('All email checked !');
                            }

                            j++;

                            currentUserId = userId;

                        }

                        //here

                        if (j == 1) {

                            User.findOne({ _id: currentUserId })
                                .then(user => {
                                    if (!user) {
                                        console.log('User not found ! Error with User collection !');
                                        return res.status(400).json({ error: 'User not found !' });
                                    }

                                    console.log('User found !');

                                    bcrypt.compare(password, user.password)
                                        .then(valid => {
                                            if (!valid) {
                                                console.log('Wrong password !');
                                                return res.status(401).json({ error: 'Wrong password !' })
                                            }
                                            res.status(200).json({
                                                userId: user.userId,
                                                token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
                                            })
                                        })
                                        .catch(error => res.status(400).json({ message: 'Wrong password !', error }))
                                })
                                .catch(error => {
                                    console.log('Cant find User !' + error);
                                    res.status(400).json({ message: 'User not found !', error })
                                });

                        } else {
                            console.log('Error with j variable !');
                            return res.status(400).json({ error: 'Error with j variable !' });
                        }

                        console.log(j);

                    })
            }
        })
        .catch(error => {
            console.log('No users found !' + error);
            res.status(400).json({ message: 'No users found !', error })
        })
}