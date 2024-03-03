import { type OkPacket, type RowDataPacket } from 'mysql'
import { runQuery } from '../utilities/database-queries.js'
import { getFutureId, getPremium, getPrice } from './futures'
import { getUserIdByDiscordId } from './users'

// returns the order number for customer support
export const createBuyOrder = async (discordId: string, ticker: string, multiple: number): Promise<number | null> => {
  const addOrderQuery = `
    INSERT INTO Orders ( 
        OrderUserId,
        OrderType,
        OrderDate,
        OrderFutureId,
        Quantity
    )
    VALUES (
        ?,
        'MarketBuy',
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
    const results = (await runQuery(addOrderQuery, parameters) as OkPacket)
    console.log('results after creating an order ' + JSON.stringify(results))
    const orderId = results.insertId
    return orderId
  } catch (error: unknown) {
    console.log('Error received in createBuyOrder function: ' + JSON.stringify((error as Error).message))
    throw error
  }
}

export const createSellOrder = async (discordId: string, ticker: string, multiple: number): Promise<number | null> => {
  const addOrderQuery = `
    INSERT INTO Orders ( 
        OrderUserId,
        OrderType,
        OrderDate,
        OrderFutureId,
        Quantity
    )
    VALUES (
        ?,
        'MarketSell',
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
    const results = (await runQuery(addOrderQuery, parameters) as OkPacket)
    console.log('results after creating an order ' + JSON.stringify(results))
    const orderId = results.insertId
    return orderId
  } catch (error: unknown) {
    console.log('Error received in getUserIdByDiscordId function: ' + JSON.stringify((error as Error).message))
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

export const calculateBuyOrderCost = async (ticker: string, quantity: number): Promise<number> => {
  const price = await getPrice(ticker)
  const premium = await getPremium(ticker)
  return (price * quantity) + (premium * quantity)
}
