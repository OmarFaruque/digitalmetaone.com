const express = require('express');
const userController = require('../controllers/user');

const authentication = require('../middelware/auth');

const router = express.Router();

router.get('/sign_up/:underId/:side', userController.getSignUp);

router.post('/sign_up', userController.postSignUp);

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

router.get('/sign_up', userController.getSignUpPage);

router.post('/change-password', authentication.authanticate, userController.changePassword);

router.get('/get-info', authentication.authanticate, userController.getInfo);



module.exports = router;