const mysql = require('mysql');
require('dotenv/config');
const connection = mysql.createConnection({
    host     : 'database-1.cqiwllz59ycr.us-east-2.rds.amazonaws.com',
    port     : process.env.DB_PORT,
    user     : process.env.DB_USERNAME,
    database : 'Futures',
    password : process.env.DB_PASSWORD
  });

connection.connect(err => {
  if (err) {
    console.error('An error occurred while connecting to the DB:', err);
    return;
  }
  console.log('Connected to the database successfully!');
});

const dropTables = `
  DROP TABLE Orders, Users, Futures, FutureContracts
`
connection.query(dropTables, (err, results) => {
  if (err) {
    console.error('Error Dropping tables:', err);
    return;
  }
  console.log('Dropped tables: ' + JSON.stringify(results));
});

const createUsersTable = `
CREATE TABLE Users (
  UserId INT AUTO_INCREMENT PRIMARY KEY,
  InGameName VARCHAR(255) NOT NULL UNIQUE,
  DiscordId VARCHAR(255) NOT NULL UNIQUE,
  DiscordName VARCHAR(255) NOT NULL,
  SettledBalance VARCHAR(255) NOT NULL,
  UnSettledBalance VARCHAR(255),
  Frozen TINYINT
);`;

connection.query(createUsersTable, (err, results) => {
  if (err) {
    console.error('Error creating Users table:', err);
    return;
  }
  console.log('Creating users table' + JSON.stringify(results));
});

const checkUsersTable = `
  SELECT * FROM Users;
`
connection.query(checkUsersTable, (err, results) => {
  if (err) {
    console.error('Error showing Users table:', err);
    return;
  }
  console.log('Showing users table' + JSON.stringify(results));
});

const createOrdersTable = `
CREATE TABLE Orders (
  OrderId INT AUTO_INCREMENT PRIMARY KEY,
  OrderUserId INT NOT NULL,
  FOREIGN KEY (OrderUserId) REFERENCES Users(UserId),
  OrderDate DATETIME NOT NULL
);`;

connection.query(createOrdersTable, (err, results) => {
  if (err) {
    console.error('Error creating Orders table:', err);
    return;
  }
  console.log('Orders table created or already exists.' + JSON.stringify(results));
});

const createFuturesTable = `
CREATE TABLE Orders (
  FutureId INT AUTO_INCREMENT PRIMARY KEY,
  Ticker VARCHAR(255) NOT NULL,
  Asset VARCHAR(255) NOT NULL,
  Expiration DATE NOT NULL,
  StrikePrice DECIMAL(50,4),
  Quantity INT NOT NULL,
  Premium DECIMAL(50,4) NOT NULL
);`;

connection.query(createFuturesTable, (err, results) => {
  if (err) {
    console.error('Error creating Futures table:', err);
    return;
  }
  console.log('Futures table created or already exists.' + JSON.stringify(results));
});

const showTables = `
SHOW TABLES;
`;

connection.query(showTables, (err, results) => {
  if (err) {
    console.error('Error creating Users table:', err);
    return;
  }
  console.log('Tables: ' + JSON.stringify(results));
});

connection.end();