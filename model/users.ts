import { runQuery } from '../utilities/database-queries.js'
import { type UserResult, type User } from '../types/User'
import { type RowDataPacket } from 'mysql'

export const removeUser = async (user: User): Promise<RowDataPacket[]> => {
  const removeUserQuery = `
    DELETE FROM Users WHERE InGameName = ?
  `
  const parameters = [user.inGameName]
  return await runQuery(removeUserQuery, parameters)
}

// TODO replace user in case the inGameName is incorrect

// returns true if user exists already
export const inGameNameExists = async (inGameName: string): Promise<boolean> => {
  const query = `
      SELECT EXISTS (
          SELECT 1 FROM Users WHERE InGameName = ?  
      ) AS userExists;
    `
  const parameters = [inGameName]
  const results = await runQuery(query, parameters)
  return results[0].userExists !== 0
}

export const discordNameExists = async (discordName: string): Promise<boolean> => {
  const query = `
        SELECT EXISTS (
            SELECT 1 FROM Users WHERE DiscordName = ?  
        ) AS userExists;
    `
  const parameters = [discordName]
  try {
    const results = await runQuery(query, parameters)
    return results[0].userExists !== 0
  } catch (error) {
    console.log('Error running query: ' + JSON.stringify(error))
    throw error
  }
}

export const getUserIdByDiscordId = async (discordId: string): Promise<number> => {
  console.log('inside get user id by discord id ' + discordId)
  const getUserIdQuery = `
    SELECT UserId FROM Users WHERE DiscordId = ?;
  `
  const parameters = [discordId]
  console.log(' running query with params: ' + JSON.stringify(parameters))
  // try {
  //   const results = await runQuery(getUserIdQuery, parameters)
  //   console.log('get user id results' + JSON.stringify(results))
  //   const result = results[0] as UserResult
  //   return result.UserId
  // } catch (error) {
  //   console.log('Error running query: ' + JSON.stringify(error))
  //   throw error
  // }
}

// returns null if user already exists
export const addUser = async (user: User): Promise<RowDataPacket[] | null> => {
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
    `
  const parameters = [user.inGameName, user.discordId, user.discordName, user.settledBalance]
  if (await inGameNameExists(user.inGameName) || await discordNameExists(user.discordName)) {
    return null
  }
  return await runQuery(addUserQuery, parameters)
}

export const listUsers = async (): Promise<RowDataPacket[]> => {
  const listUserQuery = `
    SELECT * FROM Users;
  `
  const listedUsers = await runQuery(listUserQuery)
  console.log('listed users' + JSON.stringify(listedUsers))
  return listedUsers
}

module.exports = {
  removeUser,
  addUser,
  listUsers,
  inGameNameExists,
  discordNameExists
}
