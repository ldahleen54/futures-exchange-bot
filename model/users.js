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

// returns result from checkUserQuery
const checkUser = async (user) => {
    const checkUserQuery = `
        SELECT EXISTS (
            SELECT 1 FROM Users WHERE InGameName = ?  
        ) AS userExists;
    `;
    const parameters = [user.inGameName];
    let results = await dbQuery.runQuery(checkUserQuery, parameters);
    return results[0].userExists;
}

// add user returns null if user already exists
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
    console.log("check user" + JSON.stringify(checkUser(user)));
    if (checkUser(user)) {
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
    addUser,
    listUsers
};