const jwt = require("jsonwebtoken");

function isLoggedIn(request, response, next) {

    if (!request.headers.authorization) {
        response.status(401).send("You are not logged-in");
        return;
    }

    const token = request.headers.authorization.split(" ")[1];

    // If there is not token:
    if (!token) {
        response.status(401).send("You are not logged-in");
        return;
    }

    // We have the token here - verify it:
    jwt.verify(token, config.jwt.secretKey, (err, payload) => {

        // If token expired or not legal:
        if (err) {
            // If token expired: 
            if (err.message == "jwt expired") {
                response.status(403).send("Your login session has expired");
                return;
            }

            // Token not legal:
            response.status(401).send("You are not logged-in");
            return;
        }
        const user=payload.user;


        const newToken = jwt.sign({ user }, config.jwt.secretKey, { expiresIn: "30m" });
        response.set('new-token',newToken);
        next();
    });
}

module.exports = isLoggedIn;