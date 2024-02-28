import { type OkPacket, type RowDataPacket } from 'mysql'
import { runQuery } from '../utilities/database-queries.js'
import { getFutureId } from './futures'
import { getUserIdByDiscordId } from './users'

// returns the order number for customer support
export const createOrder = async (discordId: string, ticker: string, multiple: number): Promise<number | null> => {
  const addOrderQuery = `
    INSERT INTO Orders ( 
        OrderUserId,
        OrderDate,
        OrderFutureId,
        Quantity
    )
    VALUES (
        ?,
        ?,
        ?,
        ?
    )
  `

  try {
    const userId = await getUserIdByDiscordId(discordId)
    const futureId = await getFutureId(ticker)
     // TODO verify date is accurate
    const date = new Date()
    const parameters = [userId, date.toDateString(), futureId, multiple]
    const results = await runQuery(addOrderQuery, parameters)
    console.log('results after creating an order ' + JSON.stringify(results))
    const orderId = results.insertId
    return orderId
  } catch (error: unknown) {
    console.log('Error received in createOrder function: ' + JSON.stringify((error as Error).message))
    throw error
  }
}

export const listOrders = async (): Promise<RowDataPacket[] | OkPacket> => {
  const query = `
    Select * FROM Orders;
  `
  const results = await runQuery(query)
  console.log('listed users' + JSON.stringify(results))
  return results
}
