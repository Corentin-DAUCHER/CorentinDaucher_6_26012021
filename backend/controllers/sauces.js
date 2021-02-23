//Import du model 

const Sauce = require('../models/sauces');

//Import du mpodule fs pour la gestion des fichiers système

const fs = require('fs');

//Import du module sanitized pour les injections SQL

const sanitized = require('sanitized');

//Export des controller

//getAllSauces / GET

exports.getAllSauces = (req, res, next) => {

    //Trouve toutes les sauces de la BDD

    Sauce.find()
        .then(
            (sauces) => {
                res.status(200).json(sauces)
            }
        )
}

//getOneSauce / GET

exports.getOneSauce = (req, res, next) => {

    //Trouve une sauce via son _id envoyé dans les params de la requête

    Sauce.findById({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ message: 'Sauce not found !' }));
};

//newSauce / POST

exports.newSauce = (req, res, next) => {

    //Parse de sauce situé dans le body

    const newSauce = JSON.parse(req.body.sauce);

    //Sanitize les données de la sauce

    sanitized(newSauce.userId);
    sanitized(newSauce.name);
    sanitized(newSauce.manufacturer);
    sanitized(newSauce.description);
    sanitized(newSauce.mainPepper);
    sanitized(newSauce.imageUrl);
    sanitized(newSauce.heat);
    sanitized(newSauce.likes);
    sanitized(newSauce.dislikes);
    sanitized(newSauce.usersLiked);
    sanitized(newSauce.usersDisliked);

    //Création d'une nouvelle sauce avec les données du body de la requête

    const sauce = new Sauce({
        userId: newSauce.userId,
        name: newSauce.name,
        manufacturer: newSauce.manufacturer,
        description: newSauce.description,
        mainPepper: newSauce.mainPepper,
        imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename,
        heat: newSauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    //Sauvegarde de la sauce dans la BDD

    sauce.save()
        .then(sauce => {
            console.log('Sauce created !');
            res.status(201).json({ message: 'Sauce created !' })
        })
        .catch(error => {
            console.log('Failed to create sauce !' + error);
            res.status(400).json(error)
        })
}

//modifySauce / PUT

exports.modifySauce = (req, res, next) => {

    //Initialisation du corps de la demande suivant si un fichier a été uploadé

    const modifiedSauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
    } : { ...req.body };

    //Sanitize du body

    sanitized(modifiedSauce);

    //Mise à jour de la sauce avec les données du body modifié

    Sauce.updateOne({ _id: req.params.id }, { ...modifiedSauce, _id: req.params.id })
        .then(() => {
            console.log('Sauce modified !');
            res.status(200).json({ message: 'Sauce modified !' });
        })
        .catch(error => {
            console.log('Failed to modify sauce !' + error);
            res.status(400).json(error);
        })

};

//deleteSauce / DELETE

exports.deleteSauce = (req, res, next) => {

    //Trouve la sauce via son _id

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            //Initialisation du nom du fichier

            const filename = sauce.imageUrl.split('/images/')[1];

            //Suppression du fichiers du server

            fs.unlink('images/' + filename, () => {

                //Supression de la sauce dans la BDD

                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        console.log('Sauce deleted !')
                        res.status(200).json({ message: 'Sauce deleted !' });
                    })
                    .catch(error => {
                        console.log('Failed to delete sauce !' + error);
                        res.status(400).json({ error: 'Failed to delete sauce !', error });
                    })
            });
        })
        .catch(error => {
            console.log('Sauce not found !' + error);
            res.status(400).json({ error: 'Sauce not found', error });
        })
};

//setUserPreference / POST

exports.setUserPreference = (req, res, next) => {

    //Initialisation de userId

    const userId = req.body.userId;

    //Sanitize du userId

    sanitized(userId);

    //Parse du like

    const like = JSON.parse(req.body.like);

    //Vérification de like si c'est bien un nombre

    if (like == isNaN) {
        return res.status(400).json({ message: 'let like is not a number !' });
    }

    //Initialisation de sauceId via la valeur envoyé en paramètre

    const sauceId = req.params.id;

    //Trouve la sauce via son id

    Sauce.findById({ _id: sauceId })
        .then(sauce => {

            //Initialisation des données de la sauce

            let usersLiked = sauce.usersLiked;
            let usersDisliked = sauce.usersDisliked;
            let likes = sauce.likes;
            let dislikes = sauce.dislikes;

            //Switch du like

            switch (like) {

                //Cas 1 pour un like

                //Ajout de userId dans le tableau usersLiked et incrémentation de likes

                case 1:
                    usersLiked.push(userId);
                    likes++;
                    break;

                //Cas 0 pour l'annulation d'un like ou dislike

                case 0:

                    //Vérification de la taille du tableau usersLiked

                    if (usersLiked.length > 0) {

                        //Boucle for pour le tableau usersLiked

                        for (i in usersLiked) {

                            //Initialisation de userIdInTab qui représente le userId stocké dans le tableau

                            const userIdInTab = usersLiked[i];

                            //Vérification de la correspondance du userId actuel et de celui stocké dans le tableau

                            if (userIdInTab == userId) {

                                //Suppression du userId dans le tableau

                                usersLiked.splice(i, 1);

                                //Décrémentation du likes

                                likes--;
                            }
                        }
                    }

                    //Vérification de la taille du tableau usersDisliked

                    if (usersDisliked.length > 0) {

                        //Boucle for pour le tableau usersDisliked

                        for (i in usersDisliked) {

                            //Initialisation de userIdInTab qui représente le userId stocké dans le tableau

                            const userIdInTab = usersDisliked[i];

                            //Vérification de la correspondance du userId actuel et de celui stocké dans le tableau

                            if (userIdInTab == userId) {

                                //Suppression du userId dans le tableau

                                usersDisliked.splice(i, 1);

                                //Décrémentation du dislikes

                                dislikes--;
                            }
                        }
                    }
                    break;

                //Cas -1 pour un dislike

                //Ajout de userId dans le tableau usersDisliked et incrémentation de dislikes

                case -1:
                    usersDisliked.push(userId);
                    dislikes++;
                    break;

                //Cas par défaut

                default:
                    console.log('Error with like variable !');
                    break;
            }

            //Mise à jour des données de la sauce

            Sauce.updateOne({ _id: sauceId }, {
                _id: sauceId,
                likes: likes,
                dislikes: dislikes,
                usersLiked: usersLiked,
                usersDisliked: usersDisliked
            }, { new: true })
                .then(() => {
                    console.log('Sauce updated !');
                    res.status(200).json({ message: 'Sauce updated !' });
                })
                .catch(error => {
                    console.log('Failed to update sauce !' + error);
                    res.status(400).json({ message: 'Failed to update sauce !' + error });
                })

        })
        .catch(error => {
            console.log('Sauce not found !' + error);
            res.status(400).json(error);
        })

};