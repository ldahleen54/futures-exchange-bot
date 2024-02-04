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
  DROP TABLE IF EXISTS Orders, Users, Futures
`
connection.query(dropTables, (err, results) => {
  if (err) {
    console.error('Error Dropping tables:', err);
    return;
  }
  console.log('Dropped tables: ' + JSON.stringify(results));
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

const createUsersTable = `
CREATE TABLE IF NOT EXISTS Users (
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
  console.log('Users table created or already exists.');
});

const createOrdersTable = `
CREATE TABLE IF NOT EXISTS Orders (
  OrderId INT AUTO_INCREMENT PRIMARY KEY,
  FOREIGN KEY (UserId) REFERENCES Users(UserId),
  OrderDate DATETIME NOT NULL
);`;

connection.query(createOrdersTable, (err, results) => {
  if (err) {
    console.error('Error creating Users table:', err);
    return;
  }
  console.log('Orders table created or already exists.' + JSON.stringify(results));
});

connection.end();