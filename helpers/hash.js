const crypto = require("crypto");

const salt = "MakeThingsGoRight";

function hash(password){
    return crypto.createHash("sha512", salt).update(password).digest("hex");
}

module.exports=hash;