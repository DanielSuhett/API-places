const mySQL = require('mysql');
const envConfig = require('./config');
const env = process.env.NODE_ENV || 'development';
const config = envConfig[env];

const connection = mySQL.createConnection(config)

connection.connect((err) => {
  if(err){
    console.error('error connecting: ' + err.stack);
    return;
  }
    console.log('connected as id ' + connection.threadId);
})

module.exports = connection