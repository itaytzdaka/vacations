const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/is-admin");
const path = require("path");
const multer = require('multer')


const storage = multer.diskStorage({
    destination: path.join("_front-end/assets/images/vacations/") ,
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


const fs = require("fs");

// if "_front-end/assets/images/vacations" folder doesn't exist: 
if (!fs.existsSync("_front-end/assets/images/vacations")) {
    fs.mkdirSync("_front-end/assets/images/vacations");
}



// Post img
router.post("/upload-image", isAdmin, upload.single('file'), (request, response) => {

    if (!request.file) {
        response.status(400).send("No file sent");
        return;
    }

    //get the image
    const image = request.file;

    //validate extension
    const extension = image.originalname.substr(image.originalname.lastIndexOf(".")); // e.g: ".jpg"
    console.log("extension: ", extension);

    if (extension != ".jpg" && extension != ".png") {
        response.status(400).send("Illegal file sent");
        return;
    }

    response.end();

});


module.exports = router;