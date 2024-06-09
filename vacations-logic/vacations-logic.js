const dal = require("../data-access-layer/dal");

//get all vacations
async function getAllVacations() {
    const sql = "SELECT * FROM vacations";
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

// Get one vacation: 
async function getOneVacation(id) {
    const sql = `SELECT * FROM vacations WHERE vacationId = ?`;
    const vacations = await dal.executeAsync(sql , [id]);
    return vacations[0];
}

//add one vacation
async function addVacation(vacation) {
    const sql = `INSERT INTO vacations(description, destination, img, startingDate, endingDate, price) VALUES (?,?,?,?,?,?)`;
    const info = await dal.executeAsync(sql, [vacation.description, vacation.destination, vacation.img, vacation.startingDate, vacation.endingDate, vacation.price]);

    vacation.vacationId = info.insertId;
    return vacation;
}

//update a vacation
async function updateFullVacation(vacation) {
    const sql = `UPDATE vacations SET description = ?, destination = ?, img = ?, startingDate = ?, endingDate = ?, price = ? WHERE vacationId = ?`;
    const info = await dal.executeAsync(sql, [vacation.description, vacation.destination, vacation.img, vacation.startingDate, vacation.endingDate, vacation.price, vacation.vacationId]);
    return info.affectedRows === 0 ? null : vacation;
};

//delete a vacation
async function deleteVacation(id) {
    const sql = `DELETE FROM vacations WHERE vacationId = ?`;
    await dal.executeAsync(sql, [id]);
};

module.exports = {
    getAllVacations,
    getOneVacation,
    addVacation,
    updateFullVacation,
    deleteVacation
}
