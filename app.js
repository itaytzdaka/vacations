// global.config = require("./config.json");
global.config = require(process.env.NODE_ENV === "production" ? "./config-prod" : "./config-dev");


const express = require("express");
const session = require("express-session");
const cors = require("cors");
const socketIO = require("socket.io");
const authController = require("./controllers/auth-controller");
const vacationsController = require("./controllers/vacations-controller");
const followsController = require("./controllers/follows-controller");
const purchaseController=require("./controllers/purchases-controller");
const server = express();
const path = require("path");

// server.use(session({
//     name: "CandyShopSession", // Name of the Cookie
//     secret: "CuteKittens", // Encryption key for the session id
//     resave: true, // Start counting session time on each request.
//     saveUninitialized: false // Don't create session automatically.
// }));
server.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));
// server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, "./_front-end")));

server.use("/api/auth", authController);
server.use("/api/vacations", vacationsController);
server.use("/api/follows", followsController);
server.use("/api/purchases", purchaseController);

server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./_front-end/index.html"));
});

const port = process.env.PORT || 3000;
const listener = server.listen(port, () => console.log("Listening on port "+ port));
global.socketServer = socketIO(listener);


socketServer.sockets.on("connection", socket => {
    console.log("Client has been connected.");

    // Listen to client message: 
    socket.on("Admin-updated-a-vacation-from-client", (vacationUpdated) => {

        // Send that message to all clients: 
        socketServer.sockets.emit("Admin-updated-a-vacation-from-server", vacationUpdated);
    });

    socket.on("Admin-added-a-vacation-from-client", (vacation) => {

        // Send that message to all clients: 
        socketServer.sockets.emit("added-vacation-from-server", vacation);
    });

    socket.on("Admin-removed-a-vacation-from-client", (vacation) => {

        // Send that message to all clients: 
        socketServer.sockets.emit("removed-vacation-from-server", vacation);
    });

    socket.on("user-changed-a-follow-from-client", (vacation) => {

        // Send that message to all clients: 
        socketServer.sockets.emit("follows-updated-from-server");
    });

    // Listen to client disconnect: 
    socket.on("disconnect", () => {
        console.log("Client has been disconnected.");
    });
});
