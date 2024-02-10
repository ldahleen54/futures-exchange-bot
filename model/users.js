const dbQuery = require('../utilities/database-queries.js');

const removeUser = async (user) => {
    const removeUserQuery = `
        DELETE FROM Users WHERE InGameName = ?
    `;
    const parameters = [user.inGameName];
    return await dbQuery.runQuery(removeUserQuery, parameters);
}

// TODO replace user in case the inGameName is incorrect
const replaceUser = async (inGameName) => {
    return null;
}

// returns true if user exists already
const inGameNameExists = async (inGameName) => {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM Users WHERE InGameName = ?  
        ) AS userExists;
    `;
    const parameters = [inGameName];
    let results = await dbQuery.runQuery(query, parameters);
    return results[0].userExists === 0 ? false : true;
}

const discordNameExists = async (discordName) => {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM Users WHERE DiscordName = ?  
        ) AS userExists;
    `;
    const parameters = [discordName];
    let results = await dbQuery.runQuery(query, parameters);
    return results[0].userExists === 0 ? false : true;
}

// returns null if user already exists
const addUser = async (user) => {
    const addUserQuery = `
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
    console.log("check if in game name exists" + JSON.stringify(inGameNameExists(user.inGameName)));
    if (inGameNameExists(user.inGameName) === true || discordNameExists(user.discordName) === true) {
        return null;
    }
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
    removeUser,
    addUser,
    listUsers,
    inGameNameExists,
    discordNameExists
};