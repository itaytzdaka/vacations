const mysql = require("mysql");

// Create connection to the database:
const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL || {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
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
function executeAsync(sql, values) {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, result) => {
            if (err) {
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