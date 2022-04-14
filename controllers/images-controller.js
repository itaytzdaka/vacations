const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/is-admin");
const formidable = require('formidable');
const path = require("path");

const fs = require("fs");

// if "_front-end/assets/images/vacations" folder doesn't exist: 
if (!fs.existsSync("_front-end/assets/images/vacations")) {
    fs.mkdirSync("_front-end/assets/images/vacations");
}

//POST - add img of vacation - http://localhost:3000/upload-image
router.post("/upload-image", isAdmin, (request, response) => {
    const form = new formidable.IncomingForm();

    form.parse(request, function (err, fields, files) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
 
        //get the image
        const image = files[Object.keys(files)];

        //validate extension
        const extension = image.originalFilename.substr(image.originalFilename.lastIndexOf(".")); // e.g: ".jpg"
        if(extension != ".jpg" && extension != ".png") {
            response.status(400).send("Illegal file sent");
            return;
        }

        //save img locally
        // fs.renameSync(image.filepath, "_front-end/assets/images/vacations/" + image.originalFilename);
        fs.renameSync(image.filepath, path.join(__dirname, "./../_front-end/assets/images/vacations/" + image.originalFilename));

        response.end();

    });
});


module.exports = router;