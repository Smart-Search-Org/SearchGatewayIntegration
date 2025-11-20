const jwt = require('jsonwebtoken')
const User = require('../models/user_model')


const authApi = async (req, res, next) => {
    const { authorization } = req.headers;
    console.log('[authApi] Incoming request headers:', req.headers);

    if (!authorization) {
        console.error('[authApi] No Authorization header found');
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const tokenParts = authorization.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        console.error('[authApi] Malformed Authorization header:', authorization);
        return res.status(401).json({ error: 'Malformed authorization header' });
    }

    const token = tokenParts[1];
    console.log('[authApi] Token extracted:', token);

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('[authApi] Token decoded successfully:', decoded);

        req.user = await User.findOne({ _id: decoded._id }).select('_id');
        if (!req.user) {
            console.error('[authApi] User not found for _id:', decoded._id);
            return res.status(401).json({ error: 'User not found' });
        }

        console.log('[authApi] User attached to request:', req.user);
        next();

    } catch (error) {
        console.error('[authApi] Token verification failed:', error.message);
        res.status(401).json({ error: 'Request is not authorized', details: error.message });
    }
};


module.exports = authApi
