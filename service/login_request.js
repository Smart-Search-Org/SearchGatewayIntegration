const validator = require('validator')
const bcrypt = require('bcrypt')
const User = require('../models/user_model')

const loginRequest = async (req) => {
    let errors = {};
    let hasErrors = false;
    const {email, password} = req.body

    if(validator.isEmpty(email)) {
        errors.email = "Email is required."
    }

    if (!validator.isEmail(email)) {
        errors.email = "Email not valid."
    }

    const user = await User.findOne({ email })
    if (!user) {
        errors.email = "Incorrect email."
    }

    if(validator.isEmpty(password)) {
        errors.password = "Password is required."
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        errors.password = "Incorrect password."
    }

    if(Object.keys(errors).length > 0) {
        hasErrors = true;
    }

    return {
        hasErrors: hasErrors,
        errors:errors
    }
}

module.exports = loginRequest