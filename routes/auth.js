const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator/check');
const bcrypt = require('bcrypt')

const User = require('../models/user')
const authController = require('../controllers/auth')

const router = express.Router();

//user is created once and put is used for creating or overwriting existing data
router.put('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email').custom(
        (value, { req }) => {
            return User.findOne({email: value}).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email adress already exists!');
                }
            })
        }).normalizeEmail(),

        body('password').trim().isLength({ min: 5 }),
        body('username').trim().not().isEmpty()
], 
 /*  #swagger.tags = ['Auth']
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/SignupModel" }
    } */
    authController.signup) 

router.post('/login', 
 /*  #swagger.tags = ['Auth']
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/LoginModel" }
    } */
    authController.login)

const registerAdmin = (req, res, next) => {
    
    // const username = "Administrator";
    // const email = "admin@email.com";
    // const password = "test12";
    // const role = "admin"
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role

    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            role: role
        });
        return user.save();
    }).then(result => {
        res.status(201).json({message: 'Admin created!', user: result})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    })
}

router.post('/seed', registerAdmin);

module.exports = router