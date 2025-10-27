const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../../models/user_model');

class LoginRequestValidator {
    static #instance;

    constructor() {
        if (LoginRequestValidator.#instance) {
            return LoginRequestValidator.#instance;
        }
        LoginRequestValidator.#instance = this;
    }

    async validate(req) {
        let errors = {};
        const { email, password } = req.body;

        // Email checks
        if (!email || validator.isEmpty(email.trim())) {
            errors.email = 'Email is required.';
        } else if (!validator.isEmail(email)) {
            errors.email = 'Email not valid.';
        }

        // Only try to find the user if no email validation errors
        let user = null;
        if (!errors.email) {
            user = await User.findOne({ email });
            if (!user) {
                errors.email = 'Incorrect email.';
            }
        }

        if (!password || validator.isEmpty(password)) {
            errors.password = 'Password is required.';
        } else if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.password = 'Incorrect password.';
            }
        }

        return {
            hasErrors: Object.keys(errors).length > 0,
            errors
        };
    }

    static getInstance() {
        return new LoginRequestValidator();
    }
}

module.exports = LoginRequestValidator.getInstance();
