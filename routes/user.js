const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const signupRequest = require('../service/signup_request');
const loginRequest = require('../service/login_request');
const authApi = require('../middlewares/auth_app');
const router = express.Router();

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        const validation = await signupRequest(req);
        if (validation.hasErrors) {
            return res.status(422).json(validation.errors);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({ email, password: hash });
        const token = createToken(user._id);

        res.status(200).json({ email, token });
    } catch (error) {
        console.error('Error in /signup route:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;

        const validation = await loginRequest(req);
        if (validation.hasErrors) {
            return res.status(422).json(validation.errors);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        console.error('Error in /login route:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.get('/me', authApi, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select(['_id', 'email']);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in /me route:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
