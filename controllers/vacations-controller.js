const express = require("express");
const vacationsLogic = require("../vacations-logic/vacations-logic");
const isLoggedIn = require("../middleware/is-logged-in");
const isAdmin = require("../middleware/is-admin");
const Vacation = require("../models/vacation-model");
const fs = require("fs");
const errorHandler = require("../helpers/error-handler");

const router = express.Router();

router.use(isLoggedIn);

//GET - get all vacations - http://localhost:3000/api/vacations
router.get("/", async (request, response) => {
    try {
        const vacations = await vacationsLogic.getAllVacations();
        response.json(vacations);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//GET - get one vacation - http://localhost:3000/api/vacations/:id
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
        response.status(500).send(errorHandler.getError(err));
    }
});

//POST - add vacation - http://localhost:3000/api/vacations
router.post("/",isAdmin, async (request, response) => {
    try {

        const v = request.body;
        const vacation = new Vacation(undefined, v.description, v.destination, v.img, v.startingDate, v.endingDate, v.price);


        //Validate vacation data: 
        const errors = vacation.validatePostOrPut();

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
        response.status(500).send(errorHandler.getError(err));
    }
});

//PUT - update full vacation - http://localhost:3000/api/vacations/:id
router.put("/:id",isAdmin, async (request, response) => {
    try {
        const id = +request.params.id;
        const v = request.body;

        const vacation = new Vacation(id, v.description, v.destination, v.img, v.startingDate, v.endingDate, v.price);

        // Validate vacation data: 
        const errors = vacation.validatePostOrPut();

        if(errors) {
            response.status(400).send(errors);
            return;
        }

        let oldVacation = new Vacation();
        oldVacation = await vacationsLogic.getOneVacation(id);

        if(oldVacation.img !== vacation.img){
            fs.access("_front-end/assets/images/vacations/" + oldVacation.img, (err)=>{
                if(err) return;
    
                fs.unlink("_front-end/assets/images/vacations/" + oldVacation.img, (err)=> {
                    if (err) throw err;
                });
            });
        }



        const updatedVacation =await vacationsLogic.updateFullVacation(vacation);
        if (!updatedVacation) {
            response.sendStatus(404);
            return;
        }
        response.json(updatedVacation);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


//DELETE - delete a vacation - http://localhost:3000/api/vacations/:id
router.delete("/:id",isAdmin, async (request, response) => {
    try {
        const id = +request.params.id;
        let vacation = new Vacation();
        vacation = await vacationsLogic.getOneVacation(id);

        await vacationsLogic.deleteVacation(id);

        fs.access("_front-end/assets/images/vacations/" + vacation.img, (err)=>{
            if(err) return;

            fs.unlink("_front-end/assets/images/vacations/" + vacation.img, (err)=> {
                if (err) throw err;
            });
        });



        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


module.exports = router;