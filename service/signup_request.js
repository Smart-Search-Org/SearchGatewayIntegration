const validator = require('validator');
const User = require('../models/user_model');

class SignupRequestValidator {
    static #instance;

    constructor() {
        if (SignupRequestValidator.#instance) {
            return SignupRequestValidator.#instance;
        }
        SignupRequestValidator.#instance = this;
    }

    async validate(req) {
        let errors = {};
        const { email, password, confirm_password } = req.body;

        if (!email || validator.isEmpty(email.trim())) {
            errors.email = 'Email is required.';
        } else if (!validator.isEmail(email)) {
            errors.email = 'Email not valid.';
        } else {
            const exists = await User.findOne({ email });
            if (exists) {
                errors.email = 'Email already exists.';
            }
        }

        if (!password || validator.isEmpty(password)) {
            errors.password = 'Password is required.';
        } else if (password !== confirm_password) {
            errors.password = 'Password and Confirm Password do not match.';
        }

        return {
            hasErrors: Object.keys(errors).length > 0,
            errors,
        };
    }

    static getInstance() {
        return new SignupRequestValidator();
    }
}

module.exports = SignupRequestValidator.getInstance();
