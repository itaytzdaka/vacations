const express = require("express");
const followsLogic = require("../vacations-logic/follows-logic");
const isLoggedIn = require("../middleware/is-logged-in");
const router = express.Router();

router.use(isLoggedIn);

//GET - get all follows - http://localhost:3000/api/follows
router.get("/", async (request, response) => {
    try {
        const follows = await followsLogic.getAllFollows();
        response.json(follows);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

//Post - add follow - http://localhost:3000/api/follows
router.post("/", async (request, response) => {
    try {
        const followToAdd = request.body;
        const follow=await followsLogic.getOneFollow(followToAdd);

        if(!follow){
            const addedFollow = await followsLogic.addFollow(followToAdd);
            response.status(201).json(addedFollow);
        }

        response.status(201).json(follow);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

//DELETE - delete follow - http://localhost:3000/api/follows/:id
router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await followsLogic.deleteFollow(id);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;