const dbQuery = require('../utilities/database-queries.js');

// pass user object
const addUser = (user) => {
    let addUserQuery = `
        INSERT INTO Users (InGameName, 
            InGameName,
            DiscordId,
            DiscordName,
            SettledBalance
        )
        VALUES (
            ?,
            ?,
            ?,
            ?
        )
    `;
    const parameters = [user.inGameName, user.discordId, user.discordName, user.SettledBalance];
    return dbQuery.runQuery(addUserQuery, parameters);
}

const listUsers = () => {
    const listUserQuery = `
        SELECT * FROM Users;
    `;
    return dbQuery.runQuery(listUserQuery);
}
//check user next
module.exports = {
    addUser,
    listUsers
};