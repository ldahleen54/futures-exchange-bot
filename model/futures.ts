import { type RowDataPacket } from 'mysql'
import { runQuery } from '../utilities/database-queries.js'
import { type FutureResult, type Future } from '../types/Future.js'

export const removeFuture = async (ticker: string): Promise<RowDataPacket[]> => {
  const removeUserQuery = `
    DELETE FROM Futures WHERE Ticker = ?
  `
  const parameters = [ticker]
  return await runQuery(removeUserQuery, parameters)
}

export const tickerExists = async (ticker: string): Promise<boolean> => {
  const query = `
        SELECT EXISTS (
            SELECT 1 FROM Futures WHERE Ticker = ?  
        ) AS FutureExists;
  `
  const parameters = [ticker]
  const results = await runQuery(query, parameters)
  return results[0].FutureExists !== 0
}

// returns null if user already exists
export const addFuture = async (future: Future): Promise<RowDataPacket[] | null> => {
  const addFutureQuery = `
    INSERT INTO Futures ( 
        Ticker,
        Asset,
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
  `
  const parameters = [future.ticker, future.asset, future.expiration, future.strikePrice, future.quantity, future.premium]
  const exists = await tickerExists(future.ticker ?? '')
  console.log('check if ticker exists' + exists)
  if (exists) {
    return null
  }
  return await runQuery(addFutureQuery, parameters)
}

export const listFutures = async (): Promise<RowDataPacket[]> => {
  const query = `
    Select * FROM Futures;
  `
  const results = await runQuery(query)
  console.log('listed users' + JSON.stringify(results))
  return results
}

export const getFutureId = async (ticker: string): Promise<number> => {
  const query = `
    Select FutureId FROM Futures WHERE TICKER = ?;
  `
  const parameters = [ticker]
  const results = await runQuery(query, parameters)
  console.log('get future' + JSON.stringify(results))
  const result = results[0] as FutureResult
  return result.FutureId
}
