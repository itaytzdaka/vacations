const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/is-admin");
const formidable = require('formidable');
const path = require("path");
const multer = require('multer')
const uuid = require("uuid");

const storage = multer.diskStorage({
    // destination: path.join(__dirname, "./../_front-end/assets/images/vacations/") ,
    destination: path.join("_front-end/assets/images/vacations/") ,
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

// const upload = multer({ dest: path.join(__dirname, "./../_front-end/assets/images/vacations/") });
const upload = multer({ storage: storage });


const fs = require("fs");

// if "_front-end/assets/images/vacations" folder doesn't exist: 
if (!fs.existsSync("_front-end/assets/images/vacations")) {
    fs.mkdirSync("_front-end/assets/images/vacations");
}

//POST - add img of vacation - http://localhost:3000/upload-image
// router.post("/upload-image", isAdmin, (request, response) => {
//     const form = new formidable.IncomingForm();

//     form.parse(request, function (err, fields, files) {
//         if (err) {
//             return res.status(400).json({ error: err.message });
//         }

//         //get the image
//         const image = files[Object.keys(files)];

//         //validate extension
//         const extension = image.originalFilename.substr(image.originalFilename.lastIndexOf(".")); // e.g: ".jpg"
//         if(extension != ".jpg" && extension != ".png") {
//             response.status(400).send("Illegal file sent");
//             return;
//         }

//         //save img locally
//         // fs.renameSync(image.filepath, "_front-end/assets/images/vacations/" + image.originalFilename);
//         //
//         fs.renameSync(image.filepath, path.join(__dirname, "./../_front-end/assets/images/vacations/" + image.originalFilename));

//         response.end();

//     });
// });


// Post img
router.post("/upload-image", upload.single('file'), (request, response) => {

    console.log("request.file");
    console.log(request.file);

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

    //save img locally
    // fs.renameSync(image.filepath, "_front-end/assets/images/vacations/" + image.originalFilename);
    //
    // fs.renameSync(image.filepath, path.join(__dirname, "./../_front-end/assets/images/vacations/" + image.originalname));

    response.end();

    // const extension = file.originalname.substr(file.originalname.lastIndexOf(".")); // e.g: ".jpg"
    // console.log("extension: ", extension);

    // if(extension != ".jpg" && extension != ".png") {
    //     response.status(400).send("Illegal file sent");
    //     return;
    // }

    // const newFileName = uuid.v4() + extension;
    // file.mv("_front-end/uploads/" + newFileName);
    // file.originalname=newFileName;
    // response.status(201).json(file);

});

router.delete("/:imageName", isAdmin, (request, response) => {
    try {
        const imageName = request.params.imageName;
        const path = "./uploads/" + imageName;
        fs.unlinkSync(path);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;