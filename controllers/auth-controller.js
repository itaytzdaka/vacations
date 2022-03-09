const express = require("express");
const authLogic = require("../vacations-logic/auth-logic");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const router = express.Router();
const verifyLoggedIn = require("../middleware/is-logged-in");
const isAdmin = require("../middleware/is-admin");

router.post("/register", async (request, response) => {
    try {
        const userToAdd = new User(
            request.body.firstName,
            request.body.lastName,
            request.body.userName,
            request.body.password,
            0); // isAdmin

        // if username already exist - return some error (400) to the client...

        // Validate vacation data: 
        const errors = userToAdd.validatePostOrPut();

        if (errors) {
            response.status(400).send(errors);
            return;
        }
        const user = await authLogic.register(userToAdd);
        const token = jwt.sign({ user }, config.jwt.secretKey, { expiresIn: "30m" });

        response.status(201).json({ user, token });
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/login", async (request, response) => {
    try {
        const credentials = request.body;  
 
        const user = await authLogic.login(credentials);
        if (!user) {
            response.status(401).send("Illegal username or password");
            return;
        }
        const token = jwt.sign({ user }, config.jwt.secretKey, { expiresIn: "30m" });
        response.json({ user, token });
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

//get All Users Names
router.get("/usersNames", async (request, response) => {
    try {
        const usersNames = await authLogic.getAllUsersNames();
        response.json(usersNames);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Update full User: 
router.put("/:userName",isAdmin, async (request, response) => {
    try {
        const userToUpdate = new User(request.body.firstName, request.body.lastName, request.params.userName, request.body.password, +request.body.isAdmin);
        const errors = userToUpdate.validatePostOrPut();

        if (errors) {
            response.status(400).send(errors);
            return;
        }

        const updatedUser = await authLogic.updateFullUser(userToUpdate);
        if(!updatedUser) {
            response.sendStatus(404);
            return;
        }

        response.json(updatedUser);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});



module.exports = router;