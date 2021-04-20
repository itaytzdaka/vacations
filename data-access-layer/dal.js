const mysql = require("mysql");

// Create connection to the database:
const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

// Connect to the database: 
pool.getConnection(err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("We're connected to our database on MySQL.");
});

// Execute SQL statement:
function executeAsync(sql) {
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = {
    executeAsync
};