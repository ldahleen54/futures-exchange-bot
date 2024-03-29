import mysql, { type OkPacket, type QueryError, type RowDataPacket } from 'mysql'

const connection = mysql.createConnection({
  host: 'database-1.cqiwllz59ycr.us-east-2.rds.amazonaws.com',
  port: process.env.DB_PORT !== undefined ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USERNAME,
  database: 'Futures',
  password: process.env.DB_PASSWORD
})

const showTablesQuery = `
  SHOW TABLES;
`
export const showTables = async (): Promise<void> => {
  try {
    console.log('Showing tables: ' + JSON.stringify(await runQuery(showTablesQuery)))
  } catch (error: unknown) {
    console.error('Error showing tables' + String(error))
  }
}

export const runQuery = async (query: string, parameters?: Array<string | number>): Promise<RowDataPacket[] | OkPacket> => {
  return await new Promise((resolve, reject) => {
    console.log('running query')
    if (parameters !== undefined) {
      console.log('running query with params')
      connection.query(query, parameters, (error: QueryError | null, results: RowDataPacket[]) => {
        if (error !== null) {
          console.log('rejecting query with error' + JSON.stringify(error))
          reject(error)
        } else {
          console.log('resolving query with results: ' + JSON.stringify(results))
          resolve(results)
        }
      })
    } else {
      connection.query(query, (error: QueryError | null, results: RowDataPacket[]) => {
        console.log('running query without params')
        if (error !== null) {
          console.log('rejecting query with error' + JSON.stringify(error))
          reject(error)
        } else {
          console.log('resolving query with results: ' + JSON.stringify(results))
          resolve(results)
        }
      })
    }
  })
}

process.on('SIGINT', () => {
  connection.end(error => {
    if (error !== undefined) {
      console.error('Failed to close MySQL connection', error)
    } else {
      console.log('MySQL connection closed')
    }
    // Exit process after closing connections
    process.exit(error !== undefined ? 1 : 0)
  })
})
