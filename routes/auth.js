const express = require('express');

// Custom File import 
const AuthController = require('../controllers/auth'); 

const _ = express.Router();


//  Auth routes 
_.get('/signup', AuthController.signupPage);
_.post('/signup', AuthController.postSignup);
_.get('/login', AuthController.loginPage); 
_.post('/login', AuthController.postLogin);
_.post('/logout', AuthController.logout);
_.get('/reset', AuthController.resetPassword);
_.post('/reset', AuthController.processReset);
_.get('/reset/:token', AuthController.newPassword);
_.post('/update-password', AuthController.saveNewPassword);


module.exports = _;