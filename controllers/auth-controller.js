const express = require("express");
const router = express.Router();
const authLogic = require("../vacations-logic/auth-logic");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const isAdmin = require("../middleware/is-admin");
const isHuman = require("../middleware/captcha-validate");
const errorHandler = require("../helpers/error-handler");
const svgCaptcha = require("svg-captcha");


router.get("/captcha", (request, response)=>{
    const captcha = svgCaptcha.create();
    const captchaText = captcha.text;
    const captchaImage = captcha.data;

    request.session.captchaText = captchaText;

    response.type("svg").send(captchaImage);
}); 

//POST - register a new user - http://localhost:3000/api/auth/register
router.post("/register",isHuman, async (request, response) => {
    try {        
        const userToAdd = new User(
            request.body.firstName,
            request.body.lastName,
            request.body.userName,
            request.body.password
        );


        // Validate user data: 
        const errors = userToAdd.validatePostOrPut();

        // if username already exist - return some error (400) to the client...
        if (errors) {
            response.status(400).send(errors);
            return;
        }

        //register user (not admin)
        const user = await authLogic.register(userToAdd);

        //create access and refresh token
        const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
        const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

        response.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        //return user and accessToken to the client
        response.status(201).json({ user, accessToken });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//POST - login with user name and password - http://localhost:3000/api/auth/login
router.post("/login", async (request, response) => {
    try {
        
        const credentials = request.body;
        const user = await authLogic.login(credentials);

        //if user with these credentials not exist
        if (!user) {
            response.status(401).send("Illegal username or password");
            return;
        }

        //create access and refresh token
        const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
        const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "1d" });


        response.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        //return user and accessToken to the client
        response.json({ user, accessToken });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//GET - getting all registered Users for register page - http://localhost:3000/api/auth/usersNames
router.get("/usersNames", async (request, response) => {
    try {
        const usersNames = await authLogic.getAllUsersNames();
        response.json(usersNames);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//PUT - Update FULL User - http://localhost:3000/api/auth/userName
router.put("/:userName", isAdmin, async (request, response) => {
    try {

        const { firstName, lastName, password, isAdmin } = request.body;
        const userName = request.params.userName;

        const userToUpdate = new User(firstName, lastName, userName, password, +isAdmin);

        // Validate user data 
        const errors = userToUpdate.validatePostOrPut();

        if (errors) {
            response.status(400).send(errors);
            return;
        }

        // update the user
        const updatedUser = await authLogic.updateFullUser(userToUpdate);
        if (!updatedUser) {
            response.sendStatus(404);
            return;
        }

        //delete password for security
        delete updatedUser.password;

        //return the user updated 
        response.json(updatedUser);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


//GET - getting a new accessToken - http://localhost:3000/api/auth/refresh
router.get("/refresh", (request, response) => {
    try {
        const cookies = request.cookies;

        if (!cookies?.jwt) {
            response.status(401).send("You are not logged-in");
            return;
        }
        const refreshToken = cookies.jwt;

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, payload) => {
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
            const user = payload.user;
            const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1m" });

            //return user and accessToken
            response.json({ user, accessToken });
        });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//GET - getting a new accessToken - http://localhost:3000/api/auth/logout
router.get("/logout", (request, response) => {
    try {
        const cookies = request.cookies;
        if (cookies?.jwt) {
            response.clearCookie("jwt", {httpOnly: true});
        }
        return response.sendStatus(204); //No content
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;