import { type RowDataPacket } from 'mysql'
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
  const futureId = await getFutureId(ticker)
  const userId = await getUserIdByDiscordId(discordId)
  // TODO verify date is accurate
  const date = new Date()
  const parameters = [userId, date.toDateString(), futureId, multiple]
  const results = await runQuery(addOrderQuery, parameters)
  const orderId = results[0].OrderId
  return orderId
}

export const listOrders = async (): Promise<RowDataPacket[]> => {
  const query = `
    Select * FROM Orders;
  `
  const results = await runQuery(query)
  console.log('listed users' + JSON.stringify(results))
  return results
}
