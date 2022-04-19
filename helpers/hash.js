const crypto = require("crypto");

function hash(password){
    return crypto.createHash("sha512", process.env.SALT_KEY).update(password).digest("hex");
}

module.exports=hash;