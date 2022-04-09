const Joi = require("joi");

class User {
    constructor(firstName, lastName, userName, password, isAdmin) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    validatePostOrPut() {
        const result = Joi.validate(this, User.#postValidationSchema, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }



    static #postValidationSchema = {
        firstName: Joi.string().required().min(2).max(10).regex(/^[A-Z].*$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing First Name"
                        break;
                    case "any.empty": err.message = "First Name can't be an empty"
                        break;
                    case "string.min": err.message = "First Name must be minimum 2 chars"
                        break;
                    case "string.max": err.message = "First Name must be maximum 10 chars"
                        break;
                    case "string.regex.base": err.message = "First Name must start with a capital letter"
                        break;
                }
            }
            return errors;
        }),
        lastName: Joi.string().required().min(2).max(10).regex(/^[A-Z].*$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing Last Name"
                        break;
                    case "any.empty": err.message = "Last Name can't be an empty"
                        break;
                    case "string.min": err.message = "Last Name must be minimum 2 chars"
                        break;
                    case "string.max": err.message = "Last Name must be maximum 10 chars"
                        break;
                    case "string.regex.base": err.message = "Last Name must start with a capital letter"
                        break;
                }
            }
            return errors;
        }),
        userName: Joi.string().required().min(2).max(15).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing User Name"
                        break;
                    case "any.empty": err.message = "User Name can't be an empty"
                        break;
                    case "string.min": err.message = "User Name must be minimum 2 chars"
                        break;
                    case "string.max": err.message = "User Name must be maximum 15 chars"
                        break;
                }
            }
            return errors;
        }),
        password: Joi.string().required().min(6).max(50).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing password"
                        break;
                    case "any.empty": err.message = "Password Name can't be an empty"
                        break;
                    case "string.min": err.message = "Password must be minimum 6 chars"
                        break;
                    case "string.max": err.message = "Password must be maximum 50 chars"
                        break;
                }
            }
            return errors;
        }),
        isAdmin: Joi.number().min(0).max(1)
    };
}


module.exports = User;