const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const signupRequest = require('../service/Auth/signup_request');
const loginRequest = require('../service/Auth/login_request');
const {post} = require("axios");
const router = express.Router();

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        const validation = await signupRequest.validate(req);
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

        const validation = await loginRequest.validate(req);
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

router.get('/me', async (req, res) => {
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

router.post('/keycloak-login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ error: 'Missing username or password' });

    try {
        // Request token from Keycloak
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', "search-gateway");
        params.append('client_secret', "v0O36ZmVqPBoXYFc16mcMHmDaYDvpFZu");
        params.append('username', username);
        params.append('password', password);

        const tokenResponse = await post(
            `http://keycloak-service.smart-search.svc.cluster.local:80/realms/smart-search/protocol/openid-connect/token`,
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // Return token to client
        res.status(200).json(tokenResponse.data);
    } catch (error) {
        console.error('Keycloak login error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: 'Login failed' });
    }
});

module.exports = router;
