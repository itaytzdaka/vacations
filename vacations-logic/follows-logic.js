const dal = require("../data-access-layer/dal");

async function getAllFollows() {
    const sql = "SELECT * FROM Follows";
    const follows = await dal.executeAsync(sql);
    return follows;
}

async function getOneFollow(follow) {
    const sql = `SELECT * FROM Follows WHERE userName = "${follow.userName}" AND vacationId = ${follow.vacationId}`;
    const follows = await dal.executeAsync(sql);
    return follows[0];
}


async function addFollow(follow) {
    const sql = `INSERT INTO follows (userName, vacationId)
    VALUES ('${follow.userName}', ${follow.vacationId})`;
    const info = await dal.executeAsync(sql);
    follow.followId = info.insertId;
    return follow;
}

async function deleteFollow(followId) {
    const sql = `DELETE FROM follows WHERE followId = ${followId}`;
    await dal.executeAsync(sql);
}

module.exports = {
    getAllFollows,
    getOneFollow,
    addFollow,
    deleteFollow
}
