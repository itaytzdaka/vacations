const dal = require("../data-access-layer/dal");

//get all vacations
async function getAllVacations() {
    const sql = "SELECT * FROM Vacations";
    // Need to create a JOIN sql to bring also the dish name
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

// Get one vacation: 
async function getOneVacation(id) {
    const sql = `SELECT * FROM vacations WHERE vacationId = ${id}`;
    const vacations = await dal.executeAsync(sql);
    return vacations[0];
}

//add one vacation
async function addVacation(vacation) {
    const sql = `INSERT INTO vacations(description, destination, img, startingDate, endingDate, price)
        VALUES ('${vacation.description}','${vacation.destination}','${vacation.img}','${vacation.startingDate}','${vacation.endingDate}',${vacation.price})`;
    const info = await dal.executeAsync(sql);


    vacation.vacationId = info.insertId;
    return vacation;
}

//update a vacation
async function updateFullVacation(vacation) {
    const sql = `UPDATE vacations SET description = '${vacation.description}', destination = '${vacation.destination}', img = '${vacation.img}', startingDate = '${vacation.startingDate}', endingDate = '${vacation.endingDate}', price = ${vacation.price} WHERE vacationId = ${vacation.vacationId}`;
    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : vacation;
};

//delete a vacation
async function deleteVacation(id) {
    const sql = `DELETE FROM vacations WHERE vacationId = ${id}`;
    await dal.executeAsync(sql);
};

module.exports = {
    getAllVacations,
    getOneVacation,
    addVacation,
    updateFullVacation,
    deleteVacation
}
