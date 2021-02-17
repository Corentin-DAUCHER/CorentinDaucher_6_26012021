const express = require('express');

const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.getAllSauces);

router.get('/:id',auth, saucesCtrl.getOneSauce);

router.put('/:id',auth, multer, saucesCtrl.modifySauce);

router.post('/',auth, multer, saucesCtrl.newSauce);

router.post('/:id/like', auth, saucesCtrl.setUserPreference);

router.delete('/:id',auth, saucesCtrl.deleteSauce);

module.exports = router;