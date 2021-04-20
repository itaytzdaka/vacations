const express = require("express");
const vacationsLogic = require("../vacations-logic/vacations-logic");
const isLoggedIn = require("../middleware/is-logged-in");
const isAdmin = require("../middleware/is-admin");
const Vacation = require("../models/vacation-model");

const router = express.Router();

router.use(isLoggedIn);

//get all vacations
router.get("/", async (request, response) => {
    try {
        const vacations = await vacationsLogic.getAllVacations();
        response.json(vacations);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

//get one vacation
router.get("/:id", async(request, response) => {
    try {
        const id = +request.params.id;
        const vacation =await vacationsLogic.getOneVacation(id);
        if (!vacation) {
            response.sendStatus(404);
            return;
        }
        response.json(vacation);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

//add vacation
router.post("/",isAdmin, async (request, response) => {
    try {
        const v = request.body;
        const vacation = new Vacation(undefined, v.description, v.destination, v.img, v.startingDate, v.endingDate, v.price);

        // Validate vacation data: 
        const errors = vacation.validatePost();

        if(errors) {
            response.status(400).send(errors);
            return;
        }

        const addedVacation =await vacationsLogic.addVacation(vacation);
        if (!addedVacation) {
            response.sendStatus(404);
            return;
        }
        response.json(addedVacation);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

//update full vacation
router.put("/:id",isAdmin, async (request, response) => {
    try {
        const id = +request.params.id;
        const v = request.body;
        const vacation = new Vacation(id, v.description, v.destination, v.img, v.startingDate, v.endingDate, v.price);

        const errors = vacation.validatePut();

        if(errors) {
            response.status(400).send(errors);
            return;
        }

        const updatedVacation =await vacationsLogic.updateFullVacation(vacation);
        if (!updatedVacation) {
            response.sendStatus(404);
            return;
        }
        response.json(updatedVacation);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});


// DELETE vacation
router.delete("/:id",isAdmin, (request, response) => {
    try {
        const id = +request.params.id;
        vacationsLogic.deleteVacation(id);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;