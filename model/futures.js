const dbQuery = require('../utilities/database-queries.js');

const removeFuture = async (ticker) => {
    const removeUserQuery = `
        DELETE FROM Futures WHERE Ticker = ?
    `;
    const parameters = [ticker];
    return await dbQuery.runQuery(removeUserQuery, parameters);
}

// returns null if user already exists
const addFuture = async (future) => {
    const addFutureQuery = `
        INSERT INTO Futures ( 
            Ticker,
            ItemName,
            Expiration,
            StrikePrice,
            Quantity,
            Premium
        )
        VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `;
    const parameters = [future.ticker, future.itemName, future.expiration, future.strikePrice, future.quantity, future.premium];
    const tickerExists = tickerExists(future.ticker); 
    console.log("check if ticker exists" + tickerExists);
    if (tickerExists) {
        return null;
    }
    return await dbQuery.runQuery(addFutureQuery, parameters);
}

const tickerExists = async (ticker) => {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM Futures WHERE Ticker = ?  
        ) AS FutureExists;
    `;
    const parameters = [ticker];
    let results = await dbQuery.runQuery(query, parameters);
    return results[0].FutureExists === 0 ? false : true;
}

const listFutures = async () => {
    const query = `
        Select * FROM Futures;
    `;
    let results = await dbQuery.runQuery(query);
    console.log("listed users" + JSON.stringify(results));
    return results;
}


module.exports = {
    addFuture,
    listFutures,
    removeFuture,
    tickerExists
};