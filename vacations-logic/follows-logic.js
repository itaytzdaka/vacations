const dal = require("../data-access-layer/dal");

async function getAllFollows() {
    const sql = "SELECT * FROM Follows";
    const follows = await dal.executeAsync(sql);
    return follows;
}

async function getOneFollow(follow) {
    const sql = `SELECT * FROM Follows WHERE userName = ? AND vacationId = ?`;
    const follows = await dal.executeAsync(sql, [follow.userName, follow.vacationId]);
    return follows[0];
}


async function addFollow(follow) {
    const sql = `INSERT INTO follows (userName, vacationId) VALUES (?,?)`;
    const info = await dal.executeAsync(sql, [follow.userName, follow.vacationId]);
    follow.followId = info.insertId;
    return follow;
}

async function deleteFollow(followId) {
    const sql = `DELETE FROM follows WHERE followId = ?`;
    await dal.executeAsync(sql, [followId]);
}

module.exports = {
    getAllFollows,
    getOneFollow,
    addFollow,
    deleteFollow
}
