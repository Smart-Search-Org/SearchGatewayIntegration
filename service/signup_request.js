const User = require('../models/user_model')
const validator = require('validator')

const signupRequest = async (req) => {
    let errors = {};
    let hasErrors = false;
    const {email, password, confirm_password} = req.body

    if(validator.isEmpty(email)) {
        errors.email = "Email is required."
    }

    if (!validator.isEmail(email)) {
        errors.email = "Email not valid."
    }

    const exists = await User.findOne({ email })

    if(exists) {
        errors.email = "Email already in exist."
    }

    if(validator.isEmpty(password)) {
        errors.password = "Password is required."
    }

    if(!validator.matches(password, confirm_password)){
        errors.password = "Password and Confirm Password does not match."
    }

    if(Object.keys(errors).length > 0) {
        hasErrors = true;
    }

    return {
        hasErrors: hasErrors,
        errors:errors
    }
}

module.exports = signupRequest