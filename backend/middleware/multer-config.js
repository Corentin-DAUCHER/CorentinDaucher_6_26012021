//Import du module multer pour la gestion des fichiers entrant

const multer = require('multer');

//Initialisation du MIME_TYPES qui seront pris en charge pour l'upload de fichiers

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Initialisation de storage

const storage = multer.diskStorage({

    //Initialisation de la destination des fichiers où ils seront stocké

    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    //Initialisation du nom de fichier qui sera stocké

    filename: (req, file, callback) => {

        //Prend le nom du fchier original et rempalce les espaces par des '_'

        const name = file.originalname.split(' ').join('_');

        //Initialisation de l'extension du fichier

        const extension = MIME_TYPES[file.mimetype];

        //Renvoie du fichier avec le name + la date actuelle + l'extension

        callback(null, name + Date.now() + '.' + extension);
    }
});

//Export du module

module.exports = multer({storage: storage}).single('image');