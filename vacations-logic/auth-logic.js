const dal = require("../data-access-layer/dal");

//register a user
async function register(user) {
    const sql = `INSERT INTO Users VALUES(
        '${user.firstName}',
        '${user.lastName}',
        '${user.userName}',
        '${user.password}',
        0)`; // 0 = Not Admin

    await dal.executeAsync(sql);
    user.isAdmin = 0;
    return user;
}

//login a user
async function login(credentials) {
    const sql = `SELECT * FROM Users
        WHERE username = '${credentials.userName}'
        AND password = '${credentials.password}'`;
    const users = await dal.executeAsync(sql);
    const user = users[0];
    return user;
}

//update a user
async function updateFullUser(user) {
    const sql = `UPDATE users SET firstName = '${user.firstName}', lastName = '${user.lastName}', password = '${user.password}', isAdmin = ${user.isAdmin} WHERE userName = '${user.userName}'`;
    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : user;
};

//get All Users Names
async function getAllUsersNames() {
    const sql = `SELECT userName FROM Users`;
    const usersNames = await dal.executeAsync(sql);
    return usersNames;
}

module.exports = {
    register,
    login,
    updateFullUser,
    getAllUsersNames
};
