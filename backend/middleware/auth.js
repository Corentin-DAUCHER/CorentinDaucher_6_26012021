//Import du module jsonwebtoken

const jwt = require('jsonwebtoken');

//Export du module

module.exports = (req, res, next) => {

    //Essaie

    try{

        //Initialisation du token en séparant la chaine au premier espace

        const token = req.headers.authorization.split(' ')[1];

        //Initialisation et vérification du token

        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

        //Initialisation de userId

        const userId = decodedToken.userId;

        //Si le userId est présent et est différent du userId présent dans le token

        if(req.body.userId && req.body.userId !== userId){

            //Renvoie une erreur

            throw('Invalid user ID !');
        }else{

            //Passe à la suite et valide l'authentifiaction

            next()
        }
    }
    catch {
        res.status(401).json({error: new Error('Invalid request !')})
    };
};