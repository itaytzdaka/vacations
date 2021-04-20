const dal = require("../data-access-layer/dal");


async function getAllFollows() {
    const sql = "SELECT * FROM Follows";
    // Need to create a JOIN sql to bring also the dish name
    const follows = await dal.executeAsync(sql);
    return follows;
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
    addFollow,
    deleteFollow
}
