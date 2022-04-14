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
        
        purchaseId: Joi.optional(),

        userName: Joi.string().required().min(2).max(15).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing User Name"
                        break;
                    case "any.empty": err.message = "User Name can't be empty"
                        break;
                    case "string.min": err.message = "User Name must be minimum 2 chars"
                        break;
                    case "string.max": err.message = "User Name must be maximum 15 chars"
                        break;
                }
            }
            return errors;
        }),
        vacationId: Joi.number().required().min(1).max(99999),
        tickets: Joi.number().required().min(1).max(10).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing Tickets"
                        break;
                    case "any.empty": err.message = "Tickets number can't be empty"
                        break;
                    case "string.min": err.message = "Tickets number must be minimum 1"
                        break;
                    case "string.max": err.message = "Tickets number must be maximum 11"
                        break;
                }
            }
            return errors;
        }),
        priceForTicket: Joi.number().required().min(1).max(10000).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing Price for ticket"
                        break;
                    case "any.empty": err.message = "Price for ticket can't be empty"
                        break;
                    case "string.min": err.message = "Price for ticket must be minimum 1"
                        break;
                    case "string.max": err.message = "Price for ticket must be maximum 10000"
                        break;
                }
            }
            return errors;
        }),
        totalPrice: Joi.number().required().min(1).max(50000).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "Missing total Price"
                        break;
                    case "any.empty": err.message = "Total price can't be empty"
                        break;
                    case "string.min": err.message = "Total price must be minimum 1"
                        break;
                    case "string.max": err.message = "Total price must be maximum 50000"
                        break;
                }
            }
            return errors;
        }),
        date: Joi.string().required().min(1).max(100)
    };


}


module.exports = Purchase;