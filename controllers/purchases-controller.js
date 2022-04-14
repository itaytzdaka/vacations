const express = require("express");
const purchaseLogic = require("../vacations-logic/purchase-logic");
const isAdmin = require("../middleware/is-admin");
const Purchase = require("../models/purchase-model");

const router = express.Router();

//GET - get all purchases - http://localhost:3000/api/purchases
router.get("/", isAdmin, async (request, response) => {
    try {
        const purchases = await purchaseLogic.getAllPurchases();
        response.json(purchases);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});


//POST - add purchase - http://localhost:3000/api/purchases
router.post("/", async (request, response) => {
    try {
        const p = request.body;
        const purchase = new Purchase(undefined, p.userName, p.vacationId, p.tickets, p.totalPrice, p.priceForTicket, p.date);

        // Validate purchase data: 
        const errors = purchase.validatePostOrPut();

        if(errors) {
            response.status(400).send(errors[0]);
            return;
        }

        const addedPurchase =await purchaseLogic.AddPurchase(purchase);

        if (!addedPurchase) {
            response.sendStatus(404);
            return;
        }

        //return addedPurchase
        response.json(addedPurchase);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});


// DELETE a purchase
// router.delete("/:id",isAdmin, async (request, response) => {
//     try {
//         const id = +request.params.id;
//         await purchaseLogic.deletePurchase(id);
//         response.sendStatus(204);
//     }
//     catch (err) {
//         response.status(500).send(err.message);
//     }
// });


module.exports = router;