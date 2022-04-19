const axios = require("axios");

function isHuman(request, response, next) {
    const token = request.body.captchaToken;
    console.log(token);
    next();

    // const secret = process.env.RECAPTCHA_SECRET_KEY;

    
    // const response = await fetch(
    //     `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    //     {
    //         method: "POST",
    //     }
    // );
    // const data = await response.json();
    // return data.success;
}

module.exports = isHuman;
