const Joi = require("joi");

class Purchase {
    constructor(purchaseId, userName, vacationId, tickets, totalPrice, priceForTicket, date) {
        this.purchaseId = purchaseId;
        this.userName = userName;
        this.vacationId = vacationId;
        this.tickets = tickets;
        this.totalPrice = totalPrice;
        this.priceForTicket = priceForTicket;
        this.date = date;
    }

    validatePostOrPut() {
        const result = Joi.validate(this, Purchase.#postValidationSchema, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }



    static #postValidationSchema = {
        tickets: Joi.number().required().min(1).max(11).error(errors => {
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
        totalPrice: Joi.number().required().min(1).max(999999).error(errors => {
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
        })
    };


}


module.exports = Purchase;