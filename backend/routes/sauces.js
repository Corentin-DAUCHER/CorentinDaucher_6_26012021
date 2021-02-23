//Import du module express

const express = require('express');

//Initialisation du router

const router = express.Router();

//Import du controller

const saucesCtrl = require('../controllers/sauces');

//Import des middleware

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

//Initialisation des route

router.get('/', auth, saucesCtrl.getAllSauces);

router.get('/:id',auth, saucesCtrl.getOneSauce);

router.put('/:id',auth, multer, saucesCtrl.modifySauce);

router.post('/',auth, multer, saucesCtrl.newSauce);

router.post('/:id/like', auth, saucesCtrl.setUserPreference);

router.delete('/:id',auth, saucesCtrl.deleteSauce);

//Export du module

module.exports = router;