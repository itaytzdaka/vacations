const dal = require("../data-access-layer/dal");
const hash = require("../helpers/hash");

//register a user
async function register(user) {

    // Hash user password: 
    user.password = hash(user.password);

    const sql = `INSERT INTO Users VALUES(?,?,?,?,?)`; 

    await dal.executeAsync(sql, [user.firstName, user.lastName, user.userName, user.password, 0]); // 0 = Not Admin

    user.isAdmin = 0;

    //delete password for security
    delete user.password;

    return user;
}

//login a user
async function login(credentials) {

    // Hash user password:
    credentials.password = hash(credentials.password);

    const sql = `
    SELECT firstName, lastName, userName, isAdmin
    FROM users
    WHERE username = ? AND password = ?`;
    const users = await dal.executeAsync(sql, [credentials.userName, credentials.password]);
    const user = users[0];

    return user;
}

//update a user
async function updateFullUser(user) {
    const sql = `UPDATE users SET firstName = ?, lastName = ?, password = ?, isAdmin = ? WHERE userName = ?`;
    const info = await dal.executeAsync(sql, [user.firstName, user.lastName, user.password, user.isAdmin, user.userName]);
    return info.affectedRows === 0 ? null : user;
};

//get All Users Names
async function getAllUsersNames() {
    const sql = `SELECT userName FROM users`;
    const usersNames = await dal.executeAsync(sql);
    return usersNames;
}

module.exports = {
    register,
    login,
    updateFullUser,
    getAllUsersNames
};
