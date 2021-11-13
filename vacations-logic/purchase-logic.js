const dal = require("../data-access-layer/dal");

//get all purchases
async function getAllPurchases() {
    console.log("purchases logic");
    const sql = "SELECT * FROM purchases";
    // Need to create a JOIN sql to bring also the dish name
    const purchases = await dal.executeAsync(sql);
    return purchases;
}

// // Get one vacation: 
// async function getOneVacation(id) {
//     const sql = `SELECT * FROM vacations WHERE vacationId = ${id}`;
//     const vacations = await dal.executeAsync(sql);
//     return vacations[0];
// }

//add one purchase
async function AddPurchase(p) {
    console.log("post purchase logic")
    const sql = `INSERT INTO purchases(userName, vacationId, tickets, totalPrice, priceForTicket, date)
        VALUES ('${p.userName}','${p.vacationId}','${p.tickets}','${p.totalPrice}','${p.priceForTicket}','${p.date}')`;
    const info = await dal.executeAsync(sql);

    p.purchaseId = info.insertId;
    console.log(p);

    return p;
}

// //update a vacation
// async function updateFullVacation(vacation) {
//     const sql = `UPDATE vacations SET description = '${vacation.description}', destination = '${vacation.destination}', img = '${vacation.img}', startingDate = '${vacation.startingDate}', endingDate = '${vacation.endingDate}', price = ${vacation.price} WHERE vacationId = ${vacation.vacationId}`;
//     const info = await dal.executeAsync(sql);
//     return info.affectedRows === 0 ? null : vacation;
// };

// //delete a vacation
// async function deleteVacation(id) {
//     const sql = `DELETE FROM vacations WHERE vacationId = ${id}`;
//     await dal.executeAsync(sql);
// };

module.exports = {
    getAllPurchases,
    AddPurchase
}
