const express = require('express');
const router = express.Router();
const User = require('./../models/Auth.model');
const createErrors = require('http-errors');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken } = require('../helpers/jwt_helper');

router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authSchema.validateAsync(req.body);
        

        const userExited = await User.findOne({email: result.email});
        if (userExited) {
            throw createErrors.Conflict(`${email} is already register`);
        }
        const user = new User(result);
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id);

        res.send({accessToken});
        // return savedUser;

    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422;
        }
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({email: result.email});

        if (!user) {
            throw createErrors.NotFound("Email doesn't exit");
        }

        const isMatch = await user.isValidPassword(result.password);

        if (!isMatch) {
            throw createErrors.Unauthorized('Username or password is incorrect');
        }
        const accessToken = await signAccessToken(user.id);
        res.send({ accessToken });
    } catch(error) {
        if (error.isJoi === true) {
            return next(createErrors.BadRequest('Invalid email or password'));
        }
        next(error);
    }
})

router.post('/refresh-token', async (req, res, next) => {
    console.log('refresh-token')
})

router.post('/logout', async (req, res, next) => {
    console.log('logout')
})

module.exports = router;