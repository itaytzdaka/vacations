const Joi=require("joi");
class Vacation {

    constructor(vacationId, description, destination, img ,startingDate, endingDate, price) {
        this.vacationId = vacationId;
        this.description = description;
        this.destination = destination;
        this.img = img;
        this.startingDate = startingDate;
        this.endingDate = endingDate;
        this.price=price;
    }

    validatePost() {
        const result = Joi.validate(this, Vacation.#postValidationSchema, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

    validatePut() {
        const result = Joi.validate(this, Vacation.#putValidationSchema, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }



    static #postValidationSchema = {
        vacationId: Joi.optional(),
        description: Joi.string().required().min(3).max(200).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing description"
                        break;
                    case "any.empty": err.message = "description can't be an empty"
                        break;
                    case "string.min": err.message = "description must be minimum 3 chars"
                        break;
                    case "string.max": err.message = "description must be maximum 200 chars"
                        break;
                }
            }
            return errors;
        }),
        destination:Joi.string().required().min(3).max(50).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing destination"
                        break;
                    case "any.empty": err.message = "destination can't be an empty"
                        break;
                    case "string.min": err.message = "destination must be minimum 3 chars"
                        break;
                    case "string.max": err.message = "destination must be maximum 50 chars"
                        break;
                }
            }
            return errors;
        }),
        img: Joi.optional(),
        startingDate: Joi.string().required().min(3).max(100),
        endingDate: Joi.string().required().min(3).max(100),
        price: Joi.number().min(0).max(50000)

    };



    static #putValidationSchema = {
        vacationId: Joi.number().required().min(0),
        description: Joi.string().required().min(3).max(200).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing description"
                        break;
                    case "any.empty": err.message = "description can't be an empty"
                        break;
                    case "string.min": err.message = "description must be minimum 3 chars"
                        break;
                    case "string.max": err.message = "description must be maximum 200 chars"
                        break;
                }
            }
            return errors;
        }),
        destination:Joi.string().required().min(3).max(50).regex(/^[A-Z].*$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing destination"
                        break;
                    case "any.empty": err.message = "destination can't be an empty"
                        break;
                    case "string.min": err.message = "destination must be minimum 3 chars"
                        break;
                    case "string.max": err.message = "destination must be maximum 50 chars"
                        break;
                    case "string.regex.base": err.message = "destination must start with a capital letter"
                        break;
                }
            }
            return errors;
        }),
        img: Joi.string().optional(),
        startingDate: Joi.string().required().min(3).max(100),
        endingDate: Joi.string().required().min(3).max(100),
        price: Joi.number().min(0).max(50000)
    };
}

module.exports = Vacation;