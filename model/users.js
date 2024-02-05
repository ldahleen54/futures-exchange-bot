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
    let listedUsers = await dbQuery.runQuery(listUserQuery);
    console.log("listed users" + JSON.stringify(listedUsers));
    return listedUsers;
}
//check user next
module.exports = {
    addUser,
    listUsers
};