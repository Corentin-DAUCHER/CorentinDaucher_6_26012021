const multer = require('multer');
const multerConfig = require('../middleware/multer-config');
const Sauce = require('../models/sauces');
const sanitized = require('sanitized');

exports.getAllSauces = (req,res, next) => {
    Sauce.find()
    .then(
        (sauces) => {
            res.status(200).json(sauces)
        }
    )
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findById({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({message: 'Sauce not found !'}));
};

exports.newSauce = (req, res, next) => {
    
    const newSauce = JSON.parse(req.body.sauce);

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
    sauce.save()
    .then(sauce => {
        console.log('Sauce created !');
        res.status(201).json({message: 'Sauce created !'})
    })
    .catch(error => {
        console.log('Failed to create sauce !' + error);
        res.status(400).json(error)
    })
}

exports.modifySauce = (req, res, next) => {

    const modifiedSauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
    } : {...req.body};

    sanitized(modifiedSauce);

    Sauce.updateOne({_id: req.params.id}, {...modifiedSauce, _id: req.params.id})
    .then(() => {
        console.log('Sauce modified !');
        res.status(200).json({message: 'Sauce modified !'});
    })
    .catch(error => {
        console.log('Failed to modify sauce !' + error);
        res.status(400).json(error);
    })

};

exports.deleteSauce = (req, res, next) => {

    Sauce.deleteOne({_id: req.params.id})
    .then(() => {
        console.log('Sauce deleted !');
        res.status(200).json({message: 'Sauce deleted !'});
    })
    .catch(error => res.status(400).json(error));
};

exports.setUserPreference = (req, res, next) => {

    const userId = req.body.userId;

    sanitized(userId);

    const like = JSON.parse(req.body.like);

    if(like == isNaN){
        return res.status(400).json({message: 'let like is not a number !'});
    }

    const sauceId = req.params.id;

    Sauce.findById({_id: sauceId})
    .then(sauce => {

        let usersLiked = sauce.usersLiked;
        let usersDisliked = sauce.usersDisliked;
        let likes = sauce.likes;
        let dislikes = sauce.dislikes; 

        switch (like) {
            case 1:
                usersLiked.push(userId);
                likes++;
                break;
            case 0:
                if(usersLiked.length > 0){
                    for(i in usersLiked){
                        const userIdInTab = usersLiked[i];
                        if(userIdInTab == userId){
                            usersLiked.splice(i, 1);
                            likes--;
                        }
                    }
                }
                if(usersDisliked.length > 0){
                    for(i in usersDisliked){
                        const userIdInTab = usersDisliked[i];
                        if(userIdInTab == userId){
                            usersDisliked.splice(i, 1);
                            dislikes--;
                        }
                    }
                }
                break;
            case -1:
                usersDisliked.push(userId);
                dislikes++;
                break;
            default:
                console.log('Error with like variable !');
                break;
        }

        Sauce.updateOne({_id: sauceId}, {
            _id: sauceId,
            likes: likes,
            dislikes: dislikes,
            usersLiked: usersLiked,
            usersDisliked: usersDisliked
        }, {new: true})
        .then(() => {
            console.log(likes, usersLiked, dislikes, usersDisliked);
            console.log('Sauce updated !');
            res.status(200).json({message: 'Sauce updated !'});
        })
        .catch(error => {
            console.log('Failed to update sauce !' + error);
            res.status(400).json({message: 'Failed to update sauce !' + error});
        })

    })
    .catch(error => {
        console.log('Sauce not found !' + error);
        res.status(400).json(error);
    })
    
};