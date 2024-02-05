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




const showTablesQuery = `
  SHOW TABLES;
`;
const showTables = () => {
  try {
    console.log("Showing tables: " + runQuery(showTablesQuery));
  } catch (e) {
    console.error("Error showing tables" + e)
  }
}

const runQuery = async (query, parameters) => {
  if (parameters !== undefined && parameters !== null) {
    return await connection.query(query, parameters, (err, results) => {
      if (err) {
        throw new Error(err);
      }
      console.log("query result with param" + JSON.stringify(results));
      return results;
    });
  } else {
    return await connection.query(query, (err, results) => {
      if (err) {
        throw new Error(err);
      }
      console.log("query results without params" + JSON.stringify(results));
      return results;
    });
  }
}

module.exports = {
  showTables,
  runQuery
};

