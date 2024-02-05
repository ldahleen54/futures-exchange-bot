const dbQuery = require('../utilities/database-queries.js');

// pass user object
const addUser = async (user) => {
    let addUserQuery = `
        INSERT INTO Users ( 
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
    const parameters = [user.inGameName, user.discordId, user.discordName, user.settledBalance];
    return await dbQuery.runQuery(addUserQuery, parameters);
}

const listUsers = async () => {
    const listUserQuery = `
        SELECT * FROM Users;
    `;
    return await dbQuery.runQuery(listUserQuery);
}
//check user next
module.exports = {
    addUser,
    listUsers
};