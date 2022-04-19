const dal = require("../data-access-layer/dal");

//get all purchases
async function getAllPurchases() {
    const sql = "SELECT * FROM purchases";
    const purchases = await dal.executeAsync(sql);
    return purchases;
}

//add one purchase
async function AddPurchase(p) {
    const sql = `INSERT INTO purchases(userName, vacationId, tickets, totalPrice, priceForTicket, date) VALUES (?,?,?,?,?,?)`;
    const info = await dal.executeAsync(sql, [p.userName, p.vacationId, p.tickets, p.totalPrice, p.priceForTicket, p.date]);

    p.purchaseId = info.insertId;
    return p;
}

module.exports = {
    getAllPurchases,
    AddPurchase
}
