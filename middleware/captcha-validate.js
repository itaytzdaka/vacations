const axios = require("axios");
const errorHandler = require("../helpers/error-handler");

async function isHuman(request, response, next) {

    const token = request.body.captchaToken;
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    try {
        const res = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`);
        const human= res.data.success;
    
        if(!human){
            response.status(400).send("You are not fooling me, bot!");
        }
        else{
            next();
        }

    } catch (error) {
        response.status(500).send(errorHandler.getError(error));
    }
}

module.exports = isHuman;
