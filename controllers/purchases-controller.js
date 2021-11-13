const express = require("express");
const purchaseLogic = require("../vacations-logic/purchase-logic");
const isLoggedIn = require("../middleware/is-logged-in");
const isAdmin = require("../middleware/is-admin");
const Purchase = require("../models/purchase-model");

const router = express.Router();

// router.use(isLoggedIn);

//get all vacations
router.get("/", async (request, response) => {
    try {
        console.log("purchases")
        const purchases = await purchaseLogic.getAllPurchases();
        response.json(purchases);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// //get one vacation
// router.get("/:id", async(request, response) => {
//     try {
//         const id = +request.params.id;
//         const vacation =await vacationsLogic.getOneVacation(id);
//         if (!vacation) {
//             response.sendStatus(404);
//             return;
//         }
//         response.json(vacation);
//     }
//     catch (err) {
//         response.status(500).send(err.message);
//     }
// });

//add vacation
router.post("/", async (request, response) => {
    try {
        console.log("start post purchase");
        const p = request.body;
        const purchase = new Purchase(undefined, p.userName, p.vacationId, p.tickets, p.totalPrice, p.priceForTicket, p.date);
        console.log("purchase");
        console.log(purchase);
        // Validate vacation data: 
        // const errors = purchase.validatePost();

        // if(errors) {
        //     response.status(400).send(errors);
        //     return;
        // }
        console.log("bdik");
        const addedPurchase =await purchaseLogic.AddPurchase(purchase);
        if (!addedPurchase) {
            response.sendStatus(404);
            return;
        }
        console.log("addedPurchase");
        console.log(addedPurchase);
        response.json(addedPurchase);
    }
    catch (err) {
        console.log(err);
        response.status(500).send(err.message);
    }
});

// //update full vacation
// router.put("/:id",isAdmin, async (request, response) => {
//     try {
//         const id = +request.params.id;
//         const v = request.body;
//         const vacation = new Vacation(id, v.description, v.destination, v.img, v.startingDate, v.endingDate, v.price);

//         const errors = vacation.validatePut();

//         if(errors) {
//             response.status(400).send(errors);
//             return;
//         }

//         const updatedVacation =await vacationsLogic.updateFullVacation(vacation);
//         if (!updatedVacation) {
//             response.sendStatus(404);
//             return;
//         }
//         response.json(updatedVacation);
//     }
//     catch (err) {
//         response.status(500).send(err.message);
//     }
// });


// // DELETE vacation
// router.delete("/:id",isAdmin, (request, response) => {
//     try {
//         const id = +request.params.id;
//         vacationsLogic.deleteVacation(id);
//         response.sendStatus(204);
//     }
//     catch (err) {
//         response.status(500).send(err.message);
//     }
// });


module.exports = router;