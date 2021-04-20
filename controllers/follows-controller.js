const express = require("express");
const followsLogic = require("../vacations-logic/follows-logic");
const isLoggedIn = require("../middleware/is-logged-in");
const router = express.Router();

router.use(isLoggedIn);

//get all follows
router.get("/", async (request, response) => {
    try {
        const follows = await followsLogic.getAllFollows();
        response.json(follows);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

//add follow
router.post("/", async (request, response) => {
    try {
        const follow = request.body;
        const addedFollow = await followsLogic.addFollow(follow);
        response.status(201).json(addedFollow);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// DELETE follow
router.delete("/:id", (request, response) => {
    try {
        const id = +request.params.id;
        followsLogic.deleteFollow(id);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;