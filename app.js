//config file for connecting the DB.
// global.config = require(process.env.NODE_ENV === "production" ? "./config-prod" : "./config-dev");

//if development, load .env file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//create the server
const express = require("express");
const server = express();


const session = require("express-session");
server.use(session({
    name: "CaptchaSession", // Name of the Cookie
    secret: "notForRobots", // Encryption key for the session id
    resave: true, // Start counting session time on each request.
    saveUninitialized: false // Don't create session automatically.
}));


//localhost permission
const cors = require("cors");
// server.use(cors());

server.use(cors({
    origin: "http://localhost:3001",
    credentials: true //for alow passing cookies from client to server
}));

const expressRateLimit = require("express-rate-limit");
server.use("/api/",expressRateLimit({
    windowMs: 10 * 1000, //10 seconds
    max: 20,
    message: "Too much requests, Try again later."
}));


// add controllers for api
server.use(express.json());

//use cookie in request
const cookieParser = require("cookie-parser");
server.use(cookieParser());


const authController = require("./controllers/auth-controller");
const vacationsController = require("./controllers/vacations-controller");
const followsController = require("./controllers/follows-controller");
const purchaseController=require("./controllers/purchases-controller");
const imagesController=require("./controllers/images-controller");

server.use("/api/auth", authController);
server.use("/api/vacations", vacationsController);
server.use("/api/follows", followsController);
server.use("/api/purchases", purchaseController);
server.use("/", imagesController);


const path = require("path");

//serve static files for client, like images.
server.use(express.static(path.join(__dirname, "./_front-end")));

//any other route serve index.html, for example : \login
server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./_front-end/index.html"));
});

//define the port and run the server
const port = process.env.PORT || 3000;
const listener = server.listen(port, () => console.log("Listening on port "+ port));


//socket io events
const socketIO = require("socket.io");
global.socketServer = socketIO(listener);


socketServer.sockets.on("connection", socket => {

    // Listen to client message: 
    socket.on("Admin-updated-a-vacation-from-client", (vacationUpdated) => {

        // Send that message to all clients: 
        socketServer.sockets.emit("Admin-updated-a-vacation-from-server", vacationUpdated);
    });

    socket.on("Admin-added-a-vacation-from-client", (vacation) => {
        // Send that message to all clients: 
        socketServer.sockets.emit("added-vacation-from-server", vacation);
    });

    socket.on("Admin-removed-a-vacation-from-client", (vacationId) => {

        // Send that message to all clients: 
        socketServer.sockets.emit("removed-vacation-from-server", vacationId);
    });

    socket.on("user-added-a-follow-from-client", (followAdded) => {

        // Send that message to all clients: 
        socketServer.sockets.emit("follow-added-from-server", followAdded);
    });

    socket.on("user-removed-a-follow-from-client", (followId) => {

        // Send that message to all clients: 
        socketServer.sockets.emit("follow-removed-from-server", followId);
    });

    socket.on("user-added-a-purchase-from-client", (purchase) => {
        console.log("user-added-a-purchase-from-client");
        // Send that message to all clients: 
        socketServer.sockets.emit("purchase-added-from-server", purchase);
    });

    // Listen to client disconnect: 
    socket.on("disconnect", () => {
        // console.log("Client has been disconnected.");
    });
});
