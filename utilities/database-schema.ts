import { createConnection } from 'mysql'
const connection = createConnection({
  host: 'database-1.cqiwllz59ycr.us-east-2.rds.amazonaws.com',
  port: process.env.DB_PORT !== undefined ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USERNAME,
  database: 'Futures',
  password: process.env.DB_PASSWORD
})

connection.connect(error => {
  if (error !== undefined) {
    console.error('An error occurred while connecting to the DB:', error)
    return
  }
  console.log('Connected to the database successfully!')
})

const dropTables = `
  DROP TABLE Users, Futures
`
connection.query(dropTables, (error, results) => {
  if (error !== undefined) {
    console.error('Error Dropping tables:', error)
    return
  }
  console.log('Dropped tables: ' + JSON.stringify(results))
})

const createUsersTable = `
CREATE TABLE Users (
  UserId INT AUTO_INCREMENT PRIMARY KEY,
  InGameName VARCHAR(255) NOT NULL UNIQUE,
  DiscordId VARCHAR(255) NOT NULL UNIQUE,
  DiscordName VARCHAR(255) NOT NULL,
  SettledBalance INT NOT NULL,
  UnSettledBalance INT,
  Frozen TINYINT
);`
connection.query(createUsersTable, (error, results) => {
  if (error !== undefined) {
    console.error('Error creating Users table:', error)
    return
  }
  console.log('Creating users table' + JSON.stringify(results))
})

const checkUsersTable = `
  SELECT * FROM Users;
`
connection.query(checkUsersTable, (error, results) => {
  if (error !== undefined) {
    console.error('Error showing Users table:', error)
    return
  }
  console.log('Showing users table' + JSON.stringify(results))
})

const createFuturesTable = `
CREATE TABLE Futures (
  FutureId INT AUTO_INCREMENT PRIMARY KEY,
  Ticker VARCHAR(255) NOT NULL,
  Asset VARCHAR(255) NOT NULL,
  Expiration DATE NOT NULL,
  StrikePrice DECIMAL(50,4),
  Quantity INT NOT NULL,
  Premium DECIMAL(50,4) NOT NULL
);`
connection.query(createFuturesTable, (error, results) => {
  if (error !== undefined) {
    console.error('Error creating Futures table:', error)
    return
  }
  console.log('Futures table created or already exists.' + JSON.stringify(results))
})

const createOrdersTable = `
CREATE TABLE Orders (
  OrderId INT AUTO_INCREMENT PRIMARY KEY,
  OrderType VARCHAR(255) NOT NULL,
  OrderUserId INT NOT NULL,
  FOREIGN KEY (OrderUserId) REFERENCES Users(UserId),
  OrderDate DATETIME NOT NULL,
  OrderFutureId INT NOT NULL,
  FOREIGN KEY (OrderFutureId) REFERENCES Futures(FutureId),
  Quantity INT NOT NULL
);`
connection.query(createOrdersTable, (error, results) => {
  if (error !== undefined) {
    console.error('Error creating Orders table:', error)
    return
  }
  console.log('Orders table created or already exists.' + JSON.stringify(results))
})

const showTables = `
SHOW TABLES;
`
connection.query(showTables, (error, results) => {
  if (error !== undefined) {
    console.error('Error creating Users table:', error)
    return
  }
  console.log('Tables: ' + JSON.stringify(results))
})

connection.end()
