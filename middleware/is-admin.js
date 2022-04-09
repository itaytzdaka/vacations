const jwt = require("jsonwebtoken");

function isAdmin(request, response, next) {


    const token = request.headers.authorization.split(" ")[1];

    if (!token) {
        response.status(401).send("You are not logged-in");
        return;
    }

    jwt.verify(token, config.jwt.ACCESS_TOKEN_SECRET, (err, payload) => {

        if (err) {
            if (err.message == "jwt expired") {
                response.status(403).send("Your login session has expired");
                return;
            }
    
        }

        const user=payload.user;

        if(!user.isAdmin)
        {
            response.status(403).send("You are not admin!");
        }

        next();

    });
}

module.exports = isAdmin;

