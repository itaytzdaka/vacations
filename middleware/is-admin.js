const jwt = require("jsonwebtoken");

function isAdmin(request, response, next) {


    const token = request.headers.authorization.split(" ")[1];

    jwt.verify(token, config.jwt.secretKey, (err, payload) => {

        const user=payload.user;

        if(!user.isAdmin)
        {
            response.status(403).send("You are not admin!");
        }

        next();

    });
}

module.exports = isAdmin;

